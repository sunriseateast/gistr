import mongoose from "mongoose";

export const connectMongoDB = async (connectionURL: string): Promise<typeof mongoose> => {
  const connection = await mongoose.connect(connectionURL);
  return connection;
};