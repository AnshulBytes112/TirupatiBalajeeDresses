/**
 * RFC-4180 compliant CSV Parser and helper utilities.
 * Handles quoted fields, inner commas, escaped quotes, and newlines.
 */

export interface ParsedCsvRow {
  [key: string]: string;
}

/**
 * Parses raw CSV string into an array of key-value objects.
 */
export function parseCsv(csvText: string): ParsedCsvRow[] {
  if (!csvText || !csvText.trim()) return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  // Normalize newlines
  const text = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\n") {
        currentRow.push(currentField.trim());
        currentField = "";
        // Only push non-empty rows
        if (currentRow.some((field) => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentField += char;
      }
    }
  }

  // Final field and row if any
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  // Headers normalized to lowercase alphanumeric key
  const rawHeaders = rows[0];
  const headers = rawHeaders.map((h) =>
    h
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim()
  );

  const parsedData: ParsedCsvRow[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const item: ParsedCsvRow = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c];
      if (key) {
        item[key] = row[c] ?? "";
      }
    }
    parsedData.push(item);
  }

  return parsedData;
}

/**
 * Generates and triggers browser download of a CSV string.
 */
export function downloadCsvFile(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
