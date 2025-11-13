import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";

const uri = "mongodb+srv://yafanaji2002_db_user:k4CNlNKNcFOScum7@cluster0.oon902c.mongodb.net/bookstoreDB";
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
  try {
    await client.connect();
    const db = client.db("bookstoreDB");
    const collection = db.collection("books");
    const books = await collection.find({}).toArray();
    return new Response(JSON.stringify(books), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  } finally {
    await client.close();
  }
}
