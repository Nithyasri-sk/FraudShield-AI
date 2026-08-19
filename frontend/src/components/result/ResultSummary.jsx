import { Card, CardHeader } from "../ui/Card";
import { formatCurrency } from "../../utils/format";
import { ClipboardList } from "lucide-react";
export function ResultSummary({ transaction }) {
    const rows = [
        ["Transaction ID", transaction.TransactionID],
        ["Account ID", transaction.AccountID],
        ["Transaction Amount", formatCurrency(transaction.TransactionAmount)],
        ["Transaction Type", transaction.TransactionType],
        ["Channel", transaction.Channel],
    ];
    return (<Card>
      <CardHeader icon={<ClipboardList size={17}/>} title="Transaction Summary"/>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 p-5 sm:grid-cols-2 sm:p-6">
        {rows.map(([label, value]) => (<div key={label} className="flex items-center justify-between border-b border-ink-750 pb-2 sm:border-none sm:pb-0">
            <dt className="text-xs font-medium text-ink-400">{label}</dt>
            <dd className="font-mono-data text-sm text-ink-100">{value}</dd>
          </div>))}
      </dl>
    </Card>);
}
