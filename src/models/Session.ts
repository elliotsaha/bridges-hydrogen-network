import mongoose, { Schema } from "mongoose";

export interface ISession {
  _id: string;
  user_id: string;
  active_expires: number;
  idle_expires: number;
}

mongoose.Promise = global.Promise;

const sessionSchema = new Schema<ISession>(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true },
    active_expires: { type: Number, required: true },
    idle_expires: { type: Number, required: true },
  },
  { _id: false }
);

export const Session =
  mongoose.models?.Session ||
  mongoose.model<ISession>("Session", sessionSchema);
