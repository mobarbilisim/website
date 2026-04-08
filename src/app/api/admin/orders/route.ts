import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Siparişleri getir
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST - Sipariş durumunu güncelle
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await request.json();
  const { id, status, items, oldStatus } = body;

  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Stok düşürme: Bekliyor'dan başka duruma geçince
  if (oldStatus === "Bekliyor" && status !== "Bekliyor" && items) {
    for (const item of items) {
      if (item.id) {
        const { data: product } = await supabase.from("products").select("stock").eq("id", item.id).single();
        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - (item.quantity || 1));
          await supabase.from("products").update({ stock: newStock }).eq("id", item.id);
        }
      }
    }
  }

  return NextResponse.json({ message: "Sipariş güncellendi" });
}

// DELETE - Sipariş sil
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

  const { error } = await supabase.from("orders").delete().eq("id", parseInt(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Sipariş silindi" });
}
