import { NextRequest, NextResponse } from 'next/server';
import { getAlbumsByUserId, createAlbum, getImagesByAlbumId, addImageToAlbum } from '@/lib/postgres';
import { getUserByFirebaseUid, createUser } from '@/lib/postgres';
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
    
    let user = await getUserByFirebaseUid(decodedToken.uid);
    if (!user) {
      user = await createUser({
        firebase_uid: decodedToken.uid,
        email: decodedToken.email,
        display_name: decodedToken.name,
        avatar_url: decodedToken.picture,
      });
    }

    const albums = await getAlbumsByUserId(user.id);
    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

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
    
    const { name, description, coverImageId } = await request.json();
    
    let user = await getUserByFirebaseUid(decodedToken.uid);
    if (!user) {
      user = await createUser({
        firebase_uid: decodedToken.uid,
        email: decodedToken.email,
        display_name: decodedToken.name,
        avatar_url: decodedToken.picture,
      });
    }

    const album = await createAlbum({
      user_id: user.id,
      name,
      description,
      cover_image_id: coverImageId,
    });

    return NextResponse.json({ album });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
}
