import mongoose, {Schema} from 'mongoose';

export interface Company {
  _id: string;
  company_name: string;
  headquarters_location: string;
  market_segment_focus: string[];
  operating_regions: string[];
  services_or_products: string[];
  technologies_used: string[];
  type_of_business: string[];
  years_in_business: number;
  less_than_2_years: boolean;
}

mongoose.Promise = global.Promise;

const schema = new Schema<Company>({
  _id: {type: String, required: true},
  company_name: {type: String, required: true},
  headquarters_location: {type: String, required: true},
  less_than_2_years: {type: Boolean, required: true},
  years_in_business: {
    type: Number,
    required: function (this: Company) {
      return !this.less_than_2_years;
    },
  },
  market_segment_focus: [{type: String, required: true}],
  operating_regions: [{type: String, required: true}],
  services_or_products: [{type: String, required: true}],
  technologies_used: [{type: String, required: true}],
  type_of_business: [{type: String, required: true}],
});

export const Company =
  mongoose.models?.Company || mongoose.model<Company>('Company', schema);
