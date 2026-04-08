import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role key kullanıyoruz — stok güncellemesi admin yetkisi gerektirir
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Geçersiz ürün listesi" }, { status: 400 });
    }

    const errors: string[] = [];

    for (const item of items) {
      const productId = item.id;
      const quantity = Number(item.quantity);

      if (!productId || !quantity || quantity < 1) continue;

      // Mevcut stok miktarını çek
      const { data: product, error: fetchError } = await supabaseAdmin
        .from("products")
        .select("id, title, stock")
        .eq("id", productId)
        .single();

      if (fetchError || !product) {
        errors.push(`Ürün bulunamadı: ${productId}`);
        continue;
      }

      const currentStock = product.stock ?? 0;
      const newStock = Math.max(0, currentStock - quantity);

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({ stock: newStock })
        .eq("id", productId);

      if (updateError) {
        errors.push(`Stok güncellenemedi: ${product.title}`);
      }
    }

    if (errors.length > 0) {
      console.warn("Stok güncelleme uyarıları:", errors);
    }

    return NextResponse.json({ success: true, warnings: errors });
  } catch (err: any) {
    console.error("Stok düşürme hatası:", err.message);
    return NextResponse.json({ error: "Stok güncellenirken hata oluştu" }, { status: 500 });
  }
}
