export class CsvReadError extends Error {
}
/**
 * Reads a CSV file locally just enough to show the analyst a sanity-check
 * preview (row/column counts). This is NOT schema validation — the exact
 * required columns will be confirmed with the ML/backend team later, so
 * this intentionally stays generic.
 */
export async function readCsvPreview(file) {
    if (file.size === 0) {
        throw new CsvReadError("This file is empty.");
    }
    const text = await file.text().catch(() => {
        throw new CsvReadError("The file could not be read.");
    });
    const lines = text
        .split(/\r\n|\n|\r/)
        .filter((line) => line.trim().length > 0);
    if (lines.length === 0) {
        throw new CsvReadError("This file doesn't contain any readable rows.");
    }
    const header = lines[0].split(",");
    return {
        rowCount: Math.max(0, lines.length - 1),
        columnCount: header.length,
        headerPreview: header.slice(0, 6).map((h) => h.trim()),
    };
}
export function isCsvFile(file) {
    return file.name.toLowerCase().endsWith(".csv");
}
export function formatFileSize(bytes) {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
