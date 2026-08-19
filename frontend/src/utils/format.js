export function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);
}
export function formatPercent(value, digits = 1) {
    return `${(value * 100).toFixed(digits)}%`;
}
/** For values already on a 0-100 scale (e.g. the backend's fraud_percentage). */
export function formatPercentFromScale100(value, digits = 2) {
    return `${value.toFixed(digits)}%`;
}
export function formatDateTime(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return iso;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(d);
}
export function formatDuration(seconds) {
    if (seconds < 60)
        return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return rem > 0 ? `${minutes}m ${rem}s` : `${minutes}m`;
}
