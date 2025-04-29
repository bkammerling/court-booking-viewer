import Navigation from "@/components/Navigation";
import "./globals.css";

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
        <main className="px-4 pb-15">
          {children}
        </main>
      </body>
    </html>
  );
}
