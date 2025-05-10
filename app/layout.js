import { Bungee } from "next/font/google";
import "./globals.css";

const bungee = Bungee({
  variable: "--font-bungee-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Card Game",
  description: "Fun Card Game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${bungee.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
