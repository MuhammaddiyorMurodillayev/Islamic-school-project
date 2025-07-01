import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://hgksxdreluaiibwrntun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhna3N4ZHJlbHVhaWlid3JudHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjc3NzMsImV4cCI6MjA2NjYwMzc3M30.ZmiKtl95aKlYZmDSOR5O5SMhXjrZMb6fGNlXIlP7Y7M';

export const supabase = createClient(supabaseUrl, supabaseKey);