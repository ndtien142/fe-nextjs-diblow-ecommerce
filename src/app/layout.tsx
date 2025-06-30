import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import ClientOnly from "@/components/ClientOnly";

export const metadata = {
  title: "QuickCart - GreatStack",
  description: "E-Commerce with Next.js ",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-gray-700" suppressHydrationWarning>
        <ClientOnly>
          <Toaster />
          <AppContextProvider>{children}</AppContextProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
