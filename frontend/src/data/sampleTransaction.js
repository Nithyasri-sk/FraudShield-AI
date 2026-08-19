/**
 * Clearly-labelled demo data used only by the "Load Sample Transaction"
 * button so the workflow can be demonstrated end-to-end. Never sent
 * automatically — the analyst must still press Analyze.
 */
export function getSampleTransaction() {
    const now = new Date();
    const previous = new Date(now.getTime() - 1000 * 60 * 60 * 26); // ~26h earlier
    const dob = new Date(1990, 4, 14); // May 14, 1990
    return {
        TransactionID: "TX000001",
        AccountID: "AC060",
        TransactionDate: toLocalDatetimeInputValue(now),
        PreviousTransactionDate: toLocalDatetimeInputValue(previous),
        LoginAttempts: 1,
        UserName: "jane.doe123",
        Email: "jane.doe@example.com",
        DateOfBirth: toLocalDateInputValue(dob),
        DeviceID: "D000266",
        TransactionAmount: 2500,
        TransactionType: "DEBIT",
        Location: "77002",
        Channel: "ONLINE",
        CustomerAge: 34,
        CustomerOccupation: "Engineer",
        AccountBalance: 15000,
        AnnualIncome: 68000,
        CurrentAddressMonthCount: 24,
        PreviousAddressMonthCount: 10,
    };
}
export function toLocalDatetimeInputValue(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export function toLocalDateInputValue(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
