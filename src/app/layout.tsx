import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/providers/CartProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mobar Bilişim | Kurumsal Teknoloji & 2. El Çözümler",
  description: "Sıfır ve 2. el garantili teknoloji ürünleri, profesyonel özel yazılım çözümleri ve kurumunuza özel altyapı hizmetleri.",
  keywords: ["bilgisayar", "2. el teknoloji", "kurumsal bilişim", "özel yazılım", "teknik servis", "mobar"],
  openGraph: {
    title: "Mobar Bilişim | Teknoloji Çözümleri",
    description: "Sıfır ve 2. el garantili teknoloji ürünleri, özel yazılım.",
    url: "https://mobarbilisim.com",
    siteName: "Mobar Bilişim",
    images: [
      {
        url: "/MOBAR.png",
        width: 1200,
        height: 630,
        alt: "Mobar Bilişim",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobar Bilişim",
    description: "Kurumsal ve bireysel teknoloji çözümleri.",
    images: ["/MOBAR.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} font-sans antialiased text-gray-900 bg-gray-50 min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
