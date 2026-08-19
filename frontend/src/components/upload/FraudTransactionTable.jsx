import { useMemo, useState } from "react";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "../ui/Select";
import { ProbabilityBar } from "./ProbabilityBar";
import { formatCurrency } from "../../utils/format";
import { riskBand } from "../../utils/risk";
import { EmptyState } from "../ui/EmptyState";
const PAGE_SIZE = 8;
const RISK_OPTIONS = [
    { value: "all", label: "All Risk Levels" },
    { value: "high", label: "High Risk" },
    { value: "moderate", label: "Medium Risk" },
    { value: "low", label: "Low Risk" },
];
export function FraudTransactionTable({ rows }) {
    const [query, setQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState("all");
    const [sortKey, setSortKey] = useState("fraudProbability");
    const [sortDir, setSortDir] = useState("desc");
    const [page, setPage] = useState(1);
    const filtered = useMemo(() => {
        let list = rows;
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter((r) => r.accountId.toLowerCase().includes(q) ||
                r.transactionId.toLowerCase().includes(q) ||
                r.email.toLowerCase().includes(q));
        }
        if (riskFilter !== "all") {
            list = list.filter((r) => r.fraudProbability !== null && riskBand(r.fraudProbability).tier === riskFilter);
        }
        return [...list].sort((a, b) => {
            let diff = 0;
            if (sortKey === "transactionDate")
                diff = (a.transactionDate ?? "").localeCompare(b.transactionDate ?? "");
            if (sortKey === "fraudProbability")
                diff = (a.fraudProbability ?? -1) - (b.fraudProbability ?? -1);
            if (sortKey === "accountBalance")
                diff = (a.accountBalance ?? -1) - (b.accountBalance ?? -1);
            return sortDir === "asc" ? diff : -diff;
        });
    }, [rows, query, riskFilter, sortKey, sortDir]);
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
    if (rows.length === 0) {
        return <EmptyState title="No fraudulent transactions to show" description="This dataset didn't return any flagged transactions."/>;
    }
    return (<div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"/>
          <input value={query} onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
        }} placeholder="Search by account ID, transaction ID, or email…" className="h-10 w-full rounded-lg border border-ink-600 bg-ink-900/60 pl-9 pr-3.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-accent-400 focus:bg-ink-900 focus:outline-none"/>
        </div>
        <div className="w-full sm:w-52">
          <Select value={riskFilter} onChange={(e) => {
            setRiskFilter(e.target.value);
            setPage(1);
        }} options={RISK_OPTIONS}/>
        </div>
      </div>
      <p className="-mt-2 text-[11px] text-ink-500">
        Risk levels are derived from fraud probability for readability — they aren't a separate category returned by the model.
      </p>

      {filtered.length === 0 ? (<EmptyState title="No matching transactions" description="Try adjusting your search or risk filter."/>) : (<div className="card-surface overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-700 text-xs uppercase tracking-wide text-ink-400">
                  <th className="px-4 py-3 font-medium">Account ID</th>
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <Th onClick={() => toggleSort("transactionDate")} active={sortKey === "transactionDate"} dir={sortDir}>
                    Transaction Date
                  </Th>
                  <Th onClick={() => toggleSort("accountBalance")} active={sortKey === "accountBalance"} dir={sortDir}>
                    Account Balance
                  </Th>
                  <Th onClick={() => toggleSort("fraudProbability")} active={sortKey === "fraudProbability"} dir={sortDir}>
                    Fraud Probability
                  </Th>
                  <th className="px-4 py-3 font-medium">Risk Status</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((row, i) => (<tr key={`${row.accountId}-${row.transactionId}-${i}`} className="border-b border-ink-750 transition-colors last:border-none hover:bg-ink-800/50">
                    <td className="font-mono-data px-4 py-3.5 text-ink-100">{row.accountId}</td>
                    <td className="font-mono-data px-4 py-3.5 text-ink-100">{row.transactionId}</td>
                    <td className="px-4 py-3.5 text-ink-300">{row.transactionDate}</td>
                    <td className="font-mono-data px-4 py-3.5 text-ink-100">
                      {row.accountBalance !== null ? formatCurrency(row.accountBalance) : "N/A"}
                    </td>
                    <td colSpan={2} className="px-4 py-3.5">
                      <ProbabilityBar probability={row.fraudProbability}/>
                    </td>
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
