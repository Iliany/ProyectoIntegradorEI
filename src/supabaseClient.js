// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://venmgboolwitvlymemyo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbm1nYm9vbHdpdHZseW1lbXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNDgyNTgsImV4cCI6MjA0NzcyNDI1OH0.TK_cQimiyfdksjs7xtu7bYWiS4L6CKxEg2v5NArQwEI';

// Crear instancia del cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
