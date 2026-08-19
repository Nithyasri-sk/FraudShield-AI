import { useState } from "react";
import { FileSpreadsheet, ChevronDown } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { Model2Results } from "../Model2/Model2Results";
import { formatDateTime } from "../../utils/format";
import { formatFileSize } from "../../utils/csv";

export function AccountHistoryList({ records }) {
  const [expandedId, setExpandedId] = useState(null);

  if (records.length === 0) {
    return (
      <EmptyState
        title="No account analyses yet."
        description="Upload a CSV from Analyze Account to see Model 2 results here."
      />
    );
  }

  const sorted = [...records].sort(
    (a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
  );

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((record) => {
        const isExpanded = expandedId === record.id;
        const hasFraud = (record.summary.predictedFraud ?? 0) > 0;
        return (
          <Card key={record.id}>
            <button
              onClick={() => setExpandedId((id) => (id === record.id ? null : record.id))}
              className="flex w-full flex-col items-start gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400">
                  <FileSpreadsheet size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-100">{record.fileName}</p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {formatDateTime(record.analyzedAt)} · {formatFileSize(record.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge tone={hasFraud ? "red" : "teal"}>
                  {record.summary.predictedFraud ?? 0} fraud ·{" "}
                  {record.summary.totalAccounts ?? 0} rows
                </Badge>
                <ChevronDown
                  size={16}
                  className={`text-ink-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-ink-700 p-4 sm:p-6">
                <Model2Results response={record.response} fileName={record.fileName} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}