// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ticyyohqjxvzoeapasve.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpY3l5b2hxanh2em9lYXBhc3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4OTk5OTYsImV4cCI6MjA1ODQ3NTk5Nn0.0dd5QCur5E8JRTfGUS04Va5uCtn0WD-Cs43qoghOVWg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);