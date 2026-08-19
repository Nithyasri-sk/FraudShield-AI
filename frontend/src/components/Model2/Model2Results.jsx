import { useMemo, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { Card } from "../ui/Card";
import { Select } from "../ui/Select";
import { ProbabilityBar } from "../upload/ProbabilityBar";
import { EmptyState } from "../ui/EmptyState";

const PAGE_SIZE = 8;
const RESULT_OPTIONS = [
  { value: "all", label: "All Results" },
  { value: "fraud", label: "Fraud Only" },
  { value: "not_fraud", label: "Not Fraud Only" },
];

export function Model2Results({ response, fileName }) {
  const [query, setQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("all");
  const [page, setPage] = useState(1);

  const accounts = Array.isArray(response.accounts) ? response.accounts : [];

  const filtered = useMemo(() => {
    let list = accounts;
    if (query.trim()) {
      const q = query.trim();
      list = list.filter((a) => String(a.row_id).includes(q));
    }
    if (resultFilter === "fraud") {
      list = list.filter((a) => a.prediction === "Fraud");
    }
    if (resultFilter === "not_fraud") {
      list = list.filter((a) => a.prediction === "Not Fraud");
    }
    return list;
  }, [accounts, query, resultFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statCards = [
    { label: "Total Rows", value: response.total_accounts?.toLocaleString() ?? "N/A" },
    { label: "Predicted Fraud", value: response.predicted_fraud?.toLocaleString() ?? "N/A" },
    { label: "Predicted Not Fraud", value: response.predicted_not_fraud?.toLocaleString() ?? "N/A" },
    { label: "Threshold Used", value: typeof response.threshold_used === "number" ? response.threshold_used.toFixed(3) : "N/A" },
  ];

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-ink-100">
            Model 2 Analysis Complete
          </h2>
          <p className="text-xs text-ink-400">
            Results for {fileName} · Threshold mode: {response.threshold_mode ?? "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{s.label}</p>
            <p className="font-display mt-1 text-2xl font-semibold text-ink-100">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by row ID…"
            className="h-10 w-full rounded-lg border border-ink-600 bg-ink-900/60 pl-9 pr-3.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-accent-400 focus:bg-ink-900 focus:outline-none"
          />
        </div>
        <div className="w-full sm:w-52">
          <Select
            value={resultFilter}
            onChange={(e) => { setResultFilter(e.target.value); setPage(1); }}
            options={RESULT_OPTIONS}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No matching rows" description="Try adjusting your search or filter." />
      ) : (
        <div className="card-surface overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-700 text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-4 py-3 font-medium">Row ID</th>
                  <th className="px-4 py-3 font-medium">Fraud Probability</th>
                  <th className="px-4 py-3 font-medium">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((row) => (
                  <tr key={row.row_id} className="border-b border-ink-750 transition-colors last:border-none hover:bg-ink-800/50">
                    <td className="font-mono-data px-4 py-3.5 text-ink-100">{row.row_id}</td>
                    <td className="px-4 py-3.5">
                      <ProbabilityBar probability={typeof row.fraud_probability === "number" ? row.fraud_probability : null} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={row.prediction === "Fraud" ? "font-semibold text-red-400" : "text-ink-300"}>
                        {row.prediction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-ink-700 px-4 py-3">
            <p className="text-xs text-ink-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg px-2.5 py-1 text-xs text-ink-300 hover:bg-ink-700 disabled:opacity-40">Prev</button>
              <span className="font-mono-data px-1.5 text-xs text-ink-300">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg px-2.5 py-1 text-xs text-ink-300 hover:bg-ink-700 disabled:opacity-40">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}