import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database-simple';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await db.query(
      'SELECT * FROM images WHERE is_public = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return NextResponse.json({ images: result.rows });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, file_path, file_size, mime_type, width, height, tags, is_public, user_id } = body;

    // For now, we'll use a simple approach without Firebase Admin
    // In production, you'd want proper authentication
    const result = await db.query(
      `INSERT INTO images (user_id, title, description, file_path, file_size, mime_type, width, height, tags, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        user_id || '00000000-0000-0000-0000-000000000000', // Default user ID for now
        title,
        description,
        file_path,
        file_size,
        mime_type,
        width,
        height,
        tags,
        is_public ?? true
      ]
    );

    return NextResponse.json({ image: result.rows[0] });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    );
  }
}
