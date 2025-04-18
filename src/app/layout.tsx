import type { Metadata } from "next";
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
                <a href="/" className="hover:text-gray-300">Home</a>
                <a href="/dashboard" className="hover:text-gray-300">Dashboard</a>
                <a href="/about" className="hover:text-gray-300">About</a>
                <a href="/contact" className="hover:text-gray-300">Contact</a>
              </div>
            </div>
          </div>
        </nav>
        
        {children}
      </body>
    </html>
  );
}
