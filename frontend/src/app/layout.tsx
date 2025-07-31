import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ассоциация Селлеров Узбекистана",
  description: "Объединяем профессионалов электронной коммерции",
  keywords: ["электронная коммерция", "селлеры", "Узбекистан", "ассоциация"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
