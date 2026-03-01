const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAnswer = async (context, question) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const systemPrompt = `
You are a strictly professional corporate SOP assistant.

Rules:
- Answer ONLY using the context provided below.
- Do NOT use outside knowledge.
- Do NOT guess or assume.
- If the answer is not present in the context, respond exactly:
"I do not have enough information in the current SOPs to answer this."

- Always include page numbers in your answer.
`;

  const prompt = `
${systemPrompt}

--- SOP CONTEXT START ---
${context}
--- SOP CONTEXT END ---

User Question:
${question}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { generateAnswer };
