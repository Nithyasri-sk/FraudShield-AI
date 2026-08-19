import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// IMPORTANT: these keys must match the exact field names your API returns
// inside each fraud_transactions[] item. Open the network response for
// /api/predict and confirm — snake_case is used below to match the rest
// of your API's field naming (account_id, fraud_probability, etc). If
// your backend returns different names, update the `key` values here.
const FEATURE_CONFIG = [
  { key: "transaction_amount", label: "Transaction Amount", type: "numeric" },
  { key: "account_balance", label: "Account Balance", type: "numeric" },
  { key: "annual_income", label: "Annual Income", type: "numeric" },
  { key: "customer_age", label: "Customer Age", type: "numeric" },
  { key: "login_attempts", label: "Login Attempts", type: "numeric" },
  { key: "current_address_month_count", label: "Current Address (months)", type: "numeric" },
  { key: "transaction_type", label: "Transaction Type", type: "categorical" },
  { key: "location", label: "Location", type: "categorical" },
  { key: "channel", label: "Channel", type: "categorical" },
  { key: "customer_occupation", label: "Customer Occupation", type: "categorical" },
];

const CHART_COLOR = "#2dd4bf"; // teal-400 — matches the app's existing teal accent, not orange

function buildCategoricalData(transactions, key) {
  const categories = Array.from(new Set(transactions.map((t) => String(t[key] ?? "N/A"))));
  const data = transactions.map((t) => ({
    transaction_id: t.transaction_id ?? "N/A",
    value: categories.indexOf(String(t[key] ?? "N/A")),
    label: String(t[key] ?? "N/A"),
  }));
  return { data, categories };
}

function buildNumericData(transactions, key) {
  return transactions.map((t) => ({
    transaction_id: t.transaction_id ?? "N/A",
    value: typeof t[key] === "number" ? t[key] : Number(t[key]) || 0,
  }));
}

function FeatureChart({ feature, transactions }) {
  const isCategorical = feature.type === "categorical";
  const { data, categories } = isCategorical
    ? buildCategoricalData(transactions, feature.key)
    : { data: buildNumericData(transactions, feature.key), categories: null };

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900/40 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">
        {feature.label}
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="transaction_id" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={{ stroke: "#1e293b" }} tickLine={false} />
          {isCategorical ? (
            <YAxis
              domain={[0, Math.max(categories.length - 1, 0)]}
              ticks={categories.map((_, i) => i)}
              tickFormatter={(v) => categories[v] ?? ""}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
              width={80}
            />
          ) : (
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={{ stroke: "#1e293b" }} tickLine={false} width={50} />
          )}
          <Bar dataKey="value" fill={CHART_COLOR} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TransactionInsights({ transactions }) {
  if (!transactions || transactions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {FEATURE_CONFIG.map((feature) => (
        <FeatureChart key={feature.key} feature={feature} transactions={transactions} />
      ))}
    </div>
  );
}