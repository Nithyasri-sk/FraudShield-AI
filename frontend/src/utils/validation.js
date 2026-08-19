const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateTransactionInput(values) {
    const errors = {};
    if (!values.TransactionID || values.TransactionID.trim().length === 0) {
        errors.TransactionID = "Enter a transaction ID.";
    }
    if (!values.AccountID || values.AccountID.trim().length === 0) {
        errors.AccountID = "Enter an account ID.";
    }
    if (!values.TransactionDate) {
        errors.TransactionDate = "Transaction date & time is required.";
    }
    if (!values.PreviousTransactionDate) {
        errors.PreviousTransactionDate = "Previous transaction date & time is required.";
    }
    if (values.TransactionDate &&
        values.PreviousTransactionDate &&
        new Date(values.PreviousTransactionDate).getTime() > new Date(values.TransactionDate).getTime()) {
        errors.PreviousTransactionDate = "Previous transaction can't be later than the current one.";
    }
    if (values.LoginAttempts === undefined || values.LoginAttempts === null || Number.isNaN(values.LoginAttempts)) {
        errors.LoginAttempts = "Enter number of login attempts.";
    }
    else if (!Number.isInteger(values.LoginAttempts) || values.LoginAttempts < 0) {
        errors.LoginAttempts = "Must be a whole number, 0 or greater.";
    }
    if (!values.UserName || values.UserName.trim().length === 0) {
        errors.UserName = "Enter a username.";
    }
    if (!values.Email || values.Email.trim().length === 0) {
        errors.Email = "Enter an email address.";
    }
    else if (!EMAIL_RE.test(values.Email)) {
        errors.Email = "Enter a valid email address.";
    }
    if (!values.DateOfBirth) {
        errors.DateOfBirth = "Date of birth is required.";
    }
    if (!values.DeviceID || values.DeviceID.trim().length === 0) {
        errors.DeviceID = "Enter a device ID.";
    }
    if (values.TransactionAmount === undefined || values.TransactionAmount === null || Number.isNaN(values.TransactionAmount)) {
        errors.TransactionAmount = "Enter a transaction amount.";
    }
    else if (values.TransactionAmount < 0) {
        errors.TransactionAmount = "Amount must be 0 or greater.";
    }
    if (!values.TransactionType) {
        errors.TransactionType = "Select a transaction type.";
    }
    if (!values.Location || values.Location.trim().length === 0) {
        errors.Location = "Enter a location.";
    }
    if (!values.Channel) {
        errors.Channel = "Select a channel.";
    }
    if (values.CustomerAge === undefined || values.CustomerAge === null || Number.isNaN(values.CustomerAge)) {
        errors.CustomerAge = "Enter customer age.";
    }
    else if (values.CustomerAge < 16 || values.CustomerAge > 110) {
        errors.CustomerAge = "Enter an age between 16 and 110.";
    }
    if (!values.CustomerOccupation) {
        errors.CustomerOccupation = "Select an occupation.";
    }
    if (values.AccountBalance === undefined || values.AccountBalance === null || Number.isNaN(values.AccountBalance)) {
        errors.AccountBalance = "Enter account balance.";
    }
    else if (values.AccountBalance < 0) {
        errors.AccountBalance = "Balance cannot be negative.";
    }
    if (values.AnnualIncome === undefined || values.AnnualIncome === null || Number.isNaN(values.AnnualIncome)) {
        errors.AnnualIncome = "Enter annual income.";
    }
    else if (values.AnnualIncome < 0) {
        errors.AnnualIncome = "Annual income cannot be negative.";
    }
    if (values.CurrentAddressMonthCount === undefined ||
        values.CurrentAddressMonthCount === null ||
        Number.isNaN(values.CurrentAddressMonthCount)) {
        errors.CurrentAddressMonthCount = "Enter current address month count.";
    }
    else if (!Number.isInteger(values.CurrentAddressMonthCount)) {
        errors.CurrentAddressMonthCount = "Must be a whole number.";
    }
    if (values.PreviousAddressMonthCount === undefined ||
        values.PreviousAddressMonthCount === null ||
        Number.isNaN(values.PreviousAddressMonthCount)) {
        errors.PreviousAddressMonthCount = "Enter previous address month count.";
    }
    else if (!Number.isInteger(values.PreviousAddressMonthCount)) {
        errors.PreviousAddressMonthCount = "Must be a whole number.";
    }
    return errors;
}
export function isFormValid(errors) {
    return Object.keys(errors).length === 0;
}
