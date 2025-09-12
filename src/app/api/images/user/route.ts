import { NextRequest, NextResponse } from 'next/server';
import { getImagesByUserId } from '@/lib/postgres';
import { getUserByFirebaseUid } from '@/lib/postgres';
import { getAuth } from 'firebase-admin/auth';

export async function GET(request: NextRequest) {
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
    
    const user = await getUserByFirebaseUid(decodedToken.uid);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const images = await getImagesByUserId(user.id);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching user images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user images' },
      { status: 500 }
    );
  }
}
