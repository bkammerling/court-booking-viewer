import Navigation from "@/components/layout/Navigation";
import { Nunito } from 'next/font/google'
import type { Metadata } from 'next'
import "./globals.css";
import Footer from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "CourtServer",
  description: "Book tennis courts in London easily and quickly.",
  authors: [{ name: "Ben Kammerling" }]
};

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.className}>
      <body
        className={`antialiased`}
      >
        <div className="page-wrapper">
          <Navigation />
          <main>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
