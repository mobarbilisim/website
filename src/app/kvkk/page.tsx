import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Mobar Bilişim",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin işlenmesine ilişkin aydınlatma metni.",
};

export default function KVKKPage() {
  return (
    <div className="bg-gray-50 flex-1 min-h-[70vh]">
      <div className="bg-blue-600 text-white py-12 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">KVKK Aydınlatma Metni</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-base">
          6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 prose prose-blue max-w-none text-gray-700 text-sm leading-relaxed">

          <h2 className="text-lg font-bold text-gray-900 mt-0">1. Veri Sorumlusu</h2>
          <p>
            Bu aydınlatma metni, <strong>Mobar Bilişim</strong> (bundan sonra &quot;Şirket&quot; olarak anılacaktır)
            tarafından, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca hazırlanmıştır.
          </p>
          <ul>
            <li><strong>Unvan:</strong> Mobar Bilişim</li>
            <li><strong>Adres:</strong> Şehitkamil / Gaziantep</li>
            <li><strong>E-posta:</strong> mobarbilisim@gmail.com</li>
            <li><strong>Telefon:</strong> +90 533 040 7227</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900">2. İşlenen Kişisel Veriler</h2>
          <p>Aşağıdaki kişisel veriler işlenebilmektedir:</p>
          <ul>
            <li><strong>Kimlik:</strong> Ad, soyad</li>
            <li><strong>İletişim:</strong> E-posta adresi, telefon numarası, adres</li>
            <li><strong>Sipariş:</strong> Satın alınan ürünler, sipariş tutarı, sipariş tarihi</li>
            <li><strong>Teknik:</strong> IP adresi, tarayıcı bilgisi, çerez verileri (analitik amaçlı)</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul>
            <li>Sipariş ve satış işlemlerinin gerçekleştirilmesi</li>
            <li>Müşteri hizmetleri ve iletişim taleplerinin karşılanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Site kullanım istatistiklerinin analiz edilmesi (Google Analytics)</li>
            <li>Güvenlik ve dolandırıcılığın önlenmesi</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900">4. Hukuki Dayanaklar</h2>
          <p>Kişisel verileriniz KVKK&#39;nın 5. maddesi kapsamında aşağıdaki hukuki dayanaklar çerçevesinde işlenmektedir:</p>
          <ul>
            <li>Bir sözleşmenin kurulması veya ifası için veri işlemenin zorunlu olması</li>
            <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi</li>
            <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla meşru menfaatlerimiz</li>
            <li>Açık rızanız (analitik çerezler için)</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900">5. Üçüncü Taraflarla Paylaşım</h2>
          <p>
            Kişisel verileriniz; kargo ve teslimat süreçleri, e-posta bildirimleri (Brevo), web analitiği (Google Analytics)
            gibi hizmet sağlayıcılarla yalnızca gerekli ölçüde paylaşılmaktadır. Bu üçüncü taraflar verilerinizi
            kendi amaçları için kullanamaz.
          </p>

          <h2 className="text-lg font-bold text-gray-900">6. Çerez Politikası</h2>
          <p>Sitemizde aşağıdaki çerez türleri kullanılmaktadır:</p>
          <ul>
            <li><strong>Zorunlu çerezler:</strong> Oturum yönetimi, sepet ve güvenlik için. Rıza gerekmez.</li>
            <li><strong>Analitik çerezler:</strong> Google Analytics — kullanım istatistikleri. Rıza gerektirir.</li>
          </ul>
          <p>Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz. Zorunlu çerezler devre dışı bırakıldığında site işlevselliği etkilenebilir.</p>

          <h2 className="text-lg font-bold text-gray-900">7. Saklama Süresi</h2>
          <p>
            Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca saklanır. Sipariş verileri
            Türk Ticaret Kanunu gereği <strong>10 yıl</strong> süreyle tutulabilir.
          </p>

          <h2 className="text-lg font-bold text-gray-900">8. KVKK Kapsamındaki Haklarınız</h2>
          <p>KVKK&#39;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini isteme</li>
            <li>İşlemenin otomatik sistemler vasıtasıyla yapılması durumunda aleyhte oluşan sonuca itiraz etme</li>
            <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>
          <p>
            Haklarınızı kullanmak için <strong>mobarbilisim@gmail.com</strong> adresine yazabilirsiniz.
            Başvurular <strong>30 gün</strong> içinde yanıtlanacaktır.
          </p>

          <p className="text-xs text-gray-400 border-t border-gray-100 pt-4 mt-6">
            Son güncelleme: Nisan 2025
          </p>
        </div>
      </div>
    </div>
  );
}
