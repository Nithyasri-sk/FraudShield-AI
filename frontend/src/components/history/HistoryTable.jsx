import { useMemo, useState } from "react";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Select } from "../ui/Select";
import { formatCurrency, formatDateTime, formatPercent } from "../../utils/format";
import { EmptyState } from "../ui/EmptyState";
const PAGE_SIZE = 6;
export function HistoryTable({ items }) {
    const [query, setQuery] = useState("");
    const [predictionFilter, setPredictionFilter] = useState("");
    const [sortKey, setSortKey] = useState("analyzedAt");
    const [sortDir, setSortDir] = useState("desc");
    const [page, setPage] = useState(1);
    const filtered = useMemo(() => {
        let rows = items;
        if (query.trim()) {
            const q = query.toLowerCase();
            rows = rows.filter((r) => r.transactionId.toLowerCase().includes(q) || r.accountId.toLowerCase().includes(q));
        }
        if (predictionFilter) {
            rows = rows.filter((r) => (predictionFilter === "fraud" ? r.prediction === 1 : r.prediction === 0));
        }
        return [...rows].sort((a, b) => {
            let diff = 0;
            if (sortKey === "analyzedAt")
                diff = new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime();
            if (sortKey === "transactionAmount")
                diff = a.transactionAmount - b.transactionAmount;
            if (sortKey === "fraudProbability")
                diff = a.fraudProbability - b.fraudProbability;
            return sortDir === "asc" ? diff : -diff;
        });
    }, [items, query, predictionFilter, sortKey, sortDir]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    function toggleSort(key) {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        }
        else {
            setSortKey(key);
            setSortDir("desc");
        }
        setPage(1);
    }
    if (items.length === 0) {
        return (<EmptyState title="No transactions analyzed yet." description="Analyzed transactions will show up here with their fraud predictions."/>);
    }
    return (<div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"/>
          <input value={query} onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
        }} placeholder="Search by transaction ID or account ID…" className="h-10 w-full rounded-lg border border-ink-600 bg-ink-900/60 pl-9 pr-3.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-accent-400 focus:bg-ink-900 focus:outline-none"/>
        </div>
        <div className="w-full sm:w-48">
          <Select value={predictionFilter} onChange={(e) => {
            setPredictionFilter(e.target.value);
            setPage(1);
        }} placeholder="All predictions" options={[
            { value: "fraud", label: "Fraud" },
            { value: "legitimate", label: "Legitimate" },
        ]}/>
        </div>
      </div>

      {filtered.length === 0 ? (<EmptyState title="No matching transactions" description="Try adjusting your search or filter."/>) : (<div className="card-surface overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-700 text-xs uppercase tracking-wide text-ink-400">
                  <Th onClick={() => toggleSort("analyzedAt")} active={sortKey === "analyzedAt"} dir={sortDir}>
                    Date
                  </Th>
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Account ID</th>
                  <Th onClick={() => toggleSort("transactionAmount")} active={sortKey === "transactionAmount"} dir={sortDir}>
                    Amount
                  </Th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Channel</th>
                  <th className="px-4 py-3 font-medium">Prediction</th>
                  <Th onClick={() => toggleSort("fraudProbability")} active={sortKey === "fraudProbability"} dir={sortDir}>
                    Fraud Probability
                  </Th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item) => (<tr key={item.id} className="border-b border-ink-750 transition-colors last:border-none hover:bg-ink-800/50">
                    <td className="px-4 py-3.5 text-ink-300">{formatDateTime(item.analyzedAt)}</td>
                    <td className="font-mono-data px-4 py-3.5 text-ink-100">{item.transactionId}</td>
                    <td className="font-mono-data px-4 py-3.5 text-ink-100">{item.accountId}</td>
                    <td className="font-mono-data px-4 py-3.5 text-ink-100">{formatCurrency(item.transactionAmount)}</td>
                    <td className="px-4 py-3.5 text-ink-300">{item.transactionType}</td>
                    <td className="px-4 py-3.5 text-ink-300">{item.channel}</td>
                    <td className="px-4 py-3.5">
                      <Badge tone={item.prediction === 1 ? "red" : "teal"}>
                        {item.prediction === 1 ? "Fraud" : "Legitimate"}
                      </Badge>
                    </td>
                    <td className="font-mono-data px-4 py-3.5 text-ink-100">{formatPercent(item.fraudProbability, 2)}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-ink-700 px-4 py-3">
            <p className="text-xs text-ink-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-ink-700 disabled:opacity-40 disabled:hover:bg-transparent" aria-label="Previous page">
                <ChevronLeft size={16}/>
              </button>
              <span className="font-mono-data px-1.5 text-xs text-ink-300">
                {page} / {totalPages}
              </span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-300 transition-colors hover:bg-ink-700 disabled:opacity-40 disabled:hover:bg-transparent" aria-label="Next page">
                <ChevronRight size={16}/>
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
function Th({ children, onClick, active, dir, }) {
    return (<th className="px-4 py-3 font-medium">
      <button onClick={onClick} className={`flex items-center gap-1 transition-colors hover:text-ink-100 ${active ? "text-ink-100" : ""}`}>
        {children}
        <ArrowUpDown size={11} className={active ? (dir === "asc" ? "rotate-180" : "") : "opacity-40"}/>
      </button>
    </th>);
}
