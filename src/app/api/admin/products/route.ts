import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Tüm ürünleri getir
export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}

// POST - Ürün ekle veya güncelle
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, price, description, category_id, condition, stock, image_url, images, badge, features } = body;

  if (!title || !price) {
    return NextResponse.json({ error: "Başlık ve fiyat zorunludur" }, { status: 400 });
  }

  const productData = {
    title,
    price: parseFloat(price),
    description,
    category_id: category_id ? parseInt(category_id) : null,
    condition,
    stock: parseInt(stock),
    image_url: image_url || (images?.[0] || ""),
    images: images || [],
    badge: badge || "",
    features: features || []
  };

  if (id) {
    const { data, error } = await supabase.from("products").update(productData).eq("id", id).select("*, categories(name)");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, message: "Ürün güncellendi" });
  } else {
    const { data, error } = await supabase.from("products").insert([productData]).select("*, categories(name)");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, message: "Ürün eklendi" });
  }
}

// DELETE - Ürün sil
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Ürün ID gerekli" }, { status: 400 });
  }

  const { error } = await supabase.from("products").delete().eq("id", parseInt(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Ürün silindi" });
}
