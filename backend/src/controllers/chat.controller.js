const { generateEmbedding } = require("../services/embedding.service");
const { searchSimilarChunks } = require("../services/vector.service");
const { generateAnswer } = require("../services/llm.service");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const ChatHistory = require("../models/chatHistory.model");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // 1. Generate embedding for user question
    const queryEmbedding = await generateEmbedding(question);

    // 2. Vector search (top 5 chunks)
    const chunks = await searchSimilarChunks(queryEmbedding, 5);
    console.log("🔎 Retrieved SOP chunks:", chunks.length);
    if (!chunks || chunks.length === 0) {
      return res.json({
        answer: "I do not have enough information in the current SOPs to answer this.",
        sources: []
      });
    }

    // 3. Build context with page numbers
    const context = chunks.map((c, i) => {
      return `Source ${i + 1} (Page ${c.page}):\n${c.text}`;
    }).join("\n\n");

    // 4. Generate final answer
    const answer = await generateAnswer(context, question);

    // Save chat history (ONLY for non-streaming)
    await ChatHistory.create({
  employeeId: req.user.employeeId,
  question,
  answer
});




    // 5. Collect sources
    const sources = chunks.map(c => ({
      page: c.page,
      score: c.score
    }));

    res.json({
      answer,
      sources
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
};


const streamQuestion = async (req, res) => {
  let fullAnswer = "";

  try {
    const question = req.query.question;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders?.();

    // 1. Generate embedding
    const queryEmbedding = await generateEmbedding(question);

    // 2. Vector search
    const chunks = await searchSimilarChunks(queryEmbedding, 5);
    console.log("🔎 Retrieved SOP chunks:", chunks.length);
    if (!chunks || chunks.length === 0) {
      res.write(`data: I do not have enough information in the current SOPs to answer this.\n\n`);
      return res.end();
    }

    // 3. Build context
    const context = chunks.map((c, i) =>
      `Source ${i + 1} (Page ${c.page}):\n${c.text}`
    ).join("\n\n");

    // 4. Gemini streaming
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
You are a strictly professional corporate SOP assistant.
Answer ONLY using the context below.
If the answer is not present, say:
"I do not have enough information in the current SOPs to answer this."

--- CONTEXT ---
${context}
--- END CONTEXT ---

Question:
${question}
`;

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
  const text = chunk.text();
  if (text) {
    fullAnswer += text;
    const words = text.split(" ");
    for (const word of words) {
      res.write(`data: ${word} \n\n`);
      await new Promise(r => setTimeout(r, 50)); // tiny delay
    }
  }
}


    res.write("event: end\ndata: END\n\n");
    if (
  fullAnswer &&
  fullAnswer.trim().length > 0 &&
  !fullAnswer.includes("rate-limited")
) {
  await ChatHistory.create({
    employeeId: req.user.employeeId,
    question,
    answer: fullAnswer
  });
}

    res.end();

  } catch (error) {
  console.error("Streaming error:", error.message);

  if (error.message.includes("429")) {
    // ✅ QUOTA ERROR
    res.write(
      `data: ⚠️ AI service is temporarily rate-limited. Please wait a moment and try again.\n\n`
    );
  } else if (!fullAnswer || fullAnswer.trim().length === 0) {
    // ✅ REAL SOP MISS
    res.write(
      `data: I do not have enough information in the current SOPs to answer this.\n\n`
    );
  }

  res.write("event: end\ndata: END\n\n");
  res.end();
}

};


module.exports = { askQuestion, streamQuestion };
