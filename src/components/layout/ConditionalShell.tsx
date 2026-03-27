"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalShellProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  whatsappButton: ReactNode;
}

export default function ConditionalShell({ 
  children, 
  header, 
  footer, 
  whatsappButton 
}: ConditionalShellProps) {
  const pathname = usePathname();
  
  // Admin sayfalarında Header, Footer ve WhatsApp butonu gösterilmez
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {whatsappButton}
      {footer}
    </>
  );
}
