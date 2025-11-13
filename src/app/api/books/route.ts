// src/app/api/books/route.ts
import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";

const uri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;

export async function GET(req: NextRequest) {
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }
    const db = cachedClient.db("bookstoreDB");
    const booksRaw = await db.collection("books").find({}).toArray();

    // تحويل البيانات لتطابق نوع Book
    const books = booksRaw.map((b: any) => ({
      id: b._id.toString(),
      title: b.title,
      author: b.author,
      price: b.price || 0,
      image: b.image || '/placeholder.png', // صورة افتراضية لو فارغة
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

    return new Response(JSON.stringify(books), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
