import mongoose, {Schema} from 'mongoose';

export interface PartnerRequest {
  _id: string;
  from: string;
  to: string;
  status: string;
}

mongoose.Promise = global.Promise;

const schema = new Schema<PartnerRequest>({
  from: {type: String, required: true},
  to: {type: String, required: true},
  status: {type: String, required: true},
});

export const PartnerRequest =
  mongoose.models?.PartnerRequest ||
  mongoose.model<PartnerRequest>('ParnerRequest', schema);
