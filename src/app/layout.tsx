import Navigation from "@/components/Navigation";
import type { Metadata } from 'next'
import "./globals.css";

export const metadata: Metadata = {
  title: "CourtServer",
  description: "Book tennis courts in London easily and quickly.",
  authors: [{ name: "Ben Kammerling" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Navigation />
        <main className="pb-15">
          {children}
        </main>
      </body>
    </html>
  );
}
