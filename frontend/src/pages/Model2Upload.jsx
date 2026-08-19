import { useState } from "react";
import { FileSpreadsheet, RotateCcw, AlertCircle, ScanLine, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { FileDropZone } from "../components/upload/FileDropZone";
import { AnalysisButton } from "../components/form/AnalysisButton";
import { Card, CardHeader } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { ErrorState } from "../components/result/ErrorState";
import { Model2Results } from "../components/model2/Model2Results";
import { readCsvPreview, isCsvFile, formatFileSize, CsvReadError } from "../utils/csv";
import { analyzeDatasetModel2, isApiError } from "../services/fraudApi";
import { useAnalysisHistory } from "../context/AnalysisHistoryContext";
import { useToast } from "../context/ToastContext";

const THRESHOLD_OPTIONS = [
  { value: "high_recall", label: "High Recall (default)" },
  { value: "high_precision", label: "High Precision" },
];

export function Model2Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle");
  const [readError, setReadError] = useState(null);
  const [thresholdMode, setThresholdMode] = useState("high_recall");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [analyzedFileName, setAnalyzedFileName] = useState("");
  const { showToast } = useToast();
  const { addAccountRecord } = useAnalysisHistory();
  async function handleFileSelected(selected) {
    setResult(null);
    setApiError(null);
    if (!isCsvFile(selected)) {
      setFile(null);
      setPreview(null);
      setStatus("error");
      setReadError("Only .csv files are supported. Please choose a CSV file.");
      return;
    }
    setFile(selected);
    setStatus("reading");
    setReadError(null);
    try {
      const preview = await readCsvPreview(selected);
      setPreview(preview);
      setStatus("ready");
    } catch (err) {
      setPreview(null);
      setStatus("error");
      setReadError(err instanceof CsvReadError ? err.message : "This file could not be read. Please try another file.");
    }
  }

  function handleRemove() {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setReadError(null);
    setResult(null);
    setApiError(null);
  }

  async function handleAnalyze() {
    if (!file) return;
    setAnalyzing(true);
    setApiError(null);
    setResult(null);
    try {
      const response = await analyzeDatasetModel2(file, thresholdMode);
      setResult(response);
      setAnalyzedFileName(file.name);
      addAccountRecord(file, response);
      showToast({
        variant: response.predicted_fraud > 0 ? "warning" : "success",
        title: "Analysis Complete",
        message: `${response.predicted_fraud} of ${response.total_accounts} rows predicted fraud.`,
      });
    } catch (err) {
      const error = isApiError(err)
        ? err
        : { code: "UNKNOWN", message: "Unable to analyze the dataset right now. Please try again." };
      setApiError(error);
      showToast({ variant: "error", title: "Analysis Failed" });
    } finally {
      setAnalyzing(false);
    }
  }

  const hasFile = status === "ready" || status === "reading";

  return (
    <PageContainer>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-100">Model 2 — Batch Detection</h1>
          <p className="mt-0.5 text-sm text-ink-400">CSV-only fraud detection using the alternate detection model</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Card>
          <CardHeader icon={<FileSpreadsheet size={17} />} title="Batch Dataset Upload" subtitle="Analyze a CSV file with Model 2" />

          <div className="flex flex-col gap-5 p-5 sm:p-6">
            {!hasFile && status !== "error" && <FileDropZone accept=".csv" onFileSelected={handleFileSelected} />}

            {status === "error" && !hasFile && (
              <>
                <FileDropZone accept=".csv" onFileSelected={handleFileSelected} />
                <div className="animate-fade-up flex items-start gap-2.5 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                  <p className="text-xs leading-relaxed text-red-300">{readError}</p>
                </div>
              </>
            )}

            {hasFile && file && (
              <div className="animate-fade-up flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4 rounded-xl border border-ink-600 bg-ink-900/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                      {status === "reading" ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-400/30 border-t-teal-400" />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-100">{file.name}</p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {formatFileSize(file.size)}
                        {status === "reading" && " · Reading file…"}
                        {status === "ready" && preview && ` · ${preview.rowCount.toLocaleString()} rows detected`}
                      </p>
                    </div>
                  </div>
                  <button onClick={handleRemove} disabled={analyzing} className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-400 transition-colors hover:bg-ink-700 hover:text-ink-100 disabled:opacity-40">
                    <RotateCcw size={13} />
                    Change
                  </button>
                </div>
              </div>
            )}

            {status === "ready" && (
              <div className="flex flex-col gap-4">
                <div className="max-w-xs">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-400">
                    Threshold Mode
                  </label>
                  <Select value={thresholdMode} onChange={(e) => setThresholdMode(e.target.value)} options={THRESHOLD_OPTIONS} />
                </div>
                <div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center">
                  <AnalysisButton label="Analyze Dataset" loadingLabel="Analyzing transaction dataset…" loading={analyzing} icon={<ScanLine size={18} />} onClick={handleAnalyze} />
                </div>
              </div>
            )}

            {analyzing && (
              <div className="animate-fade-up flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/30 px-4 py-3.5">
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent-400/30 border-t-accent-400" />
                <p className="text-xs text-ink-300">
                  Sending this dataset to the fraud detection service and waiting for results. This can take a
                  little longer if the service has been idle.
                </p>
              </div>
            )}
          </div>
        </Card>

        {!analyzing && apiError && <ErrorState error={apiError} onRetry={handleAnalyze} title="Analysis Failed" />}

        {!analyzing && !apiError && result && <Model2Results response={result} fileName={analyzedFileName} />}
      </div>
    </PageContainer>
  );
}