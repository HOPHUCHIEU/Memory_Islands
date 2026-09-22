import mongoose from "mongoose";
export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }
  console.log("Connecting to MongoDB...");
  console.log("MongoDB URI exists:", Boolean(mongoUri));
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log("=================================");
    console.log("MongoDB connected successfully");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("MongoDB connection failed");
    console.error("=================================");
    console.error(error.message);
    console.error("=================================");
    throw error;
  }
}
