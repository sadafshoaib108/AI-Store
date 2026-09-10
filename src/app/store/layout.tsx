import { CartProvider } from "@/hooks/use-cart";
import StoreNavbar from "@/components/store/navbar";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <StoreNavbar />
      {children}
    </CartProvider>
  );
}
