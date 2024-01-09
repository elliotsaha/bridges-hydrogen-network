import {Company, User} from '@models';

export interface SearchCompanyRequest extends SearchCompanyRequestFilters {
  company_name: string;
}

export interface SearchCompanyRequestFilters {
  operating_regions: string[];
  market_focus: string[];
  services: string[];
  technologies: string[];
  type_of_business: string[];
  years_in_business?: string;
}

// in mongodb, partners is saved as an array of company ids,
// when /api/company/view is hit, this array is transformed into
// an array of marginally detailed companies
export type ViewPartner = Pick<
  Company,
  '_id' | 'company_name' | 'operating_regions'
>;

export type ViewTeamMember = Pick<User, '_id' | 'email_address' | 'role'>;

export interface ViewCompany extends Omit<Company, 'partners' | 'team'> {
  partners: Array<ViewPartner>;
  team: Array<ViewTeamMember>;
}

export type ViewCompanyResponse =
  | {
      status: 'FOUND';
      company: ViewCompany;
    }
  | {
      status: 'NOT_FOUND' | 'REDIRECT';
      company: null;
    };

export type ViewPartnerResponse =
  | {
      status: 'ACCEPT';
      team: Array<ViewTeamMember>;
    }
  | {
      status: 'PENDING' | 'DENY' | 'NO_COMPANY';
      team: null;
    };
