import {Company} from '@models';

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

export interface ViewCompany extends Omit<Company, 'partners'> {
  partners: Array<ViewPartner>;
}

export type ViewCompanyResponse =
  | {
      status: 'FOUND';
      company: ViewCompany;
    }
  | {
      status: 'NOT_FOUND';
      company: null;
    };
