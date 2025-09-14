import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards, Body } from "@nestjs/common"
import  { CompaniesService } from "./companies.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: {
    name: string
    industry?: string
    website?: string
    phone?: string
    email?: string
    address?: string
  }) {
    return this.companiesService.create(body)
  }
@UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ) {
    // Convert sortOrder to lowercase for service compatibility
    const sortOrderLower = sortOrder.toLowerCase() as 'asc' | 'desc';
    return this.companiesService.findAll(+page, +limit, sortBy, sortOrderLower);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; industry?: string; website?: string; phone?: string; email?: string; address?: string },
  ) {
    return this.companiesService.update(+id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
