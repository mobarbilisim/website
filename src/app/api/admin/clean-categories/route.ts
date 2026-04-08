import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
  }

  try {
    // Tüm kategorileri sil
    await supabase.from("categories").delete().neq("id", 0);

    const mainCats = [
      { name: "Yazılım Çözümleri", slug: "yazilim-cozumleri", parent_id: null },
      { name: "Sıfır Bilgisayarlar", slug: "sifir-bilgisayarlar", parent_id: null },
      { name: "Bileşenler", slug: "bilesenler", parent_id: null },
      { name: "Çevre Birimleri", slug: "cevre-birimleri", parent_id: null },
    ];

    for (const c of mainCats) {
      await supabase.from("categories").insert(c);
    }

    return NextResponse.json({ message: "Kategoriler temizlendi ve ana 4 kategori yüklendi!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
