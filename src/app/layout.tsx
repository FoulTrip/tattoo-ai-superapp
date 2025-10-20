import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from 'geist/font/sans';
import SessionProviderWrapper from "../context/SessionProviderWrapper";
import { DarkModeProvider } from "../context/DarkModeContext";
import Navbar from "@/components/navbar/NavBar";

export const metadata: Metadata = {
  title: "Tattoo Innova",
  description: "Aplicación web moderna para previsualizar tatuajes usando inteligencia artificial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={GeistSans.className}
      >
        <SessionProviderWrapper>
          <DarkModeProvider>
            <Navbar />
            {children}
          </DarkModeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
