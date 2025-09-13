import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards,Body } from "@nestjs/common"
import { ContactsService } from "./contacts.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("contacts")
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() body: {
    firstName: string
    lastName: string
    email?: string
    phone?: string
    position?: string
    companyId?: number
  }) {
    const { firstName, lastName, ...rest } = body;
    const name = `${firstName} ${lastName}`.trim();
    return this.contactsService.create({ name, ...rest });
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
    return this.contactsService.findAll(+page, +limit, sortBy, sortOrderLower);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param('id') id: string,
    @Body() body: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      position?: string
      companyId?: number
    },
  ) {
    const { firstName, lastName, ...rest } = body;
    const name = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined;
    const updateData: any = { ...rest };
    if (name !== undefined && name !== '') updateData.name = name;
    return this.contactsService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(+id);
  }
}
