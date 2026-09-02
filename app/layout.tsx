import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import QueryProvider from "@/providers/query-provider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Bambil Shoes By Dario - Inicio",
  description: "Descubre la fusión perfecta entre la robustez del cuero natural y la elegancia del diseño a medida. Cada par cuenta una historia de dedicación y maestría.",
  keywords: ["zapatos", "bambil shoes", "calzado artesanal", "cuero natural", "hecho a mano"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fcf9f2] text-[#1c1c18] font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
