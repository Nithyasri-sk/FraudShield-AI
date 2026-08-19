import { PageContainer } from "../components/layout/PageContainer";
import { HeroSection } from "../components/dashboard/HeroSection";
import { StatsGrid } from "../components/dashboard/StatsGrid";
import { RecentActivityList } from "../components/dashboard/RecentActivityList";
import { useAnalysisHistory } from "../context/AnalysisHistoryContext";
export function Dashboard() {
    const { manualRecords, uploadRecords } = useAnalysisHistory();
    // Every number below is derived from real recorded analyses (see
    // AnalysisHistoryContext) — nothing here is mocked or hardcoded.
    // Upload results only expose *fraudulent* accounts/transactions (the
    // API doesn't return a dataset-wide total), so "Fraud Detected" and
    // "Avg. Fraud Probability" combine both flows, while "Transactions
    // Analyzed" and "Legitimate Transactions" reflect Manual mode only,
    // since that's the only flow where a true per-transaction total and
    // legitimate/fraud split are both known.
    const manualFraudCount = manualRecords.filter((r) => r.prediction === 1).length;
    const manualLegitimateCount = manualRecords.filter((r) => r.prediction === 0).length;
    const uploadFraudTransactionCount = uploadRecords.reduce((sum, r) => sum + r.summary.fraudulentTransactions, 0);
    const allProbabilities = [
        ...manualRecords.map((r) => r.fraudProbability),
        ...uploadRecords
            .flatMap((r) => r.response.fraud_accounts ?? [])
            .flatMap((a) => a.fraud_transactions ?? [])
            .map((t) => t.fraud_probability)
            .filter((p) => typeof p === "number"),
    ];
    const hasAnyData = manualRecords.length > 0 || uploadRecords.length > 0;
    const stats = hasAnyData
        ? {
            transactionsAnalyzed: manualRecords.length,
            fraudDetected: manualFraudCount + uploadFraudTransactionCount,
            legitimateTransactions: manualLegitimateCount,
            averageFraudProbability: allProbabilities.length
                ? allProbabilities.reduce((a, b) => a + b, 0) / allProbabilities.length
                : 0,
        }
        : { transactionsAnalyzed: 0, fraudDetected: 0, legitimateTransactions: 0, averageFraudProbability: 0 };
    return (<PageContainer>
      <div className="flex flex-col gap-8">
        <HeroSection />
        <StatsGrid stats={stats} loading={false}/>
        <div>
          <h2 className="font-display mb-4 text-lg font-semibold tracking-tight text-ink-100">Recent Activity</h2>
          <RecentActivityList manualRecords={manualRecords} uploadRecords={uploadRecords}/>
        </div>
      </div>
    </PageContainer>);
}
