import mongoose, { Schema } from "mongoose";

export interface Company {
  _id: string;
  company_name: string;
  headquarters_location: string;
  market_segment_focus: string[];
  operating_regions: string[];
  services_or_products: string[];
  technologies_used: string[];
  type_of_business: string[];
  years_in_business: string;
}

mongoose.Promise = global.Promise;

const schema = new Schema<Company>({
  _id: { type: String, required: true },
  company_name: { type: String, required: true },
  headquarters_location: { type: String, required: true },
  // if less_than_2_years, then years_in_business = "<2"
  years_in_business: {
    type: String,
    required: false,
  },

  market_segment_focus: [{ type: String }],
  operating_regions: [{ type: String }],
  services_or_products: [{ type: String }],
  technologies_used: [{ type: String }],
  type_of_business: [{ type: String }],
});

export const Company =
  mongoose.models?.Company || mongoose.model<Company>("Company", schema);
