const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oxulofzrdwopvegacpoa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dWxvZnpyZHdvcHZlZ2FjcG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODA4OTYsImV4cCI6MjA4OTk1Njg5Nn0.bQOmQEC0yhb_Ixun7wXnIlhpGCQB6TJCoXf8eYocqIg'
);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'mobarbilisim@gmail.com',
    password: 'Afatsum19941602'
  });
  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS:', data.user.id);
  }
}
testLogin();
