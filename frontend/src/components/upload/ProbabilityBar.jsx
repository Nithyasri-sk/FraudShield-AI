import { riskBand } from "../../utils/risk";
import { formatPercent } from "../../utils/format";
export function ProbabilityBar({ probability }) {
    if (probability === null) {
        return <span className="text-xs text-ink-500">N/A</span>;
    }
    const band = riskBand(probability);
    const widthPct = Math.max(2, Math.min(100, probability * 100));
    return (<div className="flex items-center gap-2.5">
      <span className="w-[74px] shrink-0 text-[11px] font-semibold" style={{ color: band.color }}>
        {band.label}
      </span>
      <div className="h-1.5 min-w-[56px] flex-1 overflow-hidden rounded-full bg-ink-700">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${widthPct}%`, backgroundColor: band.color }}/>
      </div>
      <span className="font-mono-data w-16 shrink-0 text-right text-xs text-ink-200">
        {formatPercent(probability, 2)}
      </span>
    </div>);
}
