import Navigation from "@/components/Navigation";
import Head from "next/head";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Book tennis courts in London easily and quickly." />
        <meta name="author" content="Your Name" />
        <title>CourtServer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
