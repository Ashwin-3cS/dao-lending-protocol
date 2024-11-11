// // src/app/api/user/getUserPassKey/[email]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/dbConnect';
import User from '@/models/User';
import { decrypt } from '@/lib/encryption';
import { IUser } from '@/models/User';

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  const { email } = params;
  const password = req.nextUrl.searchParams.get('password'); // Retrieve password from query params

  if (!email || !password) {
    return NextResponse.json({ message: 'Invalid email or password provided' }, { status: 400 });
  }

  try {
    await connectToDB(); // Establish database connection

    // Find the user by email
    const user = await User.findOne({ email }).lean().exec() as IUser | null;

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Decrypt the stored password and compare with provided password
    const storedPassword = decrypt(user.password);
    if (storedPassword !== password) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    // Decrypt the passkeys if the password matches
    const decryptedPasskeys = user.passkeys.map((passkey) => {
      try {
        if (!passkey.rawId || !passkey.coordinates?.x || !passkey.coordinates?.y) {
          throw new Error('Invalid passkey data');
        }

        return {
          rawId: decrypt(passkey.rawId),
          coordinates: {
            x: decrypt(passkey.coordinates.x),
            y: decrypt(passkey.coordinates.y),
          },
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
