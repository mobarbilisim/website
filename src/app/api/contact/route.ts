import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Geçersiz ad alanı" }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Geçersiz e-posta adresi" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ error: "Mesaj çok kısa (en az 10 karakter)" }, { status: 400 });
    }

    const safeName    = escapeHtml(name.trim());
    const safeEmail   = escapeHtml(email.trim());
    const safeSubject = subject ? escapeHtml(String(subject).trim()) : "Belirtilmedi";
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br/>");

    const adminEmail = process.env.ADMIN_EMAIL || "mobarbilisim@gmail.com";

    const { error } = await resend.emails.send({
      from: "Mobar Bilisim <onboarding@resend.dev>",
      to: [adminEmail],
      replyTo: email.trim(),
      subject: `İletişim Formu: ${safeSubject} — ${safeName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:12px">
          <h2 style="color:#1e3a5f;margin-bottom:24px;font-size:20px">📬 Yeni İletişim Formu Mesajı</h2>
          <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.07)">
            <tr>
              <td style="padding:12px 16px;background:#f0f4ff;font-weight:bold;color:#374151;width:140px;font-size:13px">Ad Soyad</td>
              <td style="padding:12px 16px;color:#1f2937;font-size:14px">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f0f4ff;font-weight:bold;color:#374151;font-size:13px">E-Posta</td>
              <td style="padding:12px 16px;color:#1f2937;font-size:14px">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f0f4ff;font-weight:bold;color:#374151;font-size:13px">Konu</td>
              <td style="padding:12px 16px;color:#1f2937;font-size:14px">${safeSubject}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f0f4ff;font-weight:bold;color:#374151;vertical-align:top;font-size:13px">Mesaj</td>
              <td style="padding:12px 16px;color:#1f2937;font-size:14px;line-height:1.6">${safeMessage}</td>
            </tr>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#9ca3af">Bu e-posta Mobar Bilişim iletişim formu üzerinden gönderilmiştir. Yanıtlamak için doğrudan bu e-postayı cevaplayabilirsiniz.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Contact email error:", error);
      return NextResponse.json({ error: "E-posta gönderilemedi" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("Contact API error:", message);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
