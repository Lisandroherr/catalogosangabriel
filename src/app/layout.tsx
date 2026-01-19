import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catálogo San Gabriel | Soluciones Industriales",
  description:
    "Catálogo de productos industriales: papel higiénico, stretch film, tubos de cartón y empaques. Soluciones de calidad para su empresa.",
  keywords: [
    "papel higiénico industrial",
    "stretch film",
    "tubos de cartón",
    "empaques industriales",
    "cajas de cartón",
    "papel toalla industrial",
  ],
  authors: [{ name: "San Gabriel" }],
  openGraph: {
    title: "Catálogo San Gabriel | Soluciones Industriales",
    description:
      "Catálogo de productos industriales de alta calidad para empresas.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
