import { initializeDatabase, db } from '../src/lib/database';
import { createUser, createImage } from '../src/lib/postgres';
import { collection, getDocs } from 'firebase/firestore';
import { db as firestoreDb } from '../src/lib/firebase';

// Migration script to move data from Firestore to PostgreSQL
async function migrateData() {
  console.log('Starting migration from Firestore to PostgreSQL...');
  
  try {
    // Initialize PostgreSQL database
    await initializeDatabase();
    console.log('✅ PostgreSQL database initialized');

    // Migrate users (we'll create them as they sign in, but let's check for existing data)
    console.log('📊 Checking for existing Firestore data...');
    
    // Get all images from Firestore
    const imagesSnapshot = await getDocs(collection(firestoreDb, 'images'));
    console.log(`Found ${imagesSnapshot.size} images in Firestore`);

    if (imagesSnapshot.size === 0) {
      console.log('✅ No existing data to migrate');
      return;
    }

    // Create a map to track users we've created
    const userMap = new Map<string, string>();

    // Migrate images
    for (const doc of imagesSnapshot.docs) {
      const imageData = doc.data();
      console.log(`Migrating image: ${doc.id}`);

      // Create user if not exists
      let userId = userMap.get(imageData.userId);
      if (!userId) {
        try {
          // Try to get existing user first
          const existingUser = await db.query(
            'SELECT id FROM users WHERE firebase_uid = $1',
            [imageData.userId]
          );

          if (existingUser.rows.length > 0) {
            userId = existingUser.rows[0].id;
            userMap.set(imageData.userId, userId);
          } else {
            // Create new user
            const newUser = await createUser({
              firebase_uid: imageData.userId,
              email: `user-${imageData.userId}@migrated.com`, // Placeholder email
              display_name: `User ${imageData.userId.substring(0, 8)}`
            });
            userId = newUser.id;
            userMap.set(imageData.userId, userId);
            console.log(`✅ Created user: ${userId}`);
          }
        } catch (error) {
          console.error(`❌ Error creating user ${imageData.userId}:`, error);
          continue;
        }
      }

      // Create image in PostgreSQL
      try {
        // For AI-generated images, we'll store the base64 data as a file
        // In a real scenario, you'd want to save this to actual files
        const imageRecord = await createImage({
          user_id: userId,
          title: imageData.prompt?.substring(0, 100) || 'AI Generated Image',
          description: imageData.prompt || '',
          file_path: `data:image/png;base64,${imageData.imageData}`, // Temporary storage
          mime_type: 'image/png',
          tags: imageData.prompt ? imageData.prompt.split(' ').slice(0, 5) : [],
          is_public: true
        });
        console.log(`✅ Migrated image: ${imageRecord.id}`);
      } catch (error) {
        console.error(`❌ Error migrating image ${doc.id}:`, error);
      }
    }

    console.log('🎉 Migration completed successfully!');
    console.log(`✅ Migrated ${imagesSnapshot.size} images`);
    console.log(`✅ Created ${userMap.size} users`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await db.close();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateData };
