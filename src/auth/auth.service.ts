import { Injectable } from "@nestjs/common"
import  { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import  { UsersService } from "../users/users.service"
import { profile } from "console"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user) {
    const payload = { email: user.email, sub: user.id, name: user.name }
    try{
    const valid=await this.validateUser(user.email, user.password)
    return {
      access_token: this.jwtService.sign(payload),

    }}catch(err){
      return err
    }
  }

  async register(userData: { email: string; password: string; name: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    })

    return this.login(user)
  }
  async getProfile(token: string) {
    const decoded = this.jwtService.decode(token.replace("Bearer ", ""))
    const user= await this.usersService.findByEmail(decoded["email"])
    return user
  }
}

