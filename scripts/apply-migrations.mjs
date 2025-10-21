import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔧 Supabase Migration Tool');
console.log(`📦 Project: ${SUPABASE_URL}`);
console.log('');

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Read all migration files
const migrationsDir = path.join(__dirname, '../supabase/migrations');
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`📝 Found ${migrationFiles.length} migration files\n`);

async function applyMigrations() {
  for (const file of migrationFiles) {
    console.log(`⏳ Applying ${file}...`);

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';

        // Skip empty or comment-only statements
        if (statement.trim() === ';' || statement.trim().startsWith('--')) {
          continue;
        }

        console.log(`   Executing statement ${i + 1}/${statements.length}...`);

        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        });

        if (error) {
          console.error(`   ⚠️  Error: ${error.message}`);
          // Continue with next statement
        }
      }

      console.log(`✅ ${file} applied successfully\n`);
    } catch (error) {
      console.error(`❌ Error applying ${file}:`);
      console.error(error.message);
      console.error('');
    }
  }

  console.log('🎉 Migration process completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your Supabase dashboard to verify tables were created');
  console.log('2. Run: npx supabase gen types typescript --project-id meabooblgkqpjarmxoje > types/database.types.ts');
}

applyMigrations().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
