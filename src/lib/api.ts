// src/lib/api.ts
import { Book } from '../app/types';

export async function fetchBooks({ limit = 50 }: { limit?: number }) {
  const res = await fetch('/api/books');
  if (!res.ok) throw new Error('Failed to fetch books');
  const data: Book[] = await res.json();
  return { books: data.slice(0, limit) };
}
