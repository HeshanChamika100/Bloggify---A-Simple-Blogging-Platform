import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // We only need the email to identify the author
    const { title, content, email } = body;

    if (!title || !content || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, and email are required.' },
        { status: 400 } 
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { email }, 
        },
      },
      include: {
        author: true, 
      }
    });

    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating the post.' },
      { status: 500 } 
    );
  }
}