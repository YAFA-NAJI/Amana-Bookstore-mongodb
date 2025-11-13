// src/app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useState, useEffect } from 'react';
import { CartItem } from '../types';

const Navbar: React.FC = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // This function updates the cart count from localStorage.
    // It's designed to run on the client side only.
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          const cart: CartItem[] = JSON.parse(storedCart);
          const count = cart.reduce((total, item) => total + item.quantity, 0);
          setCartItemCount(count);
        } catch (error) {
          console.error('Failed to parse cart from localStorage', error);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    // Initial update
    updateCartCount();

    // Listen for custom event to update cart count
    window.addEventListener('cartUpdated', updateCartCount);

    // Clean up the event listener
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  return (
    <nav className="bg-gradient-to-r from-blue-50 via-blue-100 to-gray-100 shadow-lg fixed w-full top-0 z-10 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center" style={{ minHeight: '64px' }}>
        <Link href="/" className="flex items-center gap-3 text-2xl font-serif font-bold text-blue-900 cursor-pointer transition-transform duration-200 hover:scale-105">
          <img src="/globe.svg" alt="Logo" className="h-10 w-10" />
          <span>Amana Bookstore</span>
        </Link>
        <div className="flex items-center gap-7">
          <Link href="/" className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 text-lg font-medium ${pathname === '/' ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}>
            <span>Home</span>
          </Link>
          <Link href="/cart" className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700 text-lg font-medium relative ${pathname === '/cart' ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}>
            <span>My Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-base font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;