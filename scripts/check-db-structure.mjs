import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure(tableName) {
  console.log(`\n🔍 Checking structure of table: ${tableName}`);
  
  try {
    // Try to get column information
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = '${tableName}' 
            ORDER BY ordinal_position;`
    });
    
    if (error) {
      console.log(`❌ Error getting structure for ${tableName}:`, error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log(`✅ Columns in ${tableName}:`);
      data.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } else {
      console.log(`⚠️  No column information found for ${tableName}`);
    }
  } catch (err) {
    console.log(`❌ Exception checking ${tableName}:`, err.message);
  }
}

async function checkDatabaseStructure() {
  console.log('🔍 CHECKING DATABASE STRUCTURE\n');
  
  const tablesToCheck = [
    'reservas',
    'reservation_participants',
    'payments',
    'users',
    'teams',
    'team_members',
    'invitations',
    'invitation_acceptances'
  ];
  
  for (const table of tablesToCheck) {
    await checkTableStructure(table);
  }
}

checkDatabaseStructure().catch(console.error);