import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartProvider";
import { FavoriteProvider } from "@/components/providers/FavoriteProvider";
import PWARegister from "@/components/ui/PWARegister";
import Script from "next/script";
import ConditionalShell from "@/components/layout/ConditionalShell";

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
    images: [{ url: "/MOBAR.png", width: 1200, height: 630, alt: "Mobar Bilişim" }],
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased text-gray-900 bg-gray-50 min-h-screen flex flex-col`}>
        <CartProvider>
          <FavoriteProvider>
            <PWARegister />
            <ConditionalShell>
              {children}
            </ConditionalShell>
          </FavoriteProvider>
        </CartProvider>

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
