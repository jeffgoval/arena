const fs = require('fs');
const path = require('path');
const https = require('https');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Extract project reference from URL
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

console.log('🔧 Supabase Migration Tool');
console.log(`📦 Project: ${projectRef}`);
console.log('');

// Read all migration files
const migrationsDir = path.join(__dirname, '../supabase/migrations');
const migrationFiles = fs.readdirSync(migrationsDir).sort();

async function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });

    const options = {
      hostname: `${projectRef}.supabase.co`,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function applyMigrations() {
  console.log(`📝 Found ${migrationFiles.length} migration files\n`);

  for (const file of migrationFiles) {
    if (!file.endsWith('.sql')) continue;

    console.log(`⏳ Applying ${file}...`);

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await executeSql(sql);
      console.log(`✅ ${file} applied successfully\n`);
    } catch (error) {
      console.error(`❌ Error applying ${file}:`);
      console.error(error.message);
      console.error('\nTrying alternative method...\n');

      // Alternative: Use Supabase SQL endpoint directly
      await applyViaDirectSql(sql, file);
    }
  }

  console.log('🎉 All migrations completed!');
}

async function applyViaDirectSql(sql, filename) {
  return new Promise((resolve, reject) => {
    const data = sql;

    const options = {
      hostname: `${projectRef}.supabase.co`,
      path: '/rest/v1/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/sql',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ ${filename} applied via direct SQL\n`);
          resolve(responseData);
        } else {
          console.error(`❌ Failed: ${responseData}`);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

applyMigrations().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
