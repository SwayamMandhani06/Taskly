import { createClient } from '@supabase/supabase-js';

const url = 'https://bbgbgtrtbenlbzvsqdlf.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ2JndHJ0YmVubGJ6dnNxZGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczOTQyNjcsImV4cCI6MjEwMjk3MDI2N30.3c8xNxUk9rq4tdRNc9iY-cfE-NUkpPQWGNuBT02ooh4';

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
