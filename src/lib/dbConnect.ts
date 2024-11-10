import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set('strictQuery', true); // Set this option to suppress warnings

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
    });

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
