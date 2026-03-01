const CHUNK_SIZE = 1000;
const OVERLAP = 200;

const chunkText = (text) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + CHUNK_SIZE;
    chunks.push(text.slice(start, end));
    start = end - OVERLAP;
  }

  return chunks;
};

const chunkPages = (pages) => {
  const result = [];

  pages.forEach(({ page, text }) => {
    const chunks = chunkText(text);
    chunks.forEach(chunk => {
      result.push({
        page,
        text: chunk
      });
    });
  });

  return result;
};

module.exports = { chunkPages };
