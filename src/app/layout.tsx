import type { Metadata } from "next";
import { Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpiroStudio",
  description: "Generate mesmerizing spirograph art with ease.",
  openGraph: {
    title: "SpiroStudio",
    description: "Generate mesmerizing spirograph art with ease.",
    url: "https://spiro-studio.vercel.app/",
    siteName: "SpiroStudio",
    images: [
      {
        url: "https://spiro-studio.vercel.app/logo.svg",
        width: 512,
        height: 512,
        alt: "SpiroStudio Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
