#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testDatabaseConnection() {
  console.log('🔍 Testing PostgreSQL connection...\n');
  
  // Check environment variables
  const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n📝 Please create a .env.local file with the following variables:');
    console.log('DB_HOST=localhost');
    console.log('DB_PORT=5432');
    console.log('DB_NAME=phixelforge');
    console.log('DB_USER=postgres');
    console.log('DB_PASSWORD=your_password_here');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Password: ${'*'.repeat(process.env.DB_PASSWORD.length)}\n`);
  
  // Test connection
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 1,
    connectionTimeoutMillis: 5000,
  });
  
  try {
    console.log('🔌 Attempting to connect to PostgreSQL...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version.split(' ')[0]);
    
    // Check if our database exists
    const dbResult = await client.query('SELECT current_database()');
    console.log('🗄️  Connected to database:', dbResult.rows[0].current_database);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('📋 Existing tables:');
      tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));
    } else {
      console.log('📋 No tables found - database is empty');
    }
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Database connection test successful!');
    console.log('✅ You can now run: npm run db:setup');
    
  } catch (error) {
    console.log('❌ Database connection failed:');
    console.log('   Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possible solutions:');
      console.log('   1. Make sure PostgreSQL is installed and running');
      console.log('   2. Check if the database "phixelforge" exists');
      console.log('   3. Verify your connection details in .env.local');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed:');
      console.log('   1. Check your username and password in .env.local');
      console.log('   2. Make sure the user has access to the database');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist:');
      console.log('   1. Create the database: CREATE DATABASE phixelforge;');
      console.log('   2. Or change DB_NAME in .env.local to an existing database');
    }
    
    await pool.end();
    process.exit(1);
  }
}

testDatabaseConnection();
