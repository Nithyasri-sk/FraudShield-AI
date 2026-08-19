import { useState } from "react";
import { CheckCircle2, FileSpreadsheet, RotateCcw, AlertCircle, ScanLine } from "lucide-react";
import { FileDropZone } from "./FileDropZone";
import { AnalysisButton } from "../form/AnalysisButton";
import { AnalysisResults } from "./AnalysisResults";
import { Card, CardHeader } from "../ui/Card";
import { ErrorState } from "../result/ErrorState";
import { readCsvPreview, isCsvFile, formatFileSize, CsvReadError } from "../../utils/csv";
import { analyzeDataset, isApiError } from "../../services/fraudApi";
import { useAnalysisHistory } from "../../context/AnalysisHistoryContext";
import { useToast } from "../../context/ToastContext";
/**
 * Upload mode for the Analyze Transaction page. Selecting a CSV only
 * reads it locally for a sanity-check preview — the file itself is only
 * ever sent anywhere when the analyst clicks "Analyze Dataset", at which
 * point it's POSTed as multipart/form-data to the real deployed batch
 * analysis backend (services/fraudApi.ts -> analyzeDataset). No fraud
 * prediction of any kind happens in the browser.
 */
export function DatasetUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState("idle");
    const [readError, setReadError] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [analyzedFileName, setAnalyzedFileName] = useState("");
    const { addUploadRecord } = useAnalysisHistory();
    const { showToast } = useToast();
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
        }
        catch (err) {
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
        if (!file)
            return;
        setAnalyzing(true);
        setApiError(null);
        setResult(null);
        try {
            const response = await analyzeDataset(file);
            setResult(response);
            setAnalyzedFileName(file.name);
            addUploadRecord(file, response);
            const fraudCount = response.fraud_accounts?.length ?? 0;
            showToast({
                variant: fraudCount > 0 ? "warning" : "success",
                title: "Analysis Complete",
                message: fraudCount > 0 ? `${fraudCount} fraudulent account(s) detected.` : "No fraudulent accounts detected.",
            });
        }
        catch (err) {
            const error = isApiError(err)
                ? err
                : { code: "UNKNOWN", message: "Unable to analyze the dataset right now. Please try again." };
            setApiError(error);
            showToast({ variant: "error", title: "Analysis Failed" });
        }
        finally {
            setAnalyzing(false);
        }
    }
    const hasFile = status === "ready" || status === "reading";
    return (<div className="flex flex-col gap-6">
      <Card>
        <CardHeader icon={<FileSpreadsheet size={17}/>} title="Batch Dataset Upload" subtitle="Analyze multiple transactions at once from a CSV file"/>

        <div className="flex flex-col gap-5 p-5 sm:p-6">
          {!hasFile && status !== "error" && (<FileDropZone accept=".csv" onFileSelected={handleFileSelected}/>)}

          {status === "error" && !hasFile && (<>
              <FileDropZone accept=".csv" onFileSelected={handleFileSelected}/>
              <div className="animate-fade-up flex items-start gap-2.5 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400"/>
                <p className="text-xs leading-relaxed text-red-300">{readError}</p>
              </div>
            </>)}

          {hasFile && file && (<div className="animate-fade-up flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4 rounded-xl border border-ink-600 bg-ink-900/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                    {status === "reading" ? (<span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-400/30 border-t-teal-400"/>) : (<CheckCircle2 size={18}/>)}
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
                  <RotateCcw size={13}/>
                  Change
                </button>
              </div>
            </div>)}

          {status === "ready" && (<div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center">
              <AnalysisButton label="Analyze Dataset" loadingLabel="Analyzing transaction dataset…" loading={analyzing} icon={<ScanLine size={18}/>} onClick={handleAnalyze}/>
            </div>)}

          {analyzing && (<div className="animate-fade-up flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-900/30 px-4 py-3.5">
              <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-accent-400/30 border-t-accent-400"/>
              <p className="text-xs text-ink-300">
                Sending this dataset to the fraud detection service and waiting for results. This can take a
                little longer if the service has been idle.
              </p>
            </div>)}
        </div>
      </Card>

      {!analyzing && apiError && (<ErrorState error={apiError} onRetry={handleAnalyze} title="Analysis Failed"/>)}

      {!analyzing && !apiError && result && (<AnalysisResults response={result} fileName={analyzedFileName}/>)}
    </div>);
}
