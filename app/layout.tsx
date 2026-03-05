import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const merriweather = Merriweather({ 
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"], 
  variable: "--font-serif" 
});

export const metadata: Metadata = {
  title: "WishLink 8/3 - Beautiful, Collaborative Greeting Cards",
  description: "Create and share beautiful International Women's Day cards with friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased text-stone-900 bg-stone-50 selection:bg-rose-200 selection:text-rose-900`}>
        {children}
      </body>
    </html>
  );
}
