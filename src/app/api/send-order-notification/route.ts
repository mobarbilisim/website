import { NextRequest, NextResponse } from "next/server";

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendBrevoEmail(to: string, subject: string, htmlContent: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY || "",
    },
    body: JSON.stringify({
      sender: { name: "Mobar Bilişim", email: "mobarbilisim@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo hata: ${err}`);
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerName, customerEmail, customerPhone, customerAddress, items, totalPrice } = body;

    if (!orderId || !customerName || !items) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const safeName    = escapeHtml(customerName);
    const safeEmail   = customerEmail ? escapeHtml(customerEmail) : "-";
    const safePhone   = customerPhone ? escapeHtml(customerPhone) : "-";
    const safeAddress = customerAddress ? escapeHtml(customerAddress) : "-";

    const itemsHtml = items.map((item: any) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333">${escapeHtml(item.title)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:center">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:right">₺${(item.price * item.quantity).toLocaleString('tr-TR')}</td>
      </tr>`
    ).join("");

    const emailHtml = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:24px 32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">🛒 Yeni Sipariş Geldi!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">Sipariş #${orderId}</p>
      </div>
      <div style="padding:24px 32px">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:20px">
          <h3 style="margin:0 0 12px;font-size:15px;color:#1e293b">Müşteri Bilgileri</h3>
          <p style="margin:4px 0;font-size:14px;color:#475569"><strong>İsim:</strong> ${safeName}</p>
          <p style="margin:4px 0;font-size:14px;color:#475569"><strong>E-Posta:</strong> ${safeEmail}</p>
          <p style="margin:4px 0;font-size:14px;color:#475569"><strong>Telefon:</strong> ${safePhone}</p>
          <p style="margin:4px 0;font-size:14px;color:#475569"><strong>Adres:</strong> ${safeAddress}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <thead>
            <tr style="background:#f1f5f9">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748b;text-transform:uppercase">Ürün</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#64748b;text-transform:uppercase">Adet</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#64748b;text-transform:uppercase">Tutar</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;text-align:right">
          <span style="font-size:14px;color:#1e40af">Toplam Tutar:</span>
          <span style="font-size:22px;font-weight:800;color:#1e40af;margin-left:8px">₺${totalPrice?.toLocaleString('tr-TR')}</span>
        </div>
      </div>
      <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:12px;color:#94a3b8">Bu e-posta Mobar Bilişim sipariş sisteminden otomatik gönderilmiştir.</p>
      </div>
    </div>`;

    const adminEmail = process.env.ADMIN_EMAIL || "mobarbilisim@gmail.com";
    await sendBrevoEmail(
      adminEmail,
      `🛒 Yeni Sipariş #${orderId} — ${safeName} (₺${totalPrice?.toLocaleString('tr-TR')})`,
      emailHtml
    );

    // Müşteriye sipariş onay maili gönder (e-posta varsa)
    if (customerEmail) {
      const customerHtml = `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800">✅ Siparişiniz Alındı!</h1>
          <p style="color:rgba(255,255,255,0.85);margin:10px 0 0;font-size:15px">Sipariş Numarası: <strong>#${orderId}</strong></p>
        </div>
        <div style="padding:28px 32px">
          <p style="font-size:15px;color:#374151;margin-bottom:6px">Merhaba <strong>${safeName}</strong>,</p>
          <p style="font-size:14px;color:#6b7280;margin-bottom:24px;line-height:1.6">
            Siparişiniz başarıyla alındı. Satış ekibimiz sipariş detaylarınızı inceleyerek en kısa sürede sizinle iletişime geçecektir.
          </p>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:20px">
            <h3 style="margin:0 0 12px;font-size:14px;color:#1e293b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Sipariş Özeti</h3>
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="background:#f1f5f9">
                  <th style="padding:8px 10px;text-align:left;font-size:12px;color:#64748b">Ürün</th>
                  <th style="padding:8px 10px;text-align:center;font-size:12px;color:#64748b">Adet</th>
                  <th style="padding:8px 10px;text-align:right;font-size:12px;color:#64748b">Tutar</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;text-align:right">
              <span style="font-size:13px;color:#64748b">Toplam: </span>
              <span style="font-size:18px;font-weight:800;color:#1e40af">₺${totalPrice?.toLocaleString('tr-TR')}</span>
            </div>
          </div>

          <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:14px 16px;margin-bottom:20px">
            <p style="margin:0;font-size:13px;color:#065f46;line-height:1.6">
              📞 Sorularınız için: <strong>+90 533 040 7227</strong><br/>
              📧 E-posta: <strong>mobarbilisim@gmail.com</strong>
            </p>
          </div>

          <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0">
            Bu e-posta, mobar.com.tr üzerinden verdiğiniz sipariş nedeniyle gönderilmiştir.
            Sipariş vermediyseniz lütfen bizimle iletişime geçin.
          </p>
        </div>
        <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#94a3b8">© 2025 Mobar Bilişim — Gaziantep</p>
        </div>
      </div>`;

      try {
        await sendBrevoEmail(
          customerEmail,
          `✅ Siparişiniz Alındı — Sipariş #${orderId} | Mobar Bilişim`,
          customerHtml
        );
      } catch (customerMailErr: any) {
        // Müşteri maili başarısız olsa da sipariş alındı sayılır
        console.warn("Müşteri onay maili gönderilemedi:", customerMailErr?.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Sipariş bildirimi hatası:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
