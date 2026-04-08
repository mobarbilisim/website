import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// GET - Tüm kategorileri getir
export async function GET() {
  const supabase = await createClient();

  // Önce order_index ile çekmeyi dene
  let { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order_index", { ascending: true, nullsFirst: false });

  // Eğer order_index sütunu yoksa SQL hatası döner, fallback olarak ID'ye göre çek
  if (error) {
    const fallback = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });
      
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST - Yeni kategori ekle veya güncelle
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, parent_id, slug, image_url } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Kategori adı boş olamaz" }, { status: 400 });
  }

  if (id) {
    // Güncelleme
    const { data, error } = await supabase
      .from("categories")
      .update({ name: name.trim(), parent_id: parent_id || null, slug, image_url: image_url || null })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    revalidatePath('/', 'layout');
    return NextResponse.json({ data, message: "Kategori güncellendi" });
  } else {
    // Yeni ekleme
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: name.trim(), parent_id: parent_id || null, slug, image_url: image_url || null }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    revalidatePath('/', 'layout');
    return NextResponse.json({ data, message: "Kategori eklendi" });
  }
}

// DELETE - Kategori sil
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Kategori ID gerekli" }, { status: 400 });
  }

  // Alt kategorileri kontrol et - varsa parent_id'lerini null yap
  await supabase
    .from("categories")
    .update({ parent_id: null })
    .eq("parent_id", parseInt(id));

  // Ürünlerin category_id'sini null yap
  await supabase
    .from("products")
    .update({ category_id: null })
    .eq("category_id", parseInt(id));

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", parseInt(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/', 'layout');
  return NextResponse.json({ message: "Kategori silindi" });
}
