'use client';

import { useState, useEffect } from 'react';
import BookGrid from './components/BookGrid';
import { Book } from './types'; // النوع الأصلي

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  async function loadBooks() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/books');
      const dataRaw = await res.json();
      const data: Book[] = dataRaw.map((b: any) => ({
        id: b.id || b._id?.toString(),
        title: b.title,
        author: b.author,
        price: b.price || 0,
        image: b.image || '/placeholder.png',
        description: b.description || '',
        isbn: b.isbn || '',
        genre: b.genre || '',
        tags: b.tags || [],
        publisher: b.publisher || '',
        year: b.year || 0,
        rating: b.rating || 0,
        reviewCount: b.reviews?.length || 0,
        reviews: b.reviews || [],
      }));
      console.log('Loaded books:', data); // <--- هذا يتحقق من البيانات
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  loadBooks();
}, []);


  const handleAddToCart = (bookId: string) => {
    console.log(`Added book ${bookId} to cart`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center bg-red-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <section className="text-center bg-blue-100 p-8 rounded-lg mb-12 shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome to the Amana Bookstore!</h1>
        <p className="text-lg text-gray-600">
          Your one-stop shop for the best books. Discover new worlds and adventures.
        </p>
      </section>

      {/* Featured Books Grid */}
      <BookGrid books={books} onAddToCart={handleAddToCart} />
    </div>
  );
}
