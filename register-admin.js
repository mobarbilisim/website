const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oxulofzrdwopvegacpoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dWxvZnpyZHdvcHZlZ2FjcG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODA4OTYsImV4cCI6MjA4OTk1Njg5Nn0.bQOmQEC0yhb_Ixun7wXnIlhpGCQB6TJCoXf8eYocqIg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function register() {
  const { data, error } = await supabase.auth.signUp({
    email: 'mobarbilisim@gmail.com',
    password: 'Afatsum19941602',
  });
  if (error) {
    console.error("HATA:", error.message);
  } else {
    console.log("BASARILI", data.user.id);
  }
}
register();
