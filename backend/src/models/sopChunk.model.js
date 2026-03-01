const mongoose = require("mongoose");

const sopChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  embedding: {
    type: [Number],
    required: false // will be added in Phase 3
  },
  version: {
    type: Number,
    default: 1
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("SOPChunk", sopChunkSchema);
