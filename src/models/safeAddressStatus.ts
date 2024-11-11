// models/safeAddressStatus.ts

import mongoose, { Document, Schema } from 'mongoose';

// Define interface for the SafeAddressStatus model
interface ISafeAddressStatus extends Document {
  email: string;
  safeAddress: string;
  status: 'active' | 'inactive';
}

// Define the schema for SafeAddressStatus
const safeAddressStatusSchema = new Schema<ISafeAddressStatus>({
  email: { type: String, required: true },
  safeAddress: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], required: true }
});

// Check if the model already exists to prevent re-creating it in dev mode
const SafeAddressStatus = mongoose.models.SafeAddressStatus || mongoose.model<ISafeAddressStatus>('SafeAddressStatus', safeAddressStatusSchema);

export default SafeAddressStatus;
