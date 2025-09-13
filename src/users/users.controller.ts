import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Body } from "@nestjs/common"
import { UsersService } from "./users.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: { email: string; password: string; firstName: string; lastName: string }) {
    const { email, password, firstName, lastName } = body;
    const name = `${firstName} ${lastName}`.trim();
    return this.usersService.create({ email, password, name });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: { email?: string; firstName?: string; lastName?: string }) {
    const { email, firstName, lastName } = body;
    const name = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : undefined;
    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (name !== undefined && name !== '') updateData.name = name;
    return this.usersService.update(+id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
