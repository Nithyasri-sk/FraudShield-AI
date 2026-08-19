import { formatPercent } from "../../utils/format";
import { riskBand } from "../../utils/risk";
export function RiskGauge({ probability, size = 168 }) {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - probability);
    const band = riskBand(probability);
    return (<div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={band.track} strokeWidth={12}/>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={band.color} strokeWidth={12} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="animate-ring-draw" style={{ ["--ring-circumference"]: circumference }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-ink-100">{formatPercent(probability)}</span>
          <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">Fraud Probability</span>
        </div>
      </div>
      <span className="mt-3 rounded-full border px-3 py-1 text-xs font-semibold" style={{ color: band.color, borderColor: `${band.color}55`, backgroundColor: band.track }}>
        {band.label}
      </span>
    </div>);
}
