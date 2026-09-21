/**
 * Serialize test cases to a flat CSV string.
 */
const testCasesToCSV = (testCases) => {
  const rows = testCases.map((tc) => ({
    id: tc._id.toString(),
    title: tc.title,
    description: tc.description,
    type: tc.type,
    format: tc.format,
    priority: tc.priority,
    status: tc.status,
    tags: (tc.tags || []).join(', '),
    preconditions: (tc.preconditions || []).join(' | '),
    steps: (tc.steps || [])
      .map((s) => `${s.stepNumber}. ${s.action} => ${s.expectedResult}`)
      .join(' | '),
  }));

  // Manual CSV — avoids the csv-stringify peer dep issue if not installed
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
};

/**
 * Serialize test cases to a JSON string.
 */
const testCasesToJSON = (testCases) => {
  return JSON.stringify(testCases, null, 2);
};

/**
 * Write JSON export to the response stream.
 */
const sendJSONExport = (res, testCases, projectName) => {
  const filename = `${projectName.replace(/\s+/g, '_')}_testcases.json`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(testCasesToJSON(testCases));
};

/**
 * Write CSV export to the response stream.
 */
const sendCSVExport = (res, testCases, projectName) => {
  const filename = `${projectName.replace(/\s+/g, '_')}_testcases.csv`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'text/csv');
  res.send(testCasesToCSV(testCases));
};

module.exports = { testCasesToCSV, testCasesToJSON, sendJSONExport, sendCSVExport };
