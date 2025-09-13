import { Injectable, NotFoundException } from "@nestjs/common"
import  { PrismaService } from "../prisma/prisma.service"
import { Decimal } from "@prisma/client/runtime/library"

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async create(dealData: {
    title: string
    description?: string
    value?: number
    stage?: string
    companyId?: number
    expectedCloseDate?: Date
    contactIds?: number[]
  }) {
    return await this.prisma.$transaction(async (tx) => {
      // Create the deal
      const deal = await tx.deal.create({
        data: { 
          title: dealData.title,
          description: dealData.description,
          value: dealData.value ? new Decimal(dealData.value) : null,
          stage: dealData.stage || "lead",
          companyId: dealData.companyId,
          expectedCloseDate: dealData.expectedCloseDate,
        },
      })

      // Add contact associations if provided
      if (dealData.contactIds && dealData.contactIds.length > 0) {
        await tx.dealContact.createMany({
          data: dealData.contactIds.map((contactId) => ({
            dealId: deal.id,
            contactId,
          })),
        })
      }

      return this.findOne(deal.id)
    })
  }

  async findAll(page = 1, limit = 10, sortBy = "createdAt", sortOrder: "asc" | "desc" = "desc") {
    const skip = (page - 1) * limit
    const validSortColumns = ["title", "value", "stage", "expectedCloseDate", "createdAt", "updatedAt"]
    const orderBy = validSortColumns.includes(sortBy) ? sortBy : "createdAt"

    const [data, total] = await Promise.all([
      this.prisma.deal.findMany({
        skip,
        take: limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          contacts: {
            include: {
              contact: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prisma.deal.count(),
    ])

    const transformedData = data.map((deal) => ({
      ...deal,
      company_name: deal.company?.name || null,
      contacts: deal.contacts.map((dc) => dc.contact),
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
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        contacts: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!deal) {
      throw new NotFoundException("Deal not found")
    }

    return {
      ...deal,
      company_name: deal.company?.name || null,
      contacts: deal.contacts.map((dc) => dc.contact),
    }
  }

  async update(
    id: number,
    updateData: {
      title?: string
      description?: string
      value?: number
      stage?: string
      companyId?: number
      expectedCloseDate?: Date
      contactIds?: number[]
    },
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // Update deal fields
      const dealUpdateData: any = {}
      if (updateData.title !== undefined) dealUpdateData.title = updateData.title
      if (updateData.description !== undefined) dealUpdateData.description = updateData.description
      if (updateData.value !== undefined) dealUpdateData.value = updateData.value ? new Decimal(updateData.value) : null
      if (updateData.stage !== undefined) dealUpdateData.stage = updateData.stage
      if (updateData.companyId !== undefined) dealUpdateData.companyId = updateData.companyId
      if (updateData.expectedCloseDate !== undefined) dealUpdateData.expectedCloseDate = updateData.expectedCloseDate

      if (Object.keys(dealUpdateData).length > 0) {
        await tx.deal.update({
          where: { id },
          data: dealUpdateData,
        })
      }

      // Update contact associations if provided
      if (updateData.contactIds !== undefined) {
        // Remove existing associations
        await tx.dealContact.deleteMany({
          where: { dealId: id },
        })

        // Add new associations
        if (updateData.contactIds.length > 0) {
          await tx.dealContact.createMany({
            data: updateData.contactIds.map((contactId) => ({
              dealId: id,
              contactId,
            })),
          })
        }
      }

      return this.findOne(id)
    })
  }

  async remove(id: number) {
    try {
      await this.prisma.deal.delete({
        where: { id },
      })
      return { message: "Deal deleted successfully" }
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("Deal not found")
      }
      throw error
    }
  }
}
