const { GoogleGenerativeAI, TaskType } = require("@google/generative-ai");
// console.log("🔑 GEMINI_API_KEY loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateEmbedding = async (text) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-embedding-001"
  });

  const result = await model.embedContent({
    content: { parts: [{ text }] },
    taskType: TaskType.RETRIEVAL_DOCUMENT
  });

  return result.embedding.values; // 3072 dimensions
};

module.exports = { generateEmbedding };
