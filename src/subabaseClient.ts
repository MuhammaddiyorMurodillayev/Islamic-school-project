import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://hjpgsmaoqdcscqdjwwis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqcGdzbWFvcWRjc2NxZGp3d2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjU4MDgsImV4cCI6MjA2Njk0MTgwOH0.BHCUGZn8nHae_EFZ9vL0NNEHoAYygHWHQMuZy734z2A';

export const supabase = createClient(supabaseUrl, supabaseKey);