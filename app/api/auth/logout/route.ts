import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  // Setting the cookie with a maxAge of 0 instantly deletes it
  cookieStore.set("auth_token", "", { maxAge: 0, path: "/" });
  
  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}