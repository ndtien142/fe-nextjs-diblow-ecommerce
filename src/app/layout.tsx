import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import ClientOnly from "@/components/ClientOnly";

export const metadata = {
  title: "Diblow - Premium E-Commerce",
  description: "E-Commerce with Next.js ",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased text-gray-700 color-[##1939bc]"
        suppressHydrationWarning
      >
        <ClientOnly>
          <Toaster />
          <AppContextProvider>
            <main className="relative z-50">{children}</main>
          </AppContextProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
