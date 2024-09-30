import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://jdzitzsucntqbjvwiwxm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkeml0enN1Y250cWJqdndpd3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyNDExNzIsImV4cCI6MjA0MjgxNzE3Mn0.NmBkpUpX939nzVOq2MzgpXNFGmYTz7FZQZvgVSOqKY4"
);
