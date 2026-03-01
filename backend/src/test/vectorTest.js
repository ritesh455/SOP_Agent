require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const connectDB = require("../config/db");
const { generateEmbedding } = require("../services/embedding.service");
const { searchSimilarChunks } = require("../services/vector.service");

const testSearch = async () => {
  try {
    await connectDB();

    const queryEmbedding = await generateEmbedding(
      "student internship evaluation form?"
    );

    const results = await searchSimilarChunks(queryEmbedding);

    console.log("🔍 Search Results:");
    results.forEach((r, i) => {
      console.log(`\nResult ${i + 1}`);
      console.log("Page:", r.page);
      console.log("Score:", r.score);
      console.log("Text:", r.text.slice(0, 200), "...");
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testSearch();
