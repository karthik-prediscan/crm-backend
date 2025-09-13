import { Injectable, NotFoundException } from "@nestjs/common"
import  { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(contactData: {
    name: string
    email?: string
    phone?: string
    position?: string
    companyId?: number
    notes?: string
  }) {
    return await this.prisma.contact.create({
      data: {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        position: contactData.position,
        companyId: contactData.companyId,
        notes: contactData.notes,
      },
    })
  }

  async findAll(page = 1, limit = 10, sortBy = "createdAt", sortOrder: "asc" | "desc" = "desc") {
    const skip = (page - 1) * limit
    const validSortColumns = ["name", "email", "position", "createdAt", "updatedAt"]
    const orderBy = validSortColumns.includes(sortBy) ? sortBy : "createdAt"

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        skip,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prisma.contact.count(),
    ])

    const transformedData = data.map((contact) => ({
      ...contact,
      company_name: contact.company?.name || null,
    }))

    return {
      data: transformedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: number) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!contact) {
      throw new NotFoundException("Contact not found")
    }

    return {
      ...contact,
      company_name: contact.company?.name || null,
    }
  }

  async update(
    id: number,
    updateData: {
      name?: string
      email?: string
      phone?: string
      position?: string
      companyId?: number
      notes?: string
    },
  ) {
    try {
      return await this.prisma.contact.update({
        where: { id },
        data: {
          name: updateData.name,
          email: updateData.email,
          phone: updateData.phone,
          position: updateData.position,
          companyId: updateData.companyId,
          notes: updateData.notes,
        },
      })
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Contact not found")
      }
      throw error
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.contact.delete({
        where: { id },
      })
      return { message: "Contact deleted successfully" }
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Contact not found")
      }
      throw error
    }
  }
}
