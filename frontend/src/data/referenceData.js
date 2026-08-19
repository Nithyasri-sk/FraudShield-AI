// Reference option lists for the Manual transaction form's select fields.
// Values match the exact casing the deployed model's categorical
// encoders were fit on (e.g. "DEBIT"/"CREDIT", "ATM"/"BRANCH"/"ONLINE").
export const TRANSACTION_TYPE_OPTIONS = [
    { value: "DEBIT", label: "Debit" },
    { value: "CREDIT", label: "Credit" },
];
export const CHANNEL_OPTIONS = [
    { value: "ATM", label: "ATM" },
    { value: "BRANCH", label: "Branch" },
    { value: "ONLINE", label: "Online" },
];
export const OCCUPATIONS = ["Doctor", "Student", "Engineer", "Retired","Manager","Teacher","Accountant","Nurse","Analyst","Architect"];
