import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import  { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: { email: string; password: string; name: string }) {
    try {
      return await this.prisma.user.create({
        data: userData,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    } catch (error) {
      if (error.code === "P2002") {
        // Unique constraint violation
        throw new ConflictException("Email already exists")
      }
      throw error
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    })
  }

  async update(id: number, updateData: { name?: string }) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    } catch (error) {
      if (error.code === "P2025") {
        // Record not found
        throw new NotFoundException("User not found")
      }
      throw error
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      })
      return { message: "User deleted successfully" }
    } catch (error) {
      if (error.code === "P2025") {
        // Record not found
        throw new NotFoundException("User not found")
      }
      throw error
    }
  }
}
