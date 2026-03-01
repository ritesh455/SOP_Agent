const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  if (!data.text || data.text.length < 500) {
    throw new Error("PDF text extraction failed or document is scanned");
  }

  const pages = data.text.split("\f");

  return pages.map((pageText, index) => ({
    page: index + 1,
    text: pageText.trim()
  }));
};

module.exports = { extractTextFromPDF };
