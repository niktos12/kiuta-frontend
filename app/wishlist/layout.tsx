import type { Metadata } from "next";
import "../globals.css"
import {Header} from "../components/Header";
import { CartDrawer } from "../components/CartDrawer";
import { WishlistDrawer } from "../components/WishlistDrawer";
import { AuthProvider } from "../providers/AuthProvider";
import KiutaBanner from "../components/KiutaBanner";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "KIUTA — Premium Electronics",
  description: "Premium electronics marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-black text-white">
        <AuthProvider>
          <Header />
          <CartDrawer />
          <WishlistDrawer />
          <main className="flex-1">{children}</main>
          <KiutaBanner />
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
