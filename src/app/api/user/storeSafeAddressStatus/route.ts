// src/app/api/user/storeSafeAddressStatus/route.ts

import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest and NextResponse for Next.js 13+
import mongoose from 'mongoose';
import SafeAddressStatus from '@/models/safeAddressStatus'; // Import the model

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// POST handler to store the Safe Address Status
export const POST = async (req: NextRequest) => {
  const { email, safeAddress, status } = await req.json(); // Parsing request body

  if (!email || !safeAddress || !status) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Create a new SafeAddressStatus document
    const newStatus = new SafeAddressStatus({
      email,
      safeAddress,
      status,
    });

    // Save the document to the database
    await newStatus.save();

    // Respond with success
    return NextResponse.json({ message: 'Safe address status saved successfully', data: newStatus }, { status: 201 });
  } catch (error) {
    console.error('Error saving safe address status:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
