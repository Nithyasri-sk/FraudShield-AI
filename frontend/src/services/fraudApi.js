import { toBackendDate, toBackendDateTime } from "../utils/backendFormat";
/**
 * FraudShield AI — API service layer.
 *
 * This is the ONLY module that should ever talk to the backend. UI
 * components must never call fetch() directly — they call the functions
 * exported here.
 *
 *   predictTransaction(input)     → POST the manual 19-field form as JSON
 *                                    to the single-transaction model.
 *   analyzeDataset(file)          → POST an uploaded CSV as multipart/form-data
 *                                    to the batch dataset model.
 *   analyzeDatasetModel2(file, thresholdMode) → POST an uploaded CSV as
 *                                    multipart/form-data to the second,
 *                                    independent batch fraud model.
 *
 * None of these functions compute, adjust, or fabricate a prediction
 * themselves — each only forwards the request and returns exactly what
 * its backend responds with.
 */
// Manual single-transaction endpoint.
const PREDICT_URL = import.meta.env.VITE_API_URL ||
    "https://bank-fraud-manudb.onrender.com/api/predict";
// CSV batch-analysis endpoint. Deliberately a separate service/URL from
// PREDICT_URL above — the two are different deployments.
const UPLOAD_PREDICT_URL = import.meta.env.VITE_UPLOAD_API_URL ||
    "https://bank-fraud-db.onrender.com/api/predict";
// Second, independently-deployed CSV batch model. Different response
// shape entirely from analyzeDataset() below — returns a flat per-row
// list (row_id, fraud_probability, prediction), not account/transaction
// grouped data. Kept as its own function (but still in this same
// service module) since the two backends are unrelated deployments.
const MODEL2_PREDICT_URL = import.meta.env.VITE_MODEL2_API_URL ||
    "https://fraud-detection1-api.onrender.com/predict-csv";
class FraudApiError extends Error {
    code;
    details;
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.details = details;
    }
}
async function safeJson(response) {
    try {
        return await response.json();
    }
    catch {
        return null;
    }
}
/**
 * Builds the exact JSON payload the manual backend expects from the
 * form's raw TransactionInput. All 19 fields are always included,
 * unfiltered — the only transformation applied is converting the three
 * date/time fields from native <input> value format into the backend's
 * "DD-MM-YYYY[ HH:mm]" string format.
 */
function toBackendPayload(input) {
    return {
        TransactionID: input.TransactionID,
        AccountID: input.AccountID,
        TransactionDate: toBackendDateTime(input.TransactionDate),
        PreviousTransactionDate: toBackendDateTime(input.PreviousTransactionDate),
        LoginAttempts: input.LoginAttempts,
        UserName: input.UserName,
        Email: input.Email,
        DateOfBirth: toBackendDate(input.DateOfBirth),
        DeviceID: input.DeviceID,
        TransactionAmount: input.TransactionAmount,
        TransactionType: input.TransactionType,
        Location: input.Location,
        Channel: input.Channel,
        CustomerAge: input.CustomerAge,
        CustomerOccupation: input.CustomerOccupation,
        AccountBalance: input.AccountBalance,
        AnnualIncome: input.AnnualIncome,
        CurrentAddressMonthCount: input.CurrentAddressMonthCount,
        PreviousAddressMonthCount: input.PreviousAddressMonthCount,
    };
}
/**
 * Sends a single transaction to the deployed manual-prediction backend
 * and returns its response unchanged.
 */
export async function predictTransaction(input) {
    let response;
    try {
        response = await fetch(PREDICT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toBackendPayload(input)),
        });
    }
    catch {
        throw new FraudApiError("NETWORK_ERROR", "Unable to reach the detection service.", "The request failed before receiving a response. This can also happen if the backend's CORS configuration doesn't allow this origin, or if the service is asleep and slow to wake (Render free tier).");
    }
    if (response.status === 422 || response.status === 400) {
        const body = await safeJson(response);
        throw new FraudApiError("VALIDATION_ERROR", body?.message ?? "The backend rejected one or more input values.", body?.details);
    }
    if (response.status === 503) {
        throw new FraudApiError("SERVICE_UNAVAILABLE", "The detection service is temporarily unavailable.", "The ML model service returned a 503. Try again shortly.");
    }
    if (!response.ok) {
        throw new FraudApiError("PREDICTION_FAILED", "The detection service could not complete this prediction.", `HTTP ${response.status}`);
    }
    const body = (await safeJson(response));
    if (!body || !body.data || (body.data.prediction !== 0 && body.data.prediction !== 1)) {
        throw new FraudApiError("PREDICTION_FAILED", "The detection service returned an unexpected response.");
    }
    return body;
}
/**
 * Sends an uploaded CSV to the deployed batch-analysis backend exactly
 * as a file (multipart/form-data, field name "file") and returns its
 * response unchanged. Never converts the CSV to JSON, never drops
 * columns before sending, and never computes fraud predictions locally.
 */
export async function analyzeDataset(file) {
    const formData = new FormData();
    formData.append("file", file);
    let response;
    try {
        response = await fetch(UPLOAD_PREDICT_URL, {
            method: "POST",
            // No Content-Type header — the browser sets the multipart boundary
            // automatically. Setting it manually breaks the upload.
            body: formData,
        });
    }
    catch {
        throw new FraudApiError("NETWORK_ERROR", "Unable to reach the detection service.", "The request failed before receiving a response. This can also happen if the backend's CORS configuration doesn't allow this origin, or if the service is asleep and slow to wake (Render free tier).");
    }
    if (response.status === 422 || response.status === 400) {
        const body = await safeJson(response);
        throw new FraudApiError("VALIDATION_ERROR", body?.message ?? "The uploaded file was rejected by the detection service.", body?.details);
    }
    if (response.status === 503) {
        throw new FraudApiError("SERVICE_UNAVAILABLE", "The detection service is temporarily unavailable.", "The dataset analysis service returned a 503. Try again shortly.");
    }
    if (!response.ok) {
        throw new FraudApiError("PREDICTION_FAILED", "The detection service could not analyze this dataset.", `HTTP ${response.status}`);
    }
    const data = await safeJson(response);
    if (!data || typeof data !== "object") {
        throw new FraudApiError("PREDICTION_FAILED", "The detection service returned an unexpected response.");
    }
    // Intentionally NOT validating fraud_accounts is present/non-empty here —
    // an empty or missing fraud_accounts list is a legitimate "no fraud
    // found" result, not an error. Callers render that case explicitly.
    return data;
}
/**
 * Sends an uploaded CSV to the second, independent fraud-detection
 * backend as multipart/form-data (field name "file"), optionally along
 * with a threshold_mode field ("high_recall" or "high_precision" — the
 * backend itself defaults to "high_recall" if omitted), and returns its
 * response unchanged.
 */
export async function analyzeDatasetModel2(file, thresholdMode) {
    const formData = new FormData();
    formData.append("file", file);
    if (thresholdMode) {
        formData.append("threshold_mode", thresholdMode);
    }
    let response;
    try {
        response = await fetch(MODEL2_PREDICT_URL, {
            method: "POST",
            // No Content-Type header — the browser sets the multipart boundary
            // automatically. Setting it manually breaks the upload.
            body: formData,
        });
    }
    catch {
        throw new FraudApiError("NETWORK_ERROR", "Unable to reach the detection service.", "The request failed before receiving a response. This can also happen if the backend's CORS configuration doesn't allow this origin, or if the service is asleep and slow to wake (Render free tier).");
    }
    if (response.status === 422 || response.status === 400) {
        const body = await safeJson(response);
        throw new FraudApiError("VALIDATION_ERROR", body?.message ?? "The uploaded file was rejected by the detection service.", body?.details);
    }
    if (response.status === 503) {
        throw new FraudApiError("SERVICE_UNAVAILABLE", "The detection service is temporarily unavailable.", "The service returned a 503. Try again shortly.");
    }
    if (!response.ok) {
        throw new FraudApiError("PREDICTION_FAILED", "The detection service could not analyze this dataset.", `HTTP ${response.status}`);
    }
    const body = await safeJson(response);
    if (!body || body.success !== true || !Array.isArray(body.accounts)) {
        throw new FraudApiError("PREDICTION_FAILED", "The detection service returned an unexpected response.");
    }
    return body;
}
/**
 * Fetches previously-analyzed CSV uploads from the upload backend's
 * MongoDB-backed history endpoint. Same base deployment as
 * UPLOAD_PREDICT_URL above — just the /api/history route on it.
 * Returns the raw Mongo-shaped records unchanged.
 */
export async function getUploadHistory() {
    let response;
    try {
        response = await fetch(
            UPLOAD_PREDICT_URL.replace(/\/api\/predict\/?$/, "/api/history"),
            { method: "GET" }
        );
    }
    catch {
        throw new FraudApiError("NETWORK_ERROR", "Unable to reach the history service.", "The request failed before receiving a response.");
    }
    if (!response.ok) {
        throw new FraudApiError("PREDICTION_FAILED", "Unable to load detection history.", `HTTP ${response.status}`);
    }
    const data = await safeJson(response);
    if (!data || data.success !== true || !Array.isArray(data.history)) {
        throw new FraudApiError("PREDICTION_FAILED", "The history service returned an unexpected response.");
    }
    return data.history;
}
/**
 * Fetches previously-analyzed manual transactions from the manual
 * backend's MongoDB-backed history endpoint. Same base deployment as
 * PREDICT_URL above — just the /api/history route on it.
 * Returns the raw Mongo-shaped records unchanged.
 */
export async function getManualHistory() {
    let response;
    try {
        response = await fetch(
            PREDICT_URL.replace(/\/api\/predict\/?$/, "/api/history"),
            { method: "GET" }
        );
    }
    catch {
        throw new FraudApiError("NETWORK_ERROR", "Unable to reach the manual history service.", "The request failed before receiving a response.");
    }
    if (!response.ok) {
        throw new FraudApiError("PREDICTION_FAILED", "Unable to load manual detection history.", `HTTP ${response.status}`);
    }
    const data = await safeJson(response);
    if (!data || data.status !== "success" || !Array.isArray(data.data)) {
        throw new FraudApiError("PREDICTION_FAILED", "The manual history service returned an unexpected response.");
    }
    return data.data;
}
export async function getAccountHistory() {
    let response;
    try {
        response = await fetch(
            MODEL2_PREDICT_URL.replace(/\/predict-csv\/?$/, "/history"),
            { method: "GET" }
        );
    }
    catch {
        throw new FraudApiError("NETWORK_ERROR", "Unable to reach the account history service.", "The request failed before receiving a response.");
    }
    if (!response.ok) {
        throw new FraudApiError("PREDICTION_FAILED", "Unable to load account analysis history.", `HTTP ${response.status}`);
    }
    const data = await safeJson(response);
    if (!data || data.success !== true || !Array.isArray(data.history)) {
        throw new FraudApiError("PREDICTION_FAILED", "The account history service returned an unexpected response.");
    }
    return data.history;
}
export function isApiError(err) {
    return (typeof err === "object" &&
        err !== null &&
        "code" in err &&
        "message" in err);
}