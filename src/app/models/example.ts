import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema(
  { title: String, description: String },
  { timestamps: true }
);

export const usersCreation =
  mongoose.models.usersCreation ||
  mongoose.model("users-creation", topicSchema);
