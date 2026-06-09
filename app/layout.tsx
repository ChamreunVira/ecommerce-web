import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Welcome to my website!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-full antialiased text-gray-700 ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
