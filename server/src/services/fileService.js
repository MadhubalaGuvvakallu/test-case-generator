const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Extract plain text from an uploaded file.
 * Supports text-based files and PDFs.
 */
const extractTextFromFile = async (filePath, mimetype) => {
  const TEXT_MIMETYPES = [
    'text/plain',
    'text/csv',
    'text/markdown',
    'application/json',
    'text/html',
    'application/xml',
    'text/xml',
  ];

  if (TEXT_MIMETYPES.includes(mimetype)) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (mimetype === 'application/pdf') {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || '[PDF contained no extractable text]';
  }

  // For other binary types (docx, etc.) return a placeholder
  return `[Binary file uploaded: ${path.basename(filePath)}. Content extraction not available for this file type.]`;
};

/**
 * Delete a file from disk. Silently ignores missing files.
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Failed to delete file ${filePath}:`, err.message);
  }
};

/**
 * Build combined requirements text from context files and description.
 */
const buildRequirementsText = async (contextFiles, contextDescription, uploadDir) => {
  const parts = [];

  if (contextDescription && contextDescription.trim()) {
    parts.push(`Context Description:\n${contextDescription.trim()}`);
  }

  for (const file of contextFiles) {
    const fullPath = path.join(uploadDir, file.filename);
    if (fs.existsSync(fullPath)) {
      const text = await extractTextFromFile(fullPath, file.mimetype || 'text/plain');
      parts.push(`File: ${file.originalName}\n${text}`);
    }
  }

  return parts.join('\n\n---\n\n');
};

module.exports = { extractTextFromFile, deleteFile, buildRequirementsText };
