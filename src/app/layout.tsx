import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCategoriesSlider from "@/components/ProductCategoriesSlider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sao Nam TG",
  description: "STC LUÔN QUAN TÂM ĐẾN LỢI ÍCH KHÁCH HÀNG",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Headers - they include their own spacers */}
          <Header />
          <ProductCategoriesSlider />
          
          {/* Main content with proper background and padding */}
          <main className="flex-grow bg-white pb-8 pt-4">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
