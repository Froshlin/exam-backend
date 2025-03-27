import { Inter, Geist_Mono } from "next/font/google"; 
import "./globals.css"; // Keep this for Tailwind

const geistSans = Inter({
  subsets: ["latin"], // Add 'latin' or 'latin-ext' to fix the error
  preload: true, 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geistSans.className}>
        {children}
      </body>
    </html>
  );
}
