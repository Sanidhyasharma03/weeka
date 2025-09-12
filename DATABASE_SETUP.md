# 🗄️ PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL for your PhixelForge application.

## 📋 Prerequisites

1. **PostgreSQL Installation**
   - Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
   - During installation, remember the password you set for the `postgres` user
   - Make sure PostgreSQL service is running

2. **Environment Variables**
   Create a `.env.local` file in your project root with the following variables:

   ```env
   # PostgreSQL Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=phixelforge
   DB_USER=postgres
   DB_PASSWORD=your_actual_password_here
   ```

## 🚀 Setup Steps

### Step 1: Install PostgreSQL (if not already installed)

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Make sure to install pgAdmin (optional but helpful)

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create the Database

Open a terminal/command prompt and run:

```bash
# Connect to PostgreSQL as the postgres user
psql -U postgres

# Create the database
CREATE DATABASE phixelforge;

# Exit psql
\q
```

### Step 3: Test Database Connection

```bash
# Test the connection
npm run db:test
```

This will check if your database connection is working properly.

### Step 4: Set Up Database Tables

```bash
# Initialize the database tables
npm run db:setup
```

Or manually run the SQL script:
```bash
psql -U postgres -d phixelforge -f scripts/setup-database.sql
```

### Step 5: Initialize via API

Start your development server:
```bash
npm run dev
```

Then make a POST request to initialize the database:
```bash
# Using curl
curl -X POST http://localhost:9002/api/init-db

# Or visit in browser and use browser dev tools to make a POST request
```

## 🔧 Troubleshooting

### Connection Issues

**Error: "connection refused"**
- Make sure PostgreSQL is running
- Check if the port 5432 is correct
- Verify your connection details in `.env.local`

**Error: "authentication failed"**
- Check your username and password in `.env.local`
- Make sure the user has access to the database

**Error: "database does not exist"**
- Create the database: `CREATE DATABASE phixelforge;`
- Or change `DB_NAME` in `.env.local` to an existing database

### Common Commands

```bash
# Check if PostgreSQL is running
pg_ctl status

# Start PostgreSQL service
pg_ctl start

# Connect to your database
psql -U postgres -d phixelforge

# List all databases
psql -U postgres -l

# List tables in current database
\dt
```

## 📊 Database Schema

The database includes the following tables:

- **users**: User accounts (linked to Firebase Auth)
- **images**: Image/video metadata and file paths
- **collections**: Public image collections
- **collection_images**: Many-to-many relationship between collections and images
- **albums**: Personal user albums
- **album_images**: Many-to-many relationship between albums and images
- **likes**: User likes on images
- **comments**: User comments on images

## 🎯 Testing the Setup

1. **Test Database Connection:**
   ```bash
   npm run db:test
   ```

2. **Start the Application:**
   ```bash
   npm run dev
   ```

3. **Test Upload:**
   - Go to `http://localhost:9002/upload`
   - Try uploading an image or video
   - Check if it appears in collections

4. **Test Collections:**
   - Go to `http://localhost:9002/collections`
   - Verify uploaded files appear

## 🆘 Need Help?

If you're still having issues:

1. **Check the logs** in your terminal for specific error messages
2. **Verify PostgreSQL is running** using `pg_ctl status`
3. **Test connection manually** using `psql -U postgres -d phixelforge`
4. **Check environment variables** in `.env.local`

## 📝 Next Steps

Once the database is set up:

1. ✅ File uploads will work
2. ✅ Collections page will show uploaded files
3. ✅ Albums can be created
4. ✅ Like functionality will work
5. ✅ AI image generation will store in PostgreSQL

The application is now fully migrated from Firebase to PostgreSQL!
