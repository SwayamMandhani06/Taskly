import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

let url = process.env.VITE_SUPABASE_URL;
let key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  try {
    const envPath = path.resolve('.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const [k, ...v] = line.trim().split('=');
        if (k === 'VITE_SUPABASE_URL') url = v.join('=');
        if (k === 'VITE_SUPABASE_ANON_KEY') key = v.join('=');
      });
    }
  } catch (e) {}
}

if (!url || !key) {
  console.error('Supabase URL or Anon Key missing in environment.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function testRLS() {
  console.log('Testing unauthenticated (logged-out) query to Supabase...');
  
  const { data, error } = await supabase.from('tasks').select('*');
  
  if (error) {
    console.log('RLS Status: REJECTED / PROTECTED with error:', error.message);
  } else {
    console.log('RLS Status: Active. Logged-out request returned 0 rows:', data.length === 0, 'Data:', data);
  }
}

testRLS();
