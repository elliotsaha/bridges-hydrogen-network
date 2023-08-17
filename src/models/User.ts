import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  email_address: string;
}

mongoose.Promise = global.Promise;

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email_address: { type: String, required: true, unique: true },
  },
  { _id: false }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
