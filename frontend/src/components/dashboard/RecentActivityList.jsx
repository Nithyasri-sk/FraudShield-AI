import { Link } from "react-router-dom";
import { ScanLine, FileSpreadsheet } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { formatCurrency, formatDateTime } from "../../utils/format";
export function RecentActivityList({ manualRecords, uploadRecords, }) {
    const items = [
        ...manualRecords.map((record) => ({ kind: "manual", record })),
        ...uploadRecords.map((record) => ({ kind: "upload", record })),
    ]
        .sort((a, b) => new Date(b.record.analyzedAt).getTime() - new Date(a.record.analyzedAt).getTime())
        .slice(0, 6);
    if (items.length === 0) {
        return (<EmptyState title="No transactions analyzed yet." description="Analyze a transaction or upload a dataset to see activity here." action={<Link to="/analyze">
            <Button icon={<ScanLine size={16}/>}>Analyze your first transaction</Button>
          </Link>}/>);
    }
    return (<div className="card-surface divide-y divide-ink-750 overflow-hidden rounded-2xl">
      {items.map((item) => item.kind === "manual" ? (<div key={item.record.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400">
                <ScanLine size={16}/>
              </div>
              <div className="min-w-0">
                <p className="font-mono-data truncate text-sm text-ink-100">
                  {item.record.transactionId} · {formatCurrency(item.record.transactionAmount)}
                </p>
                <p className="mt-0.5 text-xs text-ink-400">{formatDateTime(item.record.analyzedAt)}</p>
              </div>
            </div>
            <Badge tone={item.record.prediction === 1 ? "red" : "teal"}>
              {item.record.prediction === 1 ? "Fraud" : "Legitimate"}
            </Badge>
          </div>) : (<div key={item.record.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                <FileSpreadsheet size={16}/>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-ink-100">{item.record.fileName}</p>
                <p className="mt-0.5 text-xs text-ink-400">{formatDateTime(item.record.analyzedAt)}</p>
              </div>
            </div>
            <Badge tone={item.record.summary.fraudulentAccounts > 0 ? "red" : "teal"}>
              {item.record.summary.fraudulentAccounts} flagged
            </Badge>
          </div>))}
    </div>);
}
