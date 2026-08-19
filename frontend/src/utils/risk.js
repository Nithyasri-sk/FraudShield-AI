export function riskBand(p) {
    if (p < 0.3)
        return { tier: "low", label: "Low Risk", color: "var(--color-teal-400)", track: "rgba(61, 217, 199, 0.15)" };
    if (p < 0.7)
        return { tier: "moderate", label: "Moderate Risk", color: "var(--color-amber-400)", track: "rgba(245, 181, 77, 0.15)" };
    return { tier: "high", label: "High Risk", color: "var(--color-red-400)", track: "rgba(233, 124, 112, 0.15)" };
}
