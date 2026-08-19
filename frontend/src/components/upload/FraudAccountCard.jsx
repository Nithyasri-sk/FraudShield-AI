import { useNavigate } from "react-router-dom";
import { ShieldAlert, Mail, BarChart2 } from "lucide-react";
import { ProbabilityBar } from "./ProbabilityBar";
import { formatCurrency } from "../../utils/format";

export function FraudAccountCard({ account }) {
  const transactions = Array.isArray(account.fraud_transactions) ? account.fraud_transactions : [];
  const navigate = useNavigate();

  const topTxn = transactions.reduce((worst, t) => {
    if (typeof t.fraud_probability !== "number") return worst;
    if (!worst || t.fraud_probability > worst.fraud_probability) return t;
    return worst;
  }, null);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-ink-800">
      <div className="flex items-center justify-between bg-ink-900 px-5 pt-5 pb-8">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-red-400" />
          <span className="font-mono-data text-sm font-bold uppercase tracking-wide text-ink-100">
            {account.account_id ?? "N/A"}
          </span>
        </div>
        <span className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] font-semibold text-ink-300">
          {transactions.length} TXN{transactions.length === 1 ? "" : "S"}
        </span>
      </div>

      <div className="-mt-4 flex flex-col gap-2 bg-ink-800 px-5 py-4">
        <div className="flex items-center gap-1.5 text-xs text-ink-400">
          <Mail size={12} />
          <span className="truncate">{account.email ?? "N/A"}</span>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500">Balance</p>
          <p className="font-mono-data text-sm text-ink-100">
            {typeof account.account_balance === "number" ? formatCurrency(account.account_balance) : "N/A"}
          </p>
        </div>
        {topTxn && (
          <div className="pt-1">
            <ProbabilityBar probability={topTxn.fraud_probability} />
          </div>
        )}
      </div>

      <div className="bg-orange-500 px-5 py-3 text-center">
        <p className="text-lg font-bold text-white">
          {topTxn ? `${(topTxn.fraud_probability * 100).toFixed(2)}%` : "N/A"}
        </p>
      </div>

      <p className="mt-2 text-center text-sm text-ink-200">
        {topTxn ? "Highest flagged risk" : "No transaction detail"}
      </p>

      {transactions.length > 0 && (
        <button
          onClick={() => navigate("/insights", { state: { account, transactions } })}
          className="mx-5 mb-4 mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-ink-700 py-2 text-xs font-semibold text-ink-200 transition-colors hover:bg-ink-700"
        >
          <BarChart2 size={14} />
          Insights
        </button>
      )}
    </div>
  );
}