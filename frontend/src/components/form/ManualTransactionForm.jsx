import { useState } from "react";
import { CreditCard, User, ShieldQuestion, Smartphone, KeyRound, CalendarClock, Calendar, Sparkles, ScanLine, Hash, Mail, DollarSign, Home, MapPin, } from "lucide-react";
import { Field } from "../ui/Field";
import { TextInput } from "../ui/TextInput";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { FormSection } from "./FormSection";
import { CHANNEL_OPTIONS, OCCUPATIONS, TRANSACTION_TYPE_OPTIONS } from "../../data/referenceData";
import { getSampleTransaction } from "../../data/sampleTransaction";
import { validateTransactionInput, isFormValid } from "../../utils/validation";
const EMPTY_FORM = {
    TransactionType: undefined,
    Channel: undefined,
    CustomerOccupation: undefined,
};
/**
 * Manual entry mode for the Analyze Transaction page. Collects the exact
 * 19 raw fields the fraud detection backend expects and hands the
 * validated payload to `onSubmit` — it never talks to the API layer
 * directly, so backend wiring lives entirely in services/fraudApi.ts.
 */
export function ManualTransactionForm({ onSubmit, submitting }) {
    const [values, setValues] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(false);
    const [isSample, setIsSample] = useState(false);
    function update(key, value) {
        setValues((prev) => ({ ...prev, [key]: value }));
        setIsSample(false);
    }
    function handleLoadSample() {
        setValues(getSampleTransaction());
        setErrors({});
        setIsSample(true);
    }
    function handleSubmit(e) {
        e.preventDefault();
        setTouched(true);
        const validation = validateTransactionInput(values);
        setErrors(validation);
        if (!isFormValid(validation))
            return;
        onSubmit(values);
    }
    const err = touched ? errors : {};
    return (<form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {isSample && (<div className="animate-fade-up flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-300">
          <Sparkles size={14}/>
          Sample data loaded for demo purposes — review before analyzing.
        </div>)}

      <FormSection icon={<CreditCard size={17}/>} title="Transaction Details" subtitle="What the transaction was">
        <Field label="Transaction ID" htmlFor="TransactionID" required error={err.TransactionID}>
          <TextInput id="TransactionID" icon={<Hash size={15}/>} placeholder="TX000001" value={values.TransactionID ?? ""} onChange={(e) => update("TransactionID", e.target.value)} error={!!err.TransactionID}/>
        </Field>

        <Field label="Account ID" htmlFor="AccountID" required error={err.AccountID}>
          <TextInput id="AccountID" icon={<CreditCard size={15}/>} placeholder="AC060" value={values.AccountID ?? ""} onChange={(e) => update("AccountID", e.target.value)} error={!!err.AccountID}/>
        </Field>

        <Field label="Transaction Amount" htmlFor="TransactionAmount" required error={err.TransactionAmount}>
          <TextInput id="TransactionAmount" type="number" min={0} step="0.01" prefix="$" placeholder="2500.00" value={values.TransactionAmount ?? ""} onChange={(e) => update("TransactionAmount", e.target.value === "" ? undefined : Number(e.target.value))} error={!!err.TransactionAmount}/>
        </Field>

        <Field label="Transaction Type" htmlFor="TransactionType" required error={err.TransactionType}>
          <Select id="TransactionType" placeholder="Select type" options={TRANSACTION_TYPE_OPTIONS} value={values.TransactionType ?? ""} onChange={(e) => update("TransactionType", e.target.value)} error={!!err.TransactionType}/>
        </Field>

        <Field label="Channel" htmlFor="Channel" required error={err.Channel}>
          <Select id="Channel" placeholder="Select channel" options={CHANNEL_OPTIONS} value={values.Channel ?? ""} onChange={(e) => update("Channel", e.target.value)} error={!!err.Channel}/>
        </Field>

        <Field label="Location" htmlFor="Location" required error={err.Location} helperText="Postal / location code, e.g. 37201.">
          <TextInput id="Location" icon={<MapPin size={15}/>} placeholder="37201" value={values.Location ?? ""} onChange={(e) => update("Location", e.target.value)} error={!!err.Location}/>
        </Field>

        <Field label="Transaction Date & Time" htmlFor="TransactionDate" required error={err.TransactionDate}>
          <TextInput id="TransactionDate" type="datetime-local" icon={<CalendarClock size={15}/>} value={values.TransactionDate ?? ""} onChange={(e) => update("TransactionDate", e.target.value)} error={!!err.TransactionDate}/>
        </Field>

        <Field label="Previous Transaction Date & Time" htmlFor="PreviousTransactionDate" required error={err.PreviousTransactionDate}>
          <TextInput id="PreviousTransactionDate" type="datetime-local" icon={<CalendarClock size={15}/>} value={values.PreviousTransactionDate ?? ""} onChange={(e) => update("PreviousTransactionDate", e.target.value)} error={!!err.PreviousTransactionDate}/>
        </Field>
      </FormSection>

      <FormSection icon={<User size={17}/>} title="Customer Details" subtitle="Who is making the transaction">
        <Field label="Username" htmlFor="UserName" required error={err.UserName}>
          <TextInput id="UserName" icon={<User size={15}/>} placeholder="matthew.jackson242" value={values.UserName ?? ""} onChange={(e) => update("UserName", e.target.value)} error={!!err.UserName}/>
        </Field>

        <Field label="Email" htmlFor="Email" required error={err.Email}>
          <TextInput id="Email" type="email" icon={<Mail size={15}/>} placeholder="user@example.com" value={values.Email ?? ""} onChange={(e) => update("Email", e.target.value)} error={!!err.Email}/>
        </Field>

        <Field label="Date of Birth" htmlFor="DateOfBirth" required error={err.DateOfBirth}>
          <TextInput id="DateOfBirth" type="date" icon={<Calendar size={15}/>} value={values.DateOfBirth ?? ""} onChange={(e) => update("DateOfBirth", e.target.value)} error={!!err.DateOfBirth}/>
        </Field>

        <Field label="Customer Age" htmlFor="CustomerAge" required error={err.CustomerAge}>
          <TextInput id="CustomerAge" type="number" min={16} max={110} placeholder="32" value={values.CustomerAge ?? ""} onChange={(e) => update("CustomerAge", e.target.value === "" ? undefined : Number(e.target.value))} error={!!err.CustomerAge}/>
        </Field>

        <Field label="Customer Occupation" htmlFor="CustomerOccupation" required error={err.CustomerOccupation}>
          <Select id="CustomerOccupation" placeholder="Select occupation" options={OCCUPATIONS.map((o) => ({ value: o, label: o }))} value={values.CustomerOccupation ?? ""} onChange={(e) => update("CustomerOccupation", e.target.value)} error={!!err.CustomerOccupation}/>
        </Field>

        <Field label="Annual Income" htmlFor="AnnualIncome" required error={err.AnnualIncome}>
          <TextInput id="AnnualIncome" type="number" min={0} step="0.01" icon={<DollarSign size={15}/>} placeholder="65000" value={values.AnnualIncome ?? ""} onChange={(e) => update("AnnualIncome", e.target.value === "" ? undefined : Number(e.target.value))} error={!!err.AnnualIncome}/>
        </Field>

        <Field label="Current Address (months)" htmlFor="CurrentAddressMonthCount" required error={err.CurrentAddressMonthCount} helperText="Months at current address.">
          <TextInput id="CurrentAddressMonthCount" type="number" step={1} icon={<Home size={15}/>} placeholder="24" value={values.CurrentAddressMonthCount ?? ""} onChange={(e) => update("CurrentAddressMonthCount", e.target.value === "" ? undefined : Number(e.target.value))} error={!!err.CurrentAddressMonthCount}/>
        </Field>

        <Field label="Previous Address (months)" htmlFor="PreviousAddressMonthCount" required error={err.PreviousAddressMonthCount} helperText="Months at previous address.">
          <TextInput id="PreviousAddressMonthCount" type="number" step={1} icon={<Home size={15}/>} placeholder="10" value={values.PreviousAddressMonthCount ?? ""} onChange={(e) => update("PreviousAddressMonthCount", e.target.value === "" ? undefined : Number(e.target.value))} error={!!err.PreviousAddressMonthCount}/>
        </Field>
      </FormSection>

      <FormSection icon={<ShieldQuestion size={17}/>} title="Security & Account Context" subtitle="Signals used to assess transaction risk">
        <Field label="Device ID" htmlFor="DeviceID" required error={err.DeviceID}>
          <TextInput id="DeviceID" icon={<Smartphone size={15}/>} placeholder="D000428" value={values.DeviceID ?? ""} onChange={(e) => update("DeviceID", e.target.value)} error={!!err.DeviceID}/>
        </Field>

        <Field label="Login Attempts" htmlFor="LoginAttempts" required error={err.LoginAttempts}>
          <TextInput id="LoginAttempts" type="number" min={0} step={1} icon={<KeyRound size={15}/>} placeholder="1" value={values.LoginAttempts ?? ""} onChange={(e) => update("LoginAttempts", e.target.value === "" ? undefined : Number(e.target.value))} error={!!err.LoginAttempts}/>
        </Field>

        <Field label="Account Balance" htmlFor="AccountBalance" required error={err.AccountBalance}>
          <TextInput id="AccountBalance" type="number" min={0} step="0.01" prefix="$" placeholder="15000.00" value={values.AccountBalance ?? ""} onChange={(e) => update("AccountBalance", e.target.value === "" ? undefined : Number(e.target.value))} error={!!err.AccountBalance}/>
        </Field>
      </FormSection>

      <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <Button type="button" variant="secondary" icon={<Sparkles size={16}/>} onClick={handleLoadSample} disabled={submitting}>
          Load Sample Transaction
        </Button>
        <Button type="submit" size="lg" icon={<ScanLine size={18}/>} loading={submitting} disabled={submitting}>
          {submitting ? "Analyzing transaction…" : "Analyze Transaction"}
        </Button>
      </div>
    </form>);
}
