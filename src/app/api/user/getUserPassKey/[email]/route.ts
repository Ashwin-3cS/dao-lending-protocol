// src/app/api/user/getUserPassKey/[email]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/dbConnect';
import User from '@/models/User';
import { decrypt } from '@/lib/encryption';
import { IUser } from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  const { email } = params;

  if (!email) {
    return NextResponse.json({ message: 'Invalid email provided' }, { status: 400 });
  }

  try {
    await connectToDB(); // Establish database connection

    // Find the user by email
    const user = await User.findOne({ email }).lean().exec() as IUser | null;


    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('User found from DB:', user);

    // Decrypt the passkeys before sending them back
    const decryptedPasskeys = user.passkeys.map((passkey) => {

      console.log('passkey from route  :', passkey);
      console.log('passkey.rawId from route  :', passkey.rawId);
      console.log('passkey.coordinates from route  :', passkey.coordinates);
      console.log('passkey.coordinates.x from route  :', passkey.coordinates.x);
      console.log('passkey.coordinates.y from route  :', passkey.coordinates.y);
      
      
      try {
        if (!passkey.rawId || !passkey.coordinates || !passkey.coordinates.x || !passkey.coordinates.y) {
          console.error('Invalid passkey data:', passkey);
          throw new Error('Invalid passkey data');
        }

        // Check if the passkey rawId and coordinates are valid before decrypting
        const decryptedRawId = decrypt(passkey.rawId);
        const decryptedCoordinates = {
          x: decrypt(passkey.coordinates.x),
          y: decrypt(passkey.coordinates.y),
        };

        console.log('decryptedRawId:', decryptedRawId);
        console.log('decryptedCoordinates:', decryptedCoordinates);
        

        return {
          rawId: decryptedRawId,
          coordinates: decryptedCoordinates,
        };
      } catch (error) {
        console.error('Error decrypting passkey:', error);
        return null;
      }
    }).filter((passkey) => passkey !== null); // Filter out null passkeys

    return NextResponse.json({ passkeys: decryptedPasskeys });
  } catch (error) {
    console.error('Error retrieving passkeys:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
