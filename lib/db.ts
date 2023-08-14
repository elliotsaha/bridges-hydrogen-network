import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.NEXT_ATLAS_URI as string);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
    throw err;
  }
};
