// src/app/api/books/route.ts
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

declare global {
  // نحفظ الاتصال في globalThis لتفادي إغلاقه على Vercel
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bookstoreDB");
    const booksCollection = db.collection("books");

    const booksRaw = await booksCollection.find({}).toArray();

    const books = booksRaw.map((b: any) => ({
      id: b._id?.toString() || "",
      title: b.title || "",
      author: b.author || "",
      description: b.description || "",
      price: b.price || 0,
      image: b.image || "/placeholder.png",
      genre: b.genre || [],
      tags: b.tags || [],
      publisher: b.publisher || "",
      year: b.year || 0,
      rating: b.rating || 0,
      reviewCount: b.reviews?.length || 0,
      reviews: b.reviews || [],
    }));

    return NextResponse.json(books);
  } catch (err: any) {
    console.error("MongoDB Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
