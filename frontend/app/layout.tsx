import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Keep this for Tailwind
import '@/styles/globals.css'; // Optional, if you have additional global styles

const geistSans = Geist({
  // your configuration
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