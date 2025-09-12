import { Pool, PoolClient } from 'pg';

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'phixelforge',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database connection wrapper
export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = pool;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

// Initialize database tables
export async function initializeDatabase(): Promise<void> {
  const db = Database.getInstance();
  
  try {
    console.log('🔧 Initializing PostgreSQL database...');
    
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        firebase_uid VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        display_name VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create images table
    await db.query(`
      CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        description TEXT,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        width INTEGER,
        height INTEGER,
        tags TEXT[],
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create collections table
    await db.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create collection_images junction table
    await db.query(`
      CREATE TABLE IF NOT EXISTS collection_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
        image_id UUID REFERENCES images(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(collection_id, image_id)
      )
    `);

    // Create albums table
    await db.query(`
      CREATE TABLE IF NOT EXISTS albums (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cover_image_id UUID REFERENCES images(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create album_images junction table
    await db.query(`
      CREATE TABLE IF NOT EXISTS album_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
        image_id UUID REFERENCES images(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(album_id, image_id)
      )
    `);

    // Create likes table
    await db.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        image_id UUID REFERENCES images(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, image_id)
      )
    `);

    // Create comments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        image_id UUID REFERENCES images(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await db.query(`CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_images_is_public ON images(is_public)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_likes_image_id ON likes(image_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_comments_image_id ON comments(image_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_album_images_album_id ON album_images(album_id)`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_collection_images_collection_id ON collection_images(collection_id)`);

    // Insert some sample collections
    await db.query(`
      INSERT INTO collections (name, description, is_featured) VALUES 
      ('Featured Images', 'Our best AI-generated images', true),
      ('Nature Collection', 'Beautiful nature scenes', false),
      ('Abstract Art', 'Creative abstract compositions', false)
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Export database instance
export const db = Database.getInstance();
