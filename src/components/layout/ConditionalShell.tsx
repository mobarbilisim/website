"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Admin sayfalarında Header, Footer ve WhatsApp butonu gösterilmez
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
