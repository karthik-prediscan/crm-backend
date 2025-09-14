import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { CompaniesModule } from "../companies/companies.module";
import { ContactsModule } from "../contacts/contacts.module";
import { DealsModule } from "../deals/deals.module";

@Module({
  imports: [CompaniesModule, ContactsModule, DealsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
