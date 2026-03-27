import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { orderId, customerName, customerEmail, customerPhone, customerAddress, items, totalPrice } = body;

    if (!orderId || !customerName || !items) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    // Ürün listesi HTML oluştur
    const itemsHtml = items.map((item: any) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333">${item.title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:center">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:right">₺${(item.price * item.quantity).toLocaleString('tr-TR')}</td>
      </tr>`
    ).join("");

    const emailHtml = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:24px 32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">🛒 Yeni Sipariş Geldi!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">Sipariş #${orderId}</p>
      </div>

      <!-- Body -->
      <div style="padding:24px 32px">
        <!-- Customer Info -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:20px">
          <h3 style="margin:0 0 12px;font-size:15px;color:#1e293b">Müşteri Bilgileri</h3>
          <p style="margin:4px 0;font-size:14px;color:#475569"><strong>İsim:</strong> ${customerName}</p>
          <p style="margin:4px 0;font-size:14px;color:#475569"><strong>E-Posta:</strong> ${customerEmail || "-"}</p>
          <p style="margin:4px 0;font-size:14px;color:#475569"><strong>Telefon:</strong> ${customerPhone || "-"}</p>
          <p style="margin:4px 0;font-size:14px;color:#475569"><strong>Adres:</strong> ${customerAddress || "-"}</p>
        </div>

        <!-- Products Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <thead>
            <tr style="background:#f1f5f9">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Ürün</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Adet</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Tutar</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Total -->
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;text-align:right">
          <span style="font-size:14px;color:#1e40af">Toplam Tutar:</span>
          <span style="font-size:22px;font-weight:800;color:#1e40af;margin-left:8px">₺${totalPrice?.toLocaleString('tr-TR')}</span>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:12px;color:#94a3b8">Bu e-posta Mobar Bilişim sipariş sisteminden otomatik gönderilmiştir.</p>
      </div>
    </div>
    `;

    // Admin'e e-posta gönder
    const adminEmail = process.env.ADMIN_EMAIL || "mobarbilisim@gmail.com";
    
    const { data, error } = await resend.emails.send({
      from: "Mobar Bilişim <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🛒 Yeni Sipariş #${orderId} — ${customerName} (₺${totalPrice?.toLocaleString('tr-TR')})`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (err: any) {
    console.error("Notification Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
