// src/lib/api.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!; // من Environment Variable على Vercel

let cachedClient: MongoClient | null = null;

export async function fetchBooks({ limit = 50 } = {}) {
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }
    const db = cachedClient.db("bookstoreDB");
    const collection = db.collection("books");
    const books = await collection.find({}).limit(limit).toArray();
    return { books };
  } catch (err) {
    console.error("MongoDB fetchBooks error:", err);
    throw err;
  }
}
