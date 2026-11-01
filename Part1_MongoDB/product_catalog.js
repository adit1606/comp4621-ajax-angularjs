// COMP 4621 Assignment 2 - Part 1
// Product catalog in MongoDB
// run with: mongosh product_catalog.js

// use the storeDB database
db = db.getSiblingDB("storeDB");
db.Product.drop();   // delete old data so I can run this again

// Step 1 - create the Product collection
// only type, title and pricing are required
// details can have anything in it since each product type is different
db.createCollection("Product", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "title", "pricing"],
      properties: {
        type:    { bsonType: "string", description: "required" },
        title:   { bsonType: "string", description: "required" },
        pricing: {
          bsonType: "object",
          required: ["list", "retail"],
          properties: {
            list:   { bsonType: ["int", "double"] },
            retail: { bsonType: ["int", "double"] }
          }
        },
        details: { bsonType: "object", description: "different for each type" }
      }
    }
  }
});

printjson(db.getCollectionNames());   // show collections

// Step 2 - add 4 products of different types
// they all have the same main fields but different details

// audio album (given in the assignment)
db.Product.insertOne({
  type: "Audio Album",
  title: "A Love Supreme",
  description: "by John Coltrane",
  shipping: { weight: 6, dimensions: { width: 10, height: 10, depth: 1 } },
  pricing: { list: 1200, retail: 1100, savings: 100, pct_savings: 8 },
  details: {
    title: "A Love Supreme [Original Recording Reissued]",
    artist: "John Coltrane",
    genre: ["Jazz", "General"],
    tracks: [
      "A Love Supreme Part I: Acknowledgement",
      "A Love Supreme Part II - Resolution",
      "A Love Supreme, Part III: Pursuance",
      "A Love Supreme, Part IV-Psalm"
    ]
  }
});

// film (given in the assignment)
db.Product.insertOne({
  type: "Film",
  title: "The Matrix",
  description: "Science-fiction action film",
  shipping: { weight: 3, dimensions: { width: 7, height: 10, depth: 1 } },
  pricing: { list: 2000, retail: 1500, savings: 500, pct_savings: 25 },
  details: {
    title: "The Matrix [Blu-ray]",
    director: ["Andy Wachowski", "Larry Wachowski"],
    writer: ["Andy Wachowski", "Larry Wachowski"],
    actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    release_year: 1999,
    runtime_minutes: 136,
    rating: "R",
    aspect_ratio: "1.66:1"
  }
});

// book and headphones - added both at once with insertMany
db.Product.insertMany([
  {
    type: "Book",
    title: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship",
    shipping: { weight: 24, dimensions: { width: 7, height: 9, depth: 1.2 } },
    pricing: { list: 4999, retail: 3999, savings: 1000, pct_savings: 20 },
    details: {
      author: ["Robert C. Martin"],
      publisher: "Prentice Hall",
      isbn13: "978-0132350884",
      pages: 464,
      format: "Paperback",
      language: "English"
    }
  },
  {
    type: "Electronics",
    title: "Wireless Noise-Cancelling Headphones",
    description: "Over-ear Bluetooth headphones",
    shipping: { weight: 40, dimensions: { width: 8, height: 10, depth: 4 } },
    pricing: { list: 29999, retail: 24999, savings: 5000, pct_savings: 17 },
    details: {
      brand: "SoundMax",
      model: "SM-700",
      connectivity: ["Bluetooth 5.3", "3.5mm aux"],
      battery_life_hours: 30,
      colors: ["Black", "Silver"],
      warranty_years: 2
    }
  }
]);

// Step 3 - check the data

// should be 4
print("Total products: " + db.Product.countDocuments());

// show everything
printjson(db.Product.find().toArray());

// just type, title and price
printjson(db.Product.find({}, { _id: 0, type: 1, title: 1, "pricing.retail": 1 }).toArray());

// only films
printjson(db.Product.find({ type: "Film" }, { _id: 0, title: 1, details: 1 }).toArray());

// only the album has genre
printjson(db.Product.find({ "details.genre": "Jazz" }, { _id: 0, title: 1, "details.artist": 1 }).toArray());

// list the detail fields for each product
printjson(db.Product.aggregate([
  { $project: { _id: 0, type: 1, detail_fields: { $map: { input: { $objectToArray: "$details" }, as: "f", in: "$$f.k" } } } }
]).toArray());

// 20% savings or more, highest first
printjson(db.Product.find({ "pricing.pct_savings": { $gte: 20 } }, { _id: 0, type: 1, title: 1, "pricing.pct_savings": 1 })
  .sort({ "pricing.pct_savings": -1 }).toArray());

// this should fail because pricing is missing
try {
  db.Product.insertOne({ type: "Toy", title: "Invalid product without pricing" });
} catch (e) {
  print("Insert failed: " + e.message);
}
