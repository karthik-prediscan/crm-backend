import { Injectable, NotFoundException } from "@nestjs/common"
import  { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(companyData: {
    name: string
    website?: string
    phone?: string
    email?: string
    industry?: string
    address?: string
    description?: string
  }) {
    return await this.prisma.company.create({
      data: {
        name: companyData.name,
        website: companyData.website,
        phone: companyData.phone,
        email: companyData.email,
        industry: companyData.industry,
        address: companyData.address,
        description: companyData.description
      },
    })
  }

  async findAll(page = 1, limit = 10, sortBy = "createdAt", sortOrder: "asc" | "desc" = "desc") {
    const skip = (page - 1) * limit
    const validSortColumns = ["name", "industry", "createdAt", "updatedAt"]
    const orderBy = validSortColumns.includes(sortBy) ? sortBy : "createdAt"

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        skip,
        take: limit,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prisma.company.count(),
    ])

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      throw new NotFoundException("Company not found")
    }
    return company
  }

  async update(
    id: number,
    updateData: {
      name?: string
      website?: string
      phone?: string
      email?: string
      industry?: string
      address?: string
      description?: string
    },
  ) {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: updateData,
      })
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Company not found")
      }
      throw error
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.company.delete({
        where: { id },
      })
      return { message: "Company deleted successfully" }
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Company not found")
      }
      throw error
    }
  }
}
