import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards, Body } from "@nestjs/common"
import  { DealsService } from "./deals.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("deals")
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  create(@Body() body: {
    title: string
    description?: string
    value?: number
    stage?: string
    companyId?: number
    contactIds?: number[]
  }) {
    return this.dealsService.create(body)
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    // Convert sortOrder to lowercase for service compatibility
    const sortOrderLower = sortOrder.toLowerCase() as 'asc' | 'desc';
    return this.dealsService.findAll(+page, +limit, sortBy, sortOrderLower);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param('id') id: string,
    @Body() body: {
      title?: string
      description?: string
      value?: number
      stage?: string
      companyId?: number
      contactIds?: number[]
    },
  ) {
    return this.dealsService.update(+id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dealsService.remove(+id);
  }
}
