'use client';

import { on } from "events";
import Link from "next/link"
import { useEffect, useState } from "react";

const Navigation = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false); 

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Menu items component
  const MenuItems = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      <Link 
        href="/map" 
        className="hover:text-yellow-600 dark:hover:text-gray-300 transition"
        onClick={onLinkClick}
      >
        Map
      </Link>
      <Link 
        href="/search" 
        className="hover:text-yellow-600 dark:hover:text-gray-300 transition"
        onClick={onLinkClick}
      >
        Search
      </Link>
      <Link 
        href="/my-courts" 
        className="hover:text-yellow-600 dark:hover:text-gray-300 transition"
        onClick={onLinkClick}
      >
        My courts
      </Link>
      <button
        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded cursor-pointer transition"
        onClick={() => {
          toggleTheme();
          onLinkClick?.();
        }}
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </button>
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-b-gray-300 dark:text-white p-4 md:px-8">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center z-50">
          <Link href="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-yellow-500" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
              <path d="m137-160-57-56 164-164q31-31 42.5-77.5T298-600q0-58 26-114t74-104q91-91 201-103t181 61q72 72 60 182T738-478q-48 48-104 74t-114 26q-97 0-142 11t-77 43L137-160Zm275-334q47 46 127 34t143-75q64-64 76.5-143.5T724-803q-48-48-125.5-36T456-763q-63 63-76.5 142.5T412-494ZM720-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113T720-40Zm0-80q33 0 56.5-23.5T800-200q0-33-23.5-56.5T720-280q-33 0-56.5 23.5T640-200q0 33 23.5 56.5T720-120Zm0-80Z"/>
            </svg>
            <div className="text-lg font-bold ml-2 text-yellow-500">CourtServer</div>
          </Link>
        </div>

        {/* Desktop Menu - Horizontal */}
        <div className="hidden md:flex items-center gap-6">
          <MenuItems />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-500 dark:text-gray-300 z-1002 cursor-pointer"
        >
          {menuOpen ? ( 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu - Vertical Overlay */}
      <div className={`
        md:hidden fixed top-0 left-0 w-full h-full z-1001 
        flex flex-col justify-center gap-6 text-lg text-center items-center
        bg-white dark:bg-gray-900
        transition-opacity duration-300
        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <MenuItems onLinkClick={() => setMenuOpen(false)} />
      </div>
    </nav>
  )
}

export default Navigation