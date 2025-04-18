import Link from "next/link";
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
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">London Tennis Court Booker</div>
              <div className="space-x-4">
                <Link href="/" className="hover:text-gray-300">Home</Link>
                <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                <Link href="/about" className="hover:text-gray-300">About</Link>
                <Link href="/contact" className="hover:text-gray-300">Contact</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
