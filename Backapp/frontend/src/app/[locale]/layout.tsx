import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const locales = ['ru', 'uz', 'en'];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale)) {
    notFound();
  }

  return (
    <html lang={params.locale}>
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider initialLocale={params.locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
} 