import { ShieldCheck, ShieldAlert, Info } from "lucide-react";
import { Card } from "../ui/Card";
import { RiskGauge } from "./RiskGauge";
import { formatPercent, formatPercentFromScale100 } from "../../utils/format";
export function ResultCard({ result }) {
    const { prediction, fraud_percentage, fraud_probability, result: resultLabel } = result.data;
    const isFraud = prediction === 1;
    return (<Card className={`animate-fade-up relative overflow-hidden border ${isFraud ? "border-red-500/30" : "border-teal-500/30"}`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${isFraud ? "bg-red-500" : "bg-teal-500"}`}/>
      <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${isFraud ? "bg-red-500/10 text-red-400" : "bg-teal-500/10 text-teal-400"}`}>
            {isFraud ? <ShieldAlert size={24}/> : <ShieldCheck size={24}/>}
          </div>
          <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight text-ink-100">
            {isFraud ? "Potential Fraud Detected" : "Transaction Appears Legitimate"}
          </h2>
          <p className="font-mono-data mt-2 max-w-md text-sm leading-relaxed text-ink-300">
            {resultLabel}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Prediction</p>
              <p className={`font-mono-data mt-0.5 text-sm font-semibold ${isFraud ? "text-red-300" : "text-teal-300"}`}>
                {isFraud ? "Fraud" : "Legitimate"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Fraud Percentage</p>
              <p className="font-mono-data mt-0.5 text-sm text-ink-200">
                {formatPercentFromScale100(fraud_percentage)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Fraud Probability</p>
              <p className="font-mono-data mt-0.5 text-sm text-ink-200">
                {formatPercent(fraud_probability, 2)}
              </p>
            </div>
          </div>

          {isFraud && (<div className="mt-5 flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3">
              <Info size={16} className="mt-0.5 shrink-0 text-amber-400"/>
              <div>
                <p className="text-xs font-semibold text-amber-300">Recommended Action</p>
                <p className="mt-0.5 text-xs leading-relaxed text-amber-200/90">
                  Review this transaction before approving.
                </p>
              </div>
            </div>)}
        </div>

        <div className="flex justify-center lg:justify-end">
          <RiskGauge probability={fraud_probability}/>
        </div>
      </div>
    </Card>);
}
