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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bambilshoes.com"
  ),
  title: {
    default: "Bambil Shoes By Dario - Calzado Artesanal",
    template: "%s | Bambil Shoes By Dario",
  },
  description:
    "Descubre la fusión perfecta entre la robustez del cuero natural y la elegancia del diseño a medida. Calzado para mujeres de excelente calidad, elaborado artesanalmente en Santa Elena.",
  keywords: [
    "zapatos",
    "bambil shoes",
    "calzado artesanal",
    "cuero natural",
    "hecho a mano",
    "Santa Elena",
    "calzado para mujer",
  ],
  icons: {
    icon: [
      { url: "/Logo.png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
  openGraph: {
    title: "Bambil Shoes By Dario - Calzado Artesanal",
    description:
      "Descubre la fusión perfecta entre la robustez del cuero natural y la elegancia del diseño a medida. Calzado artesanal en Santa Elena.",
    siteName: "Bambil Shoes By Dario",
    images: [
      {
        url: "/Logo.png",
        width: 1280,
        height: 1280,
        alt: "Logo Bambil Shoes By Dario",
      },
    ],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bambil Shoes By Dario - Calzado Artesanal",
    description:
      "Descubre la fusión perfecta entre la robustez del cuero natural y la elegancia del diseño a medida.",
    images: ["/Logo.png"],
  },
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
