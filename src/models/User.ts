// User.ts
import mongoose, { Document, Schema } from 'mongoose';
import { encrypt, decrypt } from '@/lib/encryption';

// Define the passkey coordinates type
interface Coordinates {
  x: string;
  y: string;
}

// Define the passkey type
interface Passkey {
  rawId: string;
  coordinates: Coordinates;
}

// Define the user document interface
export interface IUser extends Document {
  username: string;
  email: string;
  passkeys: Passkey[];
  safeAddress?: string;
}

// User Schema definition
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passkeys: [
    {
      rawId: {
        type: String,
        required: true,
        unique: true,
        set: (rawId: string) => encrypt(rawId), // Encrypt before storing
        get: (encryptedRawId: string) => decrypt(encryptedRawId), // Decrypt when retrieving
      },
      coordinates: {
        x: {
          type: String,
          required: true,
          set: (x: string) => encrypt(x),
          get: (encryptedX: string) => decrypt(encryptedX),
        },
        y: {
          type: String,
          required: true,
          set: (y: string) => encrypt(y),
          get: (encryptedY: string) => decrypt(encryptedY),
        },
      },
    },
  ],
  safeAddress: {
    type: String,
    required: false,
    unique: true,
  },
}, { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
