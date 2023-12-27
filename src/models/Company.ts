import mongoose, {Schema} from 'mongoose';

export interface Company {
  _id: string;
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
  years_in_business: number;
  less_than_2_years: boolean;
}

mongoose.Promise = global.Promise;

const schema = new Schema<Company>({
  _id: {type: String, required: true},
  company_name: {type: String, required: true},
  headquarters_location: {
    label: {type: String, required: true},
    value: {value: String, required: true},
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
  less_than_2_years: {type: Boolean, required: true},
  years_in_business: {
    type: Number,
    required: function (this: Company) {
      return !this.less_than_2_years;
    },
  },
});

export const Company =
  mongoose.models?.Company || mongoose.model<Company>('Company', schema);
