import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { CartDrawer } from "./components/CartDrawer";
import { WishlistDrawer } from "./components/WishlistDrawer";
import { AuthProvider } from "./providers/AuthProvider";
import SmoothScroll from "./providers/SmoothScroll";
import KiutaBanner from "./components/KiutaBanner";
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
          <SmoothScroll>
            <Header />
            <CartDrawer />
            <WishlistDrawer />
            <main className="flex-1">{children}</main>
            <KiutaBanner />
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "kiuta-toast",
                style: {
                  background: "rgba(10, 10, 10, 0.92)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#f4f4f5",
                  backdropFilter: "blur(16px)",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                },
              }}
            />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
