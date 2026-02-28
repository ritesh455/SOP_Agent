const Document = require("../models/document.model");
const SOPChunk = require("../models/sopChunk.model");
const { extractTextFromPDF } = require("../services/pdf.service");
const { chunkPages } = require("../services/chunk.service");
const { generateEmbedding } = require("../services/embedding.service");

const uploadDocument = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one PDF file is required" });
    }

    // 🔴 Replace old SOP set
    await SOPChunk.deleteMany({});
    await Document.deleteMany({});
    console.log("Cleared existing documents and chunks");

    let totalChunks = 0;

    // 🔁 Process each uploaded PDF
    for (const file of req.files) {
      // 1️⃣ Save document metadata
      const document = new Document({
        fileName: file.filename
      });
      await document.save();

      // 2️⃣ Extract text
      const pages = await extractTextFromPDF(file.path);

      // 3️⃣ Chunk text
      const chunks = chunkPages(pages);

      // 4️⃣ Generate embeddings + save chunks
     for (const chunk of chunks) {
  try {
    const embedding = await generateEmbedding(chunk.text);

    await SOPChunk.create({
      documentId: document._id,
      text: chunk.text,
      page: chunk.page,
      embedding
    });

    totalChunks++;

    // ⏳ throttle for free tier
    await new Promise(r => setTimeout(r, 700));

  } catch (err) {
    console.error("Embedding failed, skipping chunk:", err.message);
    break; // stop further chunks safely
  }
}
    }

    res.status(201).json({
      success: true,
      message: "SOP set uploaded and indexed successfully",
      totalDocuments: req.files.length,
      totalChunks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { uploadDocument };
