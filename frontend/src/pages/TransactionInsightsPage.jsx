import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TransactionInsights } from "../components/upload/TransactionInsights";
import { PageContainer } from "../components/layout/PageContainer";

export function TransactionInsightsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const account = location.state?.account;
  const transactions = location.state?.transactions;

  // Direct URL visits (refresh, bookmark, back-button edge cases) won't
  // have router state — there's nowhere to pull the data from since it's
  // not persisted, so send them back rather than render an empty page.
  if (!account || !transactions) {
    return (
      <PageContainer>
        <p className="text-sm text-ink-400">No insights data to show.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 text-sm font-semibold text-accent-400 hover:text-accent-300"
        >
          Go back
        </button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-400 transition-colors hover:text-ink-100"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <h2 className="font-display text-lg font-semibold tracking-tight text-ink-100">
        Insights — {account.account_id ?? "N/A"}
      </h2>
      <p className="mt-1 text-xs text-ink-400">{transactions.length} flagged transaction{transactions.length === 1 ? "" : "s"}</p>

      <div className="mt-6">
        <TransactionInsights transactions={transactions} />
      </div>
    </PageContainer>
  );
}