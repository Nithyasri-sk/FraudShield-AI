import { summarizeDatasetAnalysis } from "../types/upload";
const HEADERS = [
    "Account ID",
    "Email",
    "Account Balance",
    "Transaction ID",
    "Transaction Date",
    "Fraud Probability",
];
/** Builds and triggers a browser download of a fresh results CSV — never modifies the originally uploaded file. */
export function downloadFraudResultsCsv(response, sourceFileName) {
    const { rows } = summarizeDatasetAnalysis(response);
    const csvRows = [
        HEADERS,
        ...rows.map((r) => [
            r.accountId,
            r.email,
            r.accountBalance !== null ? r.accountBalance.toFixed(2) : "N/A",
            r.transactionId,
            r.transactionDate,
            r.fraudProbability !== null ? `${(r.fraudProbability * 100).toFixed(2)}%` : "N/A",
        ]),
    ];
    const csv = csvRows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const baseName = sourceFileName.replace(/\.csv$/i, "") || "dataset";
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}-fraud-results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function escapeCsvCell(value) {
    if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
