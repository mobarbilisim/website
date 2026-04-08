import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  
  // Get products with select *
  const { data: products, error: prodErr } = await supabase.from('products').select('*').limit(5);
  
  // Get product count
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });

  return NextResponse.json({ 
    total_count: count,
    prodErr: prodErr?.message || null,
    sample_columns: products?.[0] ? Object.keys(products[0]) : 'NO_PRODUCTS',
    sample: products?.slice(0, 2)
  });
}
