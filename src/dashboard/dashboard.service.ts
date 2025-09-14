import { Injectable } from "@nestjs/common";
import { CompaniesService } from "../companies/companies.service";
import { ContactsService } from "../contacts/contacts.service";
import { DealsService } from "../deals/deals.service";

@Injectable()
export class DashboardService {
  constructor(
    private companiesService: CompaniesService,
    private contactsService: ContactsService,
    private dealsService: DealsService
  ) {}

  async getStats() {
    const [companies, contacts, deals] = await Promise.all([
      this.companiesService["prisma"].company.count(),
      this.contactsService["prisma"].contact.count(),
      this.dealsService["prisma"].deal.count(),
    ]);
    return { companies, contacts, deals };
  }
}
