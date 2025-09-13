import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { CompaniesModule } from "./companies/companies.module"
import { ContactsModule } from "./contacts/contacts.module"
import { DealsModule } from "./deals/deals.module"
import { PrismaModule } from "./prisma/prisma.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ContactsModule,
    DealsModule,
  ],
})
export class AppModule {}
