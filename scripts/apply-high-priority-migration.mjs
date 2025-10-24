import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  console.log('🚀 Applying high-priority migration...\n');

  // Read the SQL file
  const sqlPath = path.join(process.cwd(), 'supabase/migrations/20241024_final_high_priority_items.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

  // Split into individual statements (rough split - may need refinement)
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements\n`);

  let successCount = 0;
  let errorCount = 0;

  // Execute statements one by one
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    // Skip comments-only statements
    if (statement.replace(/\s/g, '') === ';') continue;

    console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);

    try {
      // For COMMENT statements, we need to handle them specially
      if (statement.includes('COMMENT ON TABLE')) {
        console.log(`  ⏭️  Skipping COMMENT statement (not supported via API)`);
        continue;
      }

      // Execute via raw query
      const { error } = await supabase.rpc('query', { query_text: statement });

      if (error) {
        console.error(`  ❌ Error:`, error.message);
        errorCount++;
      } else {
        console.log(`  ✅ Success`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ Exception:`, err.message);
      errorCount++;
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n\n📊 Migration Summary:`);
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  ⏭️  Skipped: ${statements.length - successCount - errorCount}`);

  if (errorCount === 0) {
    console.log(`\n✨ Migration completed successfully!`);
  } else {
    console.log(`\n⚠️  Migration completed with errors. Please review above.`);
  }
}

applyMigration().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
