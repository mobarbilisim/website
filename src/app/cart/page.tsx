"use client";

import { useCart } from "@/components/providers/CartProvider";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const supabase = createClient();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("orders").insert([
        {
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          total_price: totalPrice,
          status: "Bekliyor",
          items: items
        }
      ]);

      if (error) throw error;

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push("/");
      }, 5000);

    } catch (err: any) {
      alert("Sipariş oluşturulurken bir hata oluştu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={50} />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Siparişiniz Alındı!</h1>
        <p className="text-gray-500 max-w-md mb-8">
          Siparişiniz başarıyla alındı ve uzman ekibimize ulaştı. Satış temsilcimiz en kısa sürede sizinle iletişime geçecektir. 
          Anasayfaya yönlendiriliyorsunuz...
        </p>
        <Link href="/" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition">
          Sitede Gezinmeye Devam Et
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-gray-500 max-w-sm mb-8">
          Hemen teknoloji ürünlerimizi inceleyerek fırsatları değerlendirin.
        </p>
        <Link href="/store" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Sepetiniz ({totalItems} Ürün)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-7 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center text-xs text-gray-400">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                ) : (
                  "Görsel Yok"
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-sm font-bold text-blue-600 mt-1">{(item.price).toLocaleString('tr-TR')} ₺</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition hover:shadow-sm">
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white rounded-md transition hover:shadow-sm">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Toplam: <span className="text-gray-900 font-bold">{(item.price * item.quantity).toLocaleString('tr-TR')} ₺</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Sipariş Bilgileri</h2>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ad Soyad / Firma Adı</label>
                <input required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" placeholder="Ahmet Yılmaz" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">E-Posta</label>
                  <input required value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" placeholder="ornek@posta" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Telefon</label>
                  <input required value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" placeholder="0532 000 0000" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Teslimat Adresi</label>
                <textarea required value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition resize-none" placeholder="Mahalle, Sokak, No, İl/İlçe..."></textarea>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Ara Toplam</span>
                <span className="font-medium">{totalPrice.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-500">Kargo & Kurulum</span>
                <span className="font-medium text-emerald-600">Ücretsiz</span>
              </div>
              <div className="flex items-center justify-between text-xl font-bold border-t border-gray-100 pt-4 mb-8">
                <span>Genel Toplam</span>
                <span className="text-blue-600">{totalPrice.toLocaleString('tr-TR')} ₺</span>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-75 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xl shadow-blue-500/20"
              >
                {loading ? "Sipariş İşleniyor..." : "Siparişi Tamamla"} 
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
