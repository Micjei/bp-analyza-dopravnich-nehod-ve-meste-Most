import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { DataProvider } from "@/context/DataContext";
import { MapLayerProvider } from "@/context/MapLayerContext";
import HeaderSection from "@/components/HeaderSection";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dopravní data",
  description: "Vizualizace dopravních dat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <MapLayerProvider>
            <DataProvider>
              <HeaderSection />
              {children}
            </DataProvider>
          </MapLayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
