import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Code_Pro, Krona_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";

import Navbar from '@/components/Navbar'
import Footer from "@/components/Footer";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const kronaOne = Krona_One({
  variable: "--font-krona-one",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Ricardo: engineer",
  description: "rickirom's website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} ${sourceCodePro.variable} ${kronaOne.variable} antialiased`}>
        <Navbar/>
        <ThemeProvider>{children}</ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}

