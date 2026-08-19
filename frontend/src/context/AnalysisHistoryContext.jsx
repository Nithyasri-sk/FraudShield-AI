import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAccountHistory, getManualHistory, getUploadHistory } from "../services/fraudApi";
import { summarizeDatasetAnalysis } from "../types/upload";
/**
 * Single shared data flow for the app:
 *
 *   MongoDB history (fetched on mount) ──────┐
 *   API SUCCESS → addManualRecord() / addUploadRecord() → in-memory state
 *        ↓                  ↓                 ↓
 *    Dashboard          History          (result screen already
 *                                          has its own copy in memory)
 *
 * Nothing else should maintain its own separate copy of "what's been
 * analyzed" — Dashboard and Detection History both read from this
 * context so they can never drift out of sync with each other.
 *
 * On mount, this pulls previously-analyzed records from the backends'
 * MongoDB-backed /api/history endpoints (getManualHistory /
 * getUploadHistory) — that's the real source of truth. Records added
 * during the current session via addManualRecord/addUploadRecord are
 * held in memory only (not persisted to localStorage) so they show up
 * immediately, and get naturally superseded by the real Mongo record
 * once history is refetched. Only real, successful API responses are
 * ever written here — never mock or fabricated data.
 */
// NOTE: This used to also persist state to localStorage on every change
// and seed initial state from it. That's been removed — MongoDB (via
// getManualHistory/getUploadHistory below) is now the real source of
// truth, and locally-generated ids (makeId()) never match MongoDB's
// _id, so persisted local entries could never be deduped against the
// backend and would accumulate as permanent duplicates across sessions.
// STORAGE_KEY is kept only so any old cached entries from before this
// fix get cleared out once, below.
const STORAGE_KEY = "fraudshield.history.v1";
function makeId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto)
        return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
const AnalysisHistoryContext = createContext(null);
export function AnalysisHistoryProvider({ children }) {
    const [state, setState] = useState({ manualRecords: [], uploadRecords: [], accountRecords: []  });
    // One-time cleanup: remove any stale pre-fix localStorage history so
    // old duplicate entries from previous sessions can't resurface.
    useEffect(() => {
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        }
        catch {
            // Ignore — nothing to clean up if storage isn't accessible.
        }
    }, []);
    // Load previously-analyzed dataset uploads from the MongoDB-backed
    // history endpoint and merge them into local state (dedupe by id —
    // locally-added records not yet reflected in Mongo are kept).
    useEffect(() => {
        async function loadUploadHistory() {
            try {
                const history = await getUploadHistory();
                const fetchedRecords = history.map((item) => {
                    const fraudAccounts = item.fraud_accounts ?? [];
                    const fraudProbabilities = fraudAccounts.flatMap((account) => (account.fraud_transactions ?? []).map((transaction) => transaction.fraud_probability ?? 0));
                    const averageFraudProbability = fraudProbabilities.length > 0
                        ? fraudProbabilities.reduce((sum, value) => sum + value, 0) / fraudProbabilities.length
                        : 0;
                    const totalTransactionsAcrossFlaggedAccounts = fraudAccounts.reduce((sum, account) => sum + (account.total_transactions ?? 0), 0);
                    return {
                        kind: "upload",
                        id: item.upload_id,
                        analyzedAt: item.upload_time,
                        fileName: item.file_name,
                        fileSize: 0,
                        response: {
                            success: true,
                            total_transactions: item.total_transactions,
                            predicted_fraud: item.predicted_fraud,
                            predicted_nonfraud: item.predicted_nonfraud,
                            fraud_accounts: fraudAccounts,
                        },
                        summary: {
                            totalTransactions: item.total_transactions,
                            fraudulentTransactions: item.predicted_fraud,
                            fraudulentAccounts: fraudAccounts.length,
                            nonFraudTransactions: item.predicted_nonfraud,
                            averageFraudProbability,
                            totalTransactionsAcrossFlaggedAccounts,
                        },
                    };
                });
                setState((prev) => {
                    const existingIds = new Set(fetchedRecords.map((record) => record.id));
                    const localOnly = prev.uploadRecords.filter((record) => !existingIds.has(record.id));
                    return { ...prev, uploadRecords: [...localOnly, ...fetchedRecords] };
                });
            }
            catch (error) {
                console.error("Failed to load upload history:", error);
            }
        }
        loadUploadHistory();
    }, []);
    // Load previously-analyzed manual transactions from the MongoDB-backed
    // history endpoint and merge them into local state (dedupe by id).
    useEffect(() => {
        async function loadManualHistory() {
            try {
                const history = await getManualHistory();
                const fetchedRecords = history.map((item) => ({
                    kind: "manual",
                    id: item._id,
                    analyzedAt: new Date().toISOString(),
                    transactionId: item.TransactionID,
                    accountId: item.AccountID,
                    transactionAmount: item.TransactionAmount,
                    transactionType: item.TransactionType,
                    channel: item.Channel,
                    prediction: item.prediction,
                    fraudProbability: item.fraud_probability,
                    fraudPercentage: item.fraud_percentage,
                    resultLabel: item.result,
                }));
                setState((prev) => {
                    const existingIds = new Set(fetchedRecords.map((record) => record.id));
                    const localOnly = prev.manualRecords.filter((record) => !existingIds.has(record.id));
                    return { ...prev, manualRecords: [...localOnly, ...fetchedRecords] };
                });
            }
            catch (error) {
                console.error("Failed to load manual history:", error);
            }
        }
        loadManualHistory();
    }, []);
        useEffect(() => {
        async function loadAccountHistory() {
            try {
                const history = await getAccountHistory();
                const fetchedRecords = history.map((item) => ({
                    kind: "account",
                    id: item._id ?? item.upload_id ?? item.id,
                    analyzedAt: item.analyzed_at ?? item.upload_time ?? new Date().toISOString(),
                    fileName: item.file_name ?? "Unknown file",
                    fileSize: 0,
                    response: {
                        success: true,
                        total_accounts: item.total_accounts,
                        predicted_fraud: item.predicted_fraud,
                        predicted_not_fraud: item.predicted_not_fraud,
                        threshold_used: item.threshold_used,
                        threshold_mode: item.threshold_mode,
                        accounts: item.accounts ?? [],
                    },
                    summary: {
                        totalAccounts: item.total_accounts,
                        predictedFraud: item.predicted_fraud,
                        predictedNotFraud: item.predicted_not_fraud,
                        thresholdMode: item.threshold_mode,
                    },
                }));
                setState((prev) => {
                    const existingIds = new Set(fetchedRecords.map((record) => record.id));
                    const localOnly = prev.accountRecords.filter((record) => !existingIds.has(record.id));
                    return { ...prev, accountRecords: [...localOnly, ...fetchedRecords] };
                });
            }
            catch (error) {
                console.error("Failed to load account analysis history:", error);
            }
        }
        loadAccountHistory();
    }, []);

    function addManualRecord(transaction, result) {
        const record = {
            kind: "manual",
            id: makeId(),
            analyzedAt: new Date().toISOString(),
            transactionId: transaction.TransactionID,
            accountId: transaction.AccountID,
            transactionAmount: transaction.TransactionAmount,
            transactionType: transaction.TransactionType,
            channel: transaction.Channel,
            prediction: result.prediction,
            fraudProbability: result.fraud_probability,
            fraudPercentage: result.fraud_percentage,
            resultLabel: result.result,
        };
        setState((prev) => ({ ...prev, manualRecords: [record, ...prev.manualRecords] }));
    }
    function addUploadRecord(file, response) {
        const { summary } = summarizeDatasetAnalysis(response);
        const record = {
            kind: "upload",
            id: makeId(),
            analyzedAt: new Date().toISOString(),
            fileName: file.name,
            fileSize: file.size,
            response,
            summary,
        };
        setState((prev) => ({ ...prev, uploadRecords: [record, ...prev.uploadRecords] }));
        return record;
    }
        function addAccountRecord(file, response) {
        const record = {
            kind: "account",
            id: makeId(),
            analyzedAt: new Date().toISOString(),
            fileName: file.name,
            fileSize: file.size,
            response,
            summary: {
                totalAccounts: response.total_accounts,
                predictedFraud: response.predicted_fraud,
                predictedNotFraud: response.predicted_not_fraud,
                thresholdMode: response.threshold_mode,
            },
        };
        setState((prev) => ({ ...prev, accountRecords: [record, ...prev.accountRecords] }));
        return record;
    }
    function clearHistory() {
        setState({ manualRecords: [], uploadRecords: [] , accountRecords: []});
    }
       const allRecords = useMemo(() => [...state.manualRecords, ...state.uploadRecords, ...state.accountRecords].sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()), [state]);
    return (<AnalysisHistoryContext.Provider value={{
            manualRecords: state.manualRecords,
            uploadRecords: state.uploadRecords,
            accountRecords: state.accountRecords,
            allRecords,
            addManualRecord,
            addUploadRecord,
            addAccountRecord,
            clearHistory,
        }}>
      {children}
    </AnalysisHistoryContext.Provider>);
}
export function useAnalysisHistory() {
    const ctx = useContext(AnalysisHistoryContext);
    if (!ctx)
        throw new Error("useAnalysisHistory must be used within an AnalysisHistoryProvider");
    return ctx;
}
