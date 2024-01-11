import mongoose, {Schema} from 'mongoose';

export interface Company {
  _id: string;
  domain: string;
  description: string;
  profile: string;
  company_name: string;
  headquarters_location: {
    label: string;
    value: string;
  };
  market_focus: Array<{
    name: string;
    description: string;
  }>;
  operating_regions: string[];
  services: Array<{
    name: string;
    description: string;
  }>;
  technologies: Array<{
    name: string;
    description?: string;
  }>;
  type_of_business: Array<{
    name: string;
    description: string;
  }>;
  years_in_business?: number;
  less_than_2_years?: boolean;
  team: Array<string>;
  partners: Array<string>;
}

mongoose.Promise = global.Promise;

const schema = new Schema<Company>({
  description: {type: String, required: true},
  domain: {type: String, required: true},
  profile: {type: String, required: true},
  company_name: {type: String, required: true},
  headquarters_location: {
    label: {type: String, required: true},
    value: {type: String, required: true},
  },
  market_focus: [
    {
      name: {type: String, required: true},
      description: {type: String, required: true},
    },
  ],
  services: [
    {
      name: {type: String, required: true},
      description: {type: String, required: true},
    },
  ],
  technologies: [
    {
      name: {type: String, required: true},
      description: {type: String, required: false},
    },
  ],
  type_of_business: [
    {
      name: {type: String, required: true},
      description: {type: String, required: true},
    },
  ],
  operating_regions: [{type: String, required: true}],
  less_than_2_years: {
    type: Boolean,
    required: function (this: Company) {
      return !this.years_in_business;
    },
  },
  years_in_business: {
    type: Number,
    required: function (this: Company) {
      return !this.less_than_2_years;
    },
  },
  team: [
    {
      type: String,
      required: true,
    },
  ],
  partners: [
    {
      type: String,
      required: true,
    },
  ],
});

schema.pre('save', function (next) {
  if (this.years_in_business && this.less_than_2_years) {
    next(
      new Error(
        'Only one of years_in_business or less_than_2_years should be provided'
      )
    );
  } else {
    next();
  }
});

export const Company =
  mongoose.models?.Company || mongoose.model<Company>('Company', schema);

export const DeletedCompany =
  mongoose.models?.DeletedCompany ||
  mongoose.model<Company>('DeletedCompany', schema);
