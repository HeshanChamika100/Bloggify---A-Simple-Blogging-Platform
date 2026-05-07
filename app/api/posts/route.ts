import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all posts, include the author data, and sort by newest post first
    const posts = await prisma.post.findMany({
      include: {
        author: true, // Includes the related Author object
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: 'Failed to fetch posts.' },
      { status: 500 }
    );
  }
}