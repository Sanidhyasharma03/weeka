# PostgreSQL Migration Setup Guide

This guide will help you set up PostgreSQL for your PhixelForge application and migrate from Firebase Firestore.

## Prerequisites

1. **PostgreSQL Installation**
   - Install PostgreSQL on your system
   - Make sure PostgreSQL service is running
   - Note down your PostgreSQL username and password

2. **Environment Variables**
   Create a `.env.local` file in your project root with the following variables:

   ```env
   # PostgreSQL Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=phixelforge
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   ```

## Setup Steps

### 1. Create Database

Connect to PostgreSQL as a superuser and create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE phixelforge;

# Exit psql
\q
```

### 2. Run Database Setup Script

```bash
# Run the setup script to create tables and indexes
npm run db:setup
```

Or manually run the SQL script:

```bash
psql -U postgres -d phixelforge -f scripts/setup-database.sql
```

### 3. Migrate Existing Data (Optional)

If you have existing data in Firestore that you want to migrate:

```bash
# Run the migration script
npm run migrate
```

### 4. Update Your Application

The migration is designed to be gradual. You can switch between Firestore and PostgreSQL by changing the import in your files:

**Current (Firestore):**
```typescript
import { saveImage, streamImages } from '@/lib/firestore';
```

**New (PostgreSQL):**
```typescript
import { saveImage, streamImages } from '@/lib/postgres-firestore';
```

## Database Schema

The PostgreSQL database includes the following tables:

- **users**: User accounts (linked to Firebase Auth)
- **images**: Image metadata and file paths
- **collections**: Public image collections
- **collection_images**: Many-to-many relationship between collections and images
- **albums**: Personal user albums
- **album_images**: Many-to-many relationship between albums and images
- **likes**: User likes on images
- **comments**: User comments on images

## Features Supported

✅ **Current Features:**
- User authentication (Firebase Auth)
- AI image generation and storage
- Personal image gallery
- Real-time image streaming (with polling)

🚀 **New Features Ready:**
- File upload system
- Public collections
- Like/unlike functionality
- Comment system
- Personal albums
- Image organization

## Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Sign in to your application
3. Generate an AI image
4. Check if the image appears in your dashboard

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running: `pg_ctl status`
- Check your environment variables in `.env.local`
- Ensure the database exists: `psql -U postgres -l`

### Migration Issues
- Make sure Firebase is still accessible for data migration
- Check the console for detailed error messages
- Verify your PostgreSQL user has the necessary permissions

### Performance
- The current setup uses polling for real-time updates (5-second intervals)
- For better performance, consider implementing WebSockets
- Add more database indexes as needed based on your usage patterns

## Next Steps

1. **File Upload System**: Implement drag-and-drop file uploads
2. **Collections Page**: Build the public gallery with like/comment features
3. **Albums Page**: Create personal album management
4. **Real-time Updates**: Implement WebSockets for live updates
5. **Search & Filtering**: Add advanced search capabilities

## Support

If you encounter any issues:
1. Check the console logs for detailed error messages
2. Verify your database connection
3. Ensure all environment variables are set correctly
4. Check PostgreSQL logs for database-specific issues
