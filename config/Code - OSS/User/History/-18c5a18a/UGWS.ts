import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (mongoose_string: string) => {
  try {
    await mongoose.connect(mongoose_string, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
