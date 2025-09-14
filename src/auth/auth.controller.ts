import { Controller, Post, Get, UseGuards, Body, Headers } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import  { AuthService } from "./auth.service"
import { JwtAuthGuard } from "./jwt-auth.guard"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body)
  }
  
  @Post("register")
  async register(@Body() body: { email: string; password: string; firstName: string; lastName: string }) {
    const { email, password, firstName, lastName } = body;
    const name = `${firstName} ${lastName}`.trim();
    return this.authService.register({ email, password, name });
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Headers() header: { authorization: string }) {
    return this.authService.getProfile(header.authorization);
  }
}
