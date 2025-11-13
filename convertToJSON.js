const fs = require("fs");
const books = require("./src/app/data/books.ts"); // Make sure the path is correct

const jsonData = JSON.stringify(books, null, 2);
fs.writeFileSync("books.json", jsonData);

console.log(" books.json file created successfully!");
