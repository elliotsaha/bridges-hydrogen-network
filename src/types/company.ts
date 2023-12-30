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
