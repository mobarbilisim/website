import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap / Kayıt Ol | Mobar Bilişim",
  description: "Mobar Bilişim hesabınıza giriş yapın veya yeni hesap oluşturun.",
};

export default function GirisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
