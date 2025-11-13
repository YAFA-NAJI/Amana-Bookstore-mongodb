// src/app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CartItem from "../components/CartItem";
import { books } from "../data/books";
import { Book, CartItem as CartItemType } from "../types";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<
    { book: Book; quantity: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const cart: CartItemType[] = JSON.parse(storedCart);
        const itemsWithBooks = cart
          .map((item) => {
            const book = books.find((b) => b.id === item.bookId);
            return book ? { book, quantity: item.quantity } : null;
          })
          .filter(
            (item): item is { book: Book; quantity: number } => item !== null
          );

        setCartItems(itemsWithBooks);
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCartItems([]);
      }
    }
    setIsLoading(false);
  }, []);

  const updateQuantity = (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Update local state
    const updatedItems = cartItems.map((item) =>
      item.book.id === bookId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    // Update localStorage
    const cartForStorage = updatedItems.map((item) => ({
      id: `${item.book.id}-${Date.now()}`,
      bookId: item.book.id,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem("cart", JSON.stringify(cartForStorage));

    // Notify navbar
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const removeItem = (bookId: string) => {
    // Update local state
    const updatedItems = cartItems.filter((item) => item.book.id !== bookId);
    setCartItems(updatedItems);

    // Update localStorage
    const cartForStorage = updatedItems.map((item) => ({
      id: `${item.book.id}-${Date.now()}`,
      bookId: item.book.id,
      quantity: item.quantity,
      addedAt: new Date().toISOString(),
    }));
    localStorage.setItem("cart", JSON.stringify(cartForStorage));

    // Notify navbar
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
        {cartItems.length > 0 && (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold border border-slate-200">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl shadow-md border border-slate-200">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-600 mb-8">
            Discover amazing books and start your collection
          </p>
          <Link
            href="/"
            className="inline-block bg-slate-700 text-white px-10 py-4 rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg cursor-pointer font-semibold"
          >
            Explore Books
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            {cartItems.map((item, index) => (
              <div
                key={item.book.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in"
              >
                <CartItem
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 bg-slate-50 rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-300">
              <span className="text-xl font-semibold text-slate-700">
                Subtotal
              </span>
              <span className="text-4xl font-bold text-slate-800">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 bg-white border-2 border-slate-300 text-slate-700 text-center py-3 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold cursor-pointer hover:shadow-md"
              >
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all hover:shadow-lg font-semibold cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}