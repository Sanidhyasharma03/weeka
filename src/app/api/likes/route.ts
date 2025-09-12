import { NextRequest, NextResponse } from 'next/server';
import { addLike, removeLike, getLikeCount, hasUserLiked } from '@/lib/postgres';
import { getUserByFirebaseUid } from '@/lib/postgres';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    
    const { imageId } = await request.json();
    
    const user = await getUserByFirebaseUid(decodedToken.uid);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isLiked = await hasUserLiked(user.id, imageId);
    
    if (isLiked) {
      await removeLike(user.id, imageId);
    } else {
      await addLike(user.id, imageId);
    }

    const likeCount = await getLikeCount(imageId);
    const newIsLiked = !isLiked;

    return NextResponse.json({ 
      likeCount, 
      isLiked: newIsLiked 
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    const authHeader = request.headers.get('authorization');

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const likeCount = await getLikeCount(imageId);
    let isLiked = false;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(token);
        const user = await getUserByFirebaseUid(decodedToken.uid);
        if (user) {
          isLiked = await hasUserLiked(user.id, imageId);
        }
      } catch (error) {
        // User not authenticated, just return like count
      }
    }

    return NextResponse.json({ likeCount, isLiked });
  } catch (error) {
    console.error('Error fetching like status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch like status' },
      { status: 500 }
    );
  }
}
