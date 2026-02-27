import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not defined.\n' +
    'Create a .env file based on .env.example.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
