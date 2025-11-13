// importToMongo.js
const { MongoClient } = require('mongodb');
const fs = require('fs');

// 1. Connection URI
const uri = "mongodb+srv://yafanaji2002_db_user:k4CNlNKNcFOScum7@cluster0.oon902c.mongodb.net/?appName=Cluster0";

// 2. Create a MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // 3. Connect to the client
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    // 4. Select database & collection
    const database = client.db('bookstoreDB'); 
    const collection = database.collection('books'); 

    // 5. Read JSON file
    const data = JSON.parse(fs.readFileSync('books.json', 'utf8'));

    // 6. Insert data 
    const result = await collection.insertMany(data.books);
    console.log(`${result.insertedCount} documents inserted successfully!`);

  } catch (err) {
    console.error(err);
  } finally {
    // 7. Close the connection
    await client.close();
  }
}

run();
