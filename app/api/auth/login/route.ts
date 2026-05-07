import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find the user is in the database
    const user = await prisma.author.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if the email exists or not
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 } // 401 Unauthorized
      );
    }

    // Compare the received password with the hashed password in the DB
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { authorId: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Set the token in an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,  // Prevents JavaScript from reading it (Prevents XSS attacks)
      secure: process.env.NODE_ENV === "production",  // Only send cookie over HTTPS in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Return success without sending the password back
    return NextResponse.json(
      { 
        message: "Logged in successfully", 
        user: { id: user.id, name: user.name, email: user.email } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}