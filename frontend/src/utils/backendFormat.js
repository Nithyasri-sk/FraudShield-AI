/**
 * Converts values collected via native <input type="datetime-local"> and
 * <input type="date"> controls into the exact string formats the fraud
 * detection backend expects (e.g. "01-01-2023 05:58" and "08-03-1978").
 *
 * This conversion happens only at the API boundary (see services/fraudApi.ts)
 * — the form itself keeps using native input values so editing, validation,
 * and the "Load Sample Transaction" button stay simple.
 */
/** "YYYY-MM-DDTHH:mm" -> "DD-MM-YYYY HH:mm" */
export function toBackendDateTime(localValue) {
    const [datePart, timePart] = localValue.split("T");
    const [year, month, day] = datePart.split("-");
    return `${day}-${month}-${year} ${timePart}`;
}
/** "YYYY-MM-DD" -> "DD-MM-YYYY" */
export function toBackendDate(localValue) {
    const [year, month, day] = localValue.split("-");
    return `${day}-${month}-${year}`;
}
