import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://psawamvkpvcyuuhthcva.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzYXdhbXZrcHZjeXV1aHRoY3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxODE3ODIsImV4cCI6MjAxODc1Nzc4Mn0.LZnRGXWt8jwS_zAVYWGGr8F7xWDDl1Iv-4nuJyQ5re0";

export const supabase = createClient(supabaseUrl, supabaseKey);
