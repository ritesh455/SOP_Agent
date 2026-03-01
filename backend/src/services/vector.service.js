const SOPChunk = require("../models/sopChunk.model");

const searchSimilarChunks = async (queryEmbedding, limit = 5) => {
  const results = await SOPChunk.aggregate([
    {
      $vectorSearch: {
        index: "sop_vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit
      }
    },
    {
      $project: {
        text: 1,
        page: 1,
        documentId: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]);

  return results;
};

module.exports = { searchSimilarChunks };
