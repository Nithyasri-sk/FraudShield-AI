import { CheckCircle2, ShieldCheck, Users, FileWarning, Gauge, Percent, Download } from "lucide-react";
import { summarizeDatasetAnalysis } from "../../types/upload";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { FraudTransactionTable } from "./FraudTransactionTable";
import { formatPercent } from "../../utils/format";
import { downloadFraudResultsCsv } from "../../utils/downloadCsv";
/**
 * Renders the real batch-analysis result once `analyzeDataset()` succeeds.
 * Every number here is derived from the actual API response
 * (`summarizeDatasetAnalysis`) — nothing is invented, and fields the
 * response didn't include render as "N/A" or are simply omitted.
 */
export function AnalysisResults({ response, fileName, }) {
    const { summary, rows } = summarizeDatasetAnalysis(response);
    const accounts = Array.isArray(response.fraud_accounts) ? response.fraud_accounts : [];
    const fraudDetectionRate = summary.totalTransactionsAcrossFlaggedAccounts && summary.totalTransactionsAcrossFlaggedAccounts > 0
        ? summary.fraudulentTransactions / summary.totalTransactionsAcrossFlaggedAccounts
        : null;
    const statCards = [
        {
            label: "Fraudulent Accounts",
            value: summary.fraudulentAccounts.toLocaleString(),
            icon: Users,
            tone: "text-red-400 bg-red-500/10",
        },
        {
            label: "Fraudulent Transactions",
            value: summary.fraudulentTransactions.toLocaleString(),
            icon: FileWarning,
            tone: "text-amber-400 bg-amber-500/10",
        },
        {
            label: "Avg. Fraud Probability",
            value: summary.averageFraudProbability !== null ? formatPercent(summary.averageFraudProbability, 2) : "N/A",
            icon: Gauge,
            tone: "text-accent-400 bg-accent-500/10",
        },
        {
            label: "Fraud Rate (Flagged Accts)",
            value: fraudDetectionRate !== null ? formatPercent(fraudDetectionRate, 2) : "N/A",
            icon: Percent,
            tone: "text-teal-400 bg-teal-500/10",
        },
    ];
    return (<div className="animate-fade-up flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
            <CheckCircle2 size={18}/>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink-100">
              Dataset Analysis Complete
            </h2>
            <p className="text-xs text-ink-400">Results for {fileName}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={<Download size={14}/>} onClick={() => downloadFraudResultsCsv(response, fileName)}>
          Download Results
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (<Card key={s.label} className="p-5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.tone}`}>
              <s.icon size={18}/>
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink-400">{s.label}</p>
            <p className="font-display mt-1 text-2xl font-semibold text-ink-100">{s.value}</p>
          </Card>))}
      </div>

      {accounts.length === 0 ? (<Card className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
            <ShieldCheck size={22}/>
          </div>
          <h3 className="font-display mt-4 text-base font-semibold text-ink-100">No fraudulent accounts detected</h3>
          <p className="mt-1.5 max-w-sm text-sm text-ink-400">
            The detection service didn't flag any accounts in this dataset as fraudulent.
          </p>
        </Card>) : (<>
      <div>
            <h3 className="font-display mb-3 text-base font-semibold tracking-tight text-ink-100">
              All Flagged Transactions
            </h3>
            <FraudTransactionTable rows={rows}/>
          </div>
        </>)}
    </div>);
}
