import { useState } from "react";
import { ScanLine, ShieldCheck } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { ManualTransactionForm } from "../components/form/ManualTransactionForm";
import { AnalysisModeToggle } from "../components/form/AnalysisModeToggle";
import { DatasetUpload } from "../components/upload/DatasetUpload";
import { ResultCard } from "../components/result/ResultCard";
import { ResultSummary } from "../components/result/ResultSummary";
import { ErrorState } from "../components/result/ErrorState";
import { predictTransaction, isApiError } from "../services/fraudApi";
import { useToast } from "../context/ToastContext";
import { useAnalysisHistory } from "../context/AnalysisHistoryContext";
export function AnalyzeTransaction() {
    // Which workflow is showing. Manual-mode state (below) is kept around
    // even while Upload is selected, so switching back to Manual doesn't
    // lose a result the analyst already produced.
    const [mode, setMode] = useState("manual");
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [lastInput, setLastInput] = useState(null);
    const [error, setError] = useState(null);
    const { showToast } = useToast();
    const { addManualRecord } = useAnalysisHistory();
    async function handleSubmit(input) {
        setSubmitting(true);
        setError(null);
        setResult(null);
        setLastInput(input);
        try {
            const response = await predictTransaction(input);
            setResult(response);
            addManualRecord(input, response.data);
            showToast({
                variant: response.data.prediction === 1 ? "warning" : "success",
                title: "Transaction analyzed successfully.",
                message: response.data.result,
            });
        }
        catch (err) {
            if (isApiError(err)) {
                setError(err);
            }
            else {
                setError({ code: "UNKNOWN", message: "Something went wrong while communicating with the detection service. Please try again." });
            }
            showToast({ variant: "error", title: "Unable to analyze transaction" });
        }
        finally {
            setSubmitting(false);
        }
    }
    function handleRetry() {
        if (lastInput)
            handleSubmit(lastInput);
    }
    return (<PageContainer>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
          <ShieldCheck size={22}/>
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-100">Analyze Transaction</h1>
          <p className="mt-0.5 text-sm text-ink-400">AI-powered transaction analysis · Secure prediction engine</p>
        </div>
      </div>

      <div className="mb-8">
        <AnalysisModeToggle mode={mode} onChange={setMode}/>
      </div>

      {mode === "manual" ? (<div className="animate-fade-up grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
          <ManualTransactionForm onSubmit={handleSubmit} submitting={submitting}/>

          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            {submitting && <AnalyzingPlaceholder />}

            {!submitting && error && <ErrorState error={error} onRetry={handleRetry}/>}

            {!submitting && !error && result && lastInput && (<>
                <ResultCard result={result}/>
                <ResultSummary transaction={lastInput}/>
              </>)}

            {!submitting && !error && !result && (<div className="card-surface flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-800 text-ink-400">
                  <ScanLine size={20}/>
                </div>
                <h3 className="font-display mt-4 text-base font-semibold text-ink-100">Awaiting transaction details</h3>
                <p className="mt-1.5 max-w-xs text-sm text-ink-400">
                  Fill in the form and analyze a transaction to see the model's fraud risk prediction here.
                </p>
              </div>)}
          </div>
        </div>) : (<div className="animate-fade-up mx-auto max-w-5xl">
          <DatasetUpload />
        </div>)}
    </PageContainer>);
}
function AnalyzingPlaceholder() {
    return (<div className="card-surface animate-fade-up relative flex flex-col items-center justify-center overflow-hidden rounded-2xl px-6 py-16 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-ink-600 bg-ink-850">
        <ShieldCheck size={26} className="text-accent-400"/>
        <div className="pointer-events-none absolute inset-x-0 -top-1/2 h-1/2 bg-gradient-to-b from-transparent via-accent-400/25 to-accent-400/50 animate-scan-sweep"/>
      </div>
      <h3 className="font-display mt-5 text-base font-semibold text-ink-100">Analyzing transaction…</h3>
      <p className="mt-1.5 max-w-xs text-sm text-ink-400">
        Running transaction and account signals through the fraud detection model.
      </p>
      <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-ink-700">
        <div className="h-full w-1/3 animate-shimmer rounded-full bg-accent-500"/>
      </div>
    </div>);
}
