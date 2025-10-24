import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('🔍 Investigating aceites_convite table schema...\n');

  // Try to get table definition
  const tables = ['convites', 'aceites_convite'];

  for (const tableName of tables) {
    console.log(`\n📋 Checking ${tableName}:`);

    // Check if table exists and get some info
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
      console.log(`  Code: ${error.code}`);
      console.log(`  Details:`, error.details);
      console.log(`  Hint:`, error.hint);
    } else {
      console.log(`  ✅ Table exists`);
      console.log(`  📊 Row count: ${count}`);

      // Try to get a sample row to see structure
      const { data: sample } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (sample && sample.length > 0) {
        console.log(`  🔑 Columns:`, Object.keys(sample[0]).join(', '));
      }
    }
  }

  console.log('\n\n💡 Diagnosis:');
  console.log('If both tables exist when queried but COMMENT fails, this suggests:');
  console.log('1. The COMMENT command needs explicit schema qualification: public.aceites_convite');
  console.log('2. Or the SQL is being run in a restricted context');
  console.log('3. Or COMMENT commands are not supported via the current execution method');

  console.log('\n📝 Solution:');
  console.log('Try running the migration directly in Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/mowmpjdgvoeldvrqutvb/sql/new');
}

checkSchema().catch(console.error);
