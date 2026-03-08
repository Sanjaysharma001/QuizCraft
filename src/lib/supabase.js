import { createClient } from '@supabase/supabase-js'

// ⚠️  REPLACE these two values with your own from supabase.com
// Go to: Project Settings → API → copy "Project URL" and "anon public" key
const SUPABASE_URL  = 'https://koqdhufheldpyhzqeojc.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvcWRodWZoZWxkcHloenFlb2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzk0MDIsImV4cCI6MjA4ODM1NTQwMn0.N62tcc7Ys-61J270HV7QNyPZBGc0nUqOmTYnmxA0CC4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
