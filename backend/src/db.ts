// This file is deprecated. 
// We have switched to using @supabase/supabase-js in src/config/supabaseClient.ts
// Do not use this file for database connections.

export const query = async (text: string, params?: any[]) => {
  console.error('CRITICAL: Attempted to use deprecated pg query:', text);
  throw new Error('Database connection via pg is disabled. Use supabase client.');
};

export const getClient = async () => {
  throw new Error('Database connection via pg is disabled. Use supabase client.');
};
