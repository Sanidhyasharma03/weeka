#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up PostgreSQL for PhixelForge...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  const envContent = `# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=phixelforge
DB_USER=postgres
DB_PASSWORD=your_password_here

# Firebase Configuration (keep existing)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA3hBRP45rOLxv7REbeeXx4T1o-4gqc81c
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=phixelforge.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phixelforge
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=phixelforge.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1029954431014
NEXT_PUBLIC_FIREBASE_APP_ID=1:1029954431014:web:e1b60350a99b07fe121ee7
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local created! Please update the database password.\n');
} else {
  console.log('✅ .env.local already exists\n');
}

console.log('📋 Setup Instructions:');
console.log('1. Install PostgreSQL if not already installed');
console.log('2. Create a database named "phixelforge"');
console.log('3. Update the DB_PASSWORD in .env.local with your PostgreSQL password');
console.log('4. Run the database setup: npm run db:setup');
console.log('5. (Optional) Migrate existing data: npm run migrate');
console.log('6. Start the development server: npm run dev');
console.log('7. Initialize the database by visiting: http://localhost:9002/api/init-db (POST request)');

console.log('\n🎯 What\'s been implemented:');
console.log('✅ PostgreSQL database schema');
console.log('✅ File upload system with drag & drop');
console.log('✅ Public collections with like functionality');
console.log('✅ Personal albums with image organization');
console.log('✅ User authentication (Firebase Auth)');
console.log('✅ AI image generation (existing)');
console.log('✅ Real-time updates (polling-based)');

console.log('\n🔧 Database Commands:');
console.log('• Setup database: npm run db:setup');
console.log('• Migrate data: npm run migrate');
console.log('• Initialize via API: POST /api/init-db');

console.log('\n📱 Pages Available:');
console.log('• /dashboard - Personal AI-generated images');
console.log('• /upload - File upload with metadata');
console.log('• /collections - Public gallery with likes');
console.log('• /albums - Personal image organization');
console.log('• /auth/signin - User authentication');
console.log('• /auth/signup - User registration');

console.log('\n🎉 Setup complete! Follow the instructions above to get started.');
