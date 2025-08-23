#!/usr/bin/env node
/**
 * Environment validation script
 * Run this before starting the application to ensure all required environment variables are set
 * Usage: node scripts/validate-env.js
 */

const { execSync } = require('child_process');
const path = require('path');
// Load environment variables from .env file
require('dotenv').config();

console.log('🔍 Validating environment configuration...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const fs = require('fs');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one based on .env.example');
  process.exit(1);
}

// Load and validate environment
try {
  // Load the environment validation module
  const envValidation = require('../src/lib/env.ts');
  
  console.log('✅ Environment variables validated successfully');
  console.log('✅ All required configuration is present');
  
} catch (error) {
  console.error('❌ Environment validation failed:');
  console.error(error.message);
  
  console.log('\n📝 Common solutions:');
  console.log('1. Check your .env file exists and has all required variables');
  console.log('2. Ensure URLs are valid and use HTTPS in production');
  console.log('3. Verify API keys are correctly formatted');
  console.log('4. Check database connection strings');
  
  process.exit(1);
}

console.log('\n🎉 Environment validation completed successfully!');
console.log('Your application is ready to start.');