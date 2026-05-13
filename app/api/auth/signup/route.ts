import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.author.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use." }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.author.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create a JWT token
    const token = jwt.sign(
      { authorId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
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
      { message: "User created", user: { id: newUser.id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}