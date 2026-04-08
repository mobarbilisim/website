import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { items } = body; // [{ id: 1, order_index: 0 }, { id: 2, order_index: 1 }]

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    // Toplu güncelleme yerine döngüyle güncelliyoruz (Supabase upsert de kullanılabilir ama böylesi garanti)
    for (const item of items) {
      await supabase
        .from('categories')
        .update({ order_index: item.order_index })
        .eq('id', item.id);
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ message: "Sıralama başarıyla güncellendi" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
