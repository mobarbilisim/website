import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sepetim | Mobar Bilişim",
  description: "Sepetinizdeki ürünleri görüntüleyin ve siparişinizi tamamlayın.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
