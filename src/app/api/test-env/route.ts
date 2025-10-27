import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    asaas_api_key_exists: !!process.env.ASAAS_API_KEY,
    asaas_api_key_length: process.env.ASAAS_API_KEY?.length || 0,
    asaas_api_key_prefix: process.env.ASAAS_API_KEY?.substring(0, 15) || 'not found',
    asaas_environment: process.env.ASAAS_ENVIRONMENT || 'not set',
    supabase_url_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    node_env: process.env.NODE_ENV,
  });
}
