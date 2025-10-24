import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testComment() {
  console.log('🧪 Testing COMMENT ON TABLE command...\n');

  // Try to add comment via raw SQL
  const testSQL = `
    COMMENT ON TABLE public.aceites_convite IS 'Test comment - aceites vinculados ao lote';
  `;

  const { data, error } = await supabase.rpc('exec_sql', { sql: testSQL });

  if (error) {
    console.error('❌ Error adding comment:', error);

    // Try alternative: direct query
    console.log('\n🔄 Trying via direct query...');
    const { error: error2 } = await supabase.from('aceites_convite').select('count', { count: 'exact', head: true });

    if (error2) {
      console.error('❌ Table access error:', error2);
    } else {
      console.log('✅ Table is accessible via queries');
      console.log('\n💡 The issue is likely with how the migration SQL is being executed.');
      console.log('Try running the migration file via Supabase CLI:');
      console.log('  supabase db execute --file supabase/migrations/20241024_final_high_priority_items.sql');
    }
  } else {
    console.log('✅ Comment added successfully');
  }
}

testComment().catch(console.error);
