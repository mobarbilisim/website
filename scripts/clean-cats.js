const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanCategories() {
  console.log("Kategoriler temizleniyor...");
  // Hepsini sil
  await supabase.from('categories').delete().neq('id', 0);
  
  const mainCats = [
    { name: "Yazılım Çözümleri", slug: "yazilim-cozumleri", parent_id: null },
    { name: "Sıfır Bilgisayarlar", slug: "sifir-bilgisayarlar", parent_id: null },
    { name: "Bileşenler", slug: "bilesenler", parent_id: null },
    { name: "Çevre Birimleri", slug: "cevre-birimleri", parent_id: null },
  ];

  for (const c of mainCats) {
    await supabase.from('categories').insert(c);
  }
  console.log("Sadece istenen 4 ana kategori eklendi!");
}

cleanCategories();
