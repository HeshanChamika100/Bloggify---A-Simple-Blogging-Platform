import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

type Context = {
  params: Promise<{ id: string }>;
};

// GET /post/:id - Get a single post
export async function GET(request: Request, context: Context) {
  try {
    // Getting the id from the URL parameters
    const { id } = await context.params;

    const post = await prisma.post.findUnique({
      where: { id: id },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /post/:id - Update an existing post
export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params; // Await the params
    const body = await request.json();
    const { title, content } = body;

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: { 
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: 'Failed to update. Post may not exist.' },
      { status: 400 }
    );
  }
}

// DELETE /post/:id - Delete a post
export async function DELETE(request: Request, context: Context) {
  try {
    const { id } = await context.params; 

    // Get the auth_token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // Decode the token to see who is making the request
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { authorId: string };
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    // Find the post the user is trying to delete
    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    // Authorization check: This user is the owner?
    if (post.authorId !== decoded.authorId) {
      return NextResponse.json(
        { error: "Forbidden. You can only delete your own posts." }, 
        { status: 403 } // 403 Forbidden means "I know who you are, but you don't have permission"
      );
    }

    // If they passed the check, delete the post
    await prisma.post.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Post deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}