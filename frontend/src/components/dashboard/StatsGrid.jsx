import { ListChecks, ShieldAlert, ShieldCheck, Gauge } from "lucide-react";
import { Card } from "../ui/Card";
import { formatPercent } from "../../utils/format";
export function StatsGrid({ stats, loading }) {
    const items = [
        {
            label: "Transactions Analyzed",
            value: stats ? stats.transactionsAnalyzed.toLocaleString() : "—",
            icon: ListChecks,
            tone: "text-accent-400 bg-accent-500/10",
        },
        {
            label: "Fraud Detected",
            value: stats ? stats.fraudDetected.toLocaleString() : "—",
            icon: ShieldAlert,
            tone: "text-red-400 bg-red-500/10",
        },
        {
            label: "Legitimate Transactions",
            value: stats ? stats.legitimateTransactions.toLocaleString() : "—",
            icon: ShieldCheck,
            tone: "text-teal-400 bg-teal-500/10",
        },
        {
            label: "Avg. Fraud Probability",
            value: stats ? formatPercent(stats.averageFraudProbability) : "—",
            icon: Gauge,
            tone: "text-amber-400 bg-amber-500/10",
        },
    ];
    return (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (<Card key={item.label} className="p-5" hoverable>
          <div className="flex items-center justify-between">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.tone}`}>
              <item.icon size={18}/>
            </div>
          </div>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink-400">{item.label}</p>
          {loading ? (<div className="mt-2 h-7 w-20 animate-shimmer rounded-md"/>) : (<p className="font-display mt-1 text-2xl font-semibold text-ink-100">{item.value}</p>)}
        </Card>))}
    </div>);
}
