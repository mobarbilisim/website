import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesabım | Mobar Bilişim",
  description: "Profil bilgilerinizi, siparişlerinizi ve adres bilgilerinizi yönetin.",
};

export default function HesabimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
