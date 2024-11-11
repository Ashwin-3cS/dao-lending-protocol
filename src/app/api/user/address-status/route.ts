// pages/api/storeSafeAddressStatus.ts

import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import SafeAddressStatus from '@/models/safeAddressStatus'; // Import the model

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// API route handler to store the Safe Address Status
const storeSafeAddressStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, safeAddress, userOperationHash } = req.body;

  if (!email || !safeAddress || !userOperationHash) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await connectToDatabase();

    // Create a new SafeAddressStatus document
    const newStatus = new SafeAddressStatus({
      email,
      safeAddress,
      status: 'active',
    });

    // Save the document to the database
    await newStatus.save();

    // Respond with success
    res.status(201).json({ message: 'Safe address status saved successfully', userOperationHash });
  } catch (error) {
    console.error('Error saving safe address status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default storeSafeAddressStatus;
