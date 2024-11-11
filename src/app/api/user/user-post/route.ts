import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDB } from "@/lib/dbConnect";

export async function POST(request: Request) {
  await connectToDB();
  
  const { username, email, passkey, safeAddress,password } = await request.json();
  

  try {

    console.log(safeAddress, 'safeAddress from route');
    
    const user = await User.create({
      username,
      email,
      password,
      passkeys: [
        {
          rawId: passkey.rawId,
          coordinates: {
            x: passkey.coordinates.x,
            y: passkey.coordinates.y,
          },
        },
      ],
      safeAddress: safeAddress,
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error:any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
