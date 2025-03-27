import { Inter } from "next/font/google"; 
import "./globals.css";

const geistSans = Inter({
  subsets: ["latin"],
  preload: true, 
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geistSans.className}>
        {children}
      </body>
    </html>
  );
}