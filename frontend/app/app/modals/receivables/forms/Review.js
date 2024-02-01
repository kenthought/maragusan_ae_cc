import { useEffect, Fragment } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const keys = [
  { key: "account_name", label: "Account Name" },
  { key: "spouse_name", label: "Spouse Name" },
  { key: "credit_terms", label: "Credit Terms" },
  { key: "credit_limit", label: "Credit Limit" },
  { key: "contact_number1", label: "Contact number 1" },
  { key: "contact_number2", label: "Contact Number 2" },
  { key: "purok_street", label: "Purok Street" },
  { key: "barangay", label: "Barangay" },
  { key: "account_category", label: "Account Category" },
  { key: "account_status", label: "Account Status" },
  { key: "co_maker", label: "Co-maker" },
  { key: "agent", label: "Agent" },
  { key: "company", label: "Company" },
  { key: "supervisor", label: "Supervisor" },
  { key: "assignment", label: "Assignment" },
  { key: "date_hired", label: "Date hired" },
  { key: "company_id", label: "Company ID" },
  { key: "company_id_number", label: "Company ID number" },
  { key: "work_contact_number", label: "Work contact number" },
  { key: "employment_status", label: "Employment Status" },
  { key: "bank_account_name", label: "Bank Account Name" },
  { key: "bank_account_number", label: "Bank Account Number" },
  { key: "bank", label: "Bank" },
  { key: "bank_branch", label: "Bank branch" },
  { key: "card_number", label: "Card number" },
  { key: "card_pin", label: "Card Pin" },
  { key: "send_to", label: "Send to" },
  { key: "funds_registered_name", label: "Registered name" },
  { key: "funds_account_number", label: "Funds Account number" },
];

export default function Review(props) {
  const { inputData, optionsData, countError, setCountError, isEditing } =
    props;
  const { barangay, bank, company, users } = optionsData;
  const creditTerms = [
    { id: 1, value: 1 },
    { id: 2, value: 7 },
    { id: 3, value: 15 },
    { id: 4, value: 21 },
    { id: 5, value: 30 },
    { id: 6, value: 45 },
    { id: 7, value: 60 },
  ];
  const employmentStatus = [
    { id: 1, label: "Regular" },
    { id: 2, label: "Provisional" },
    { id: 3, label: "Contractual" },
  ];
  const accountCategory = [
    { id: 1, label: "Employee" },
    { id: 2, label: "Funds" },
    { id: 3, label: "Temp charge" },
    { id: 4, label: "Customer" },
  ];
  const funds = [{ id: 1, label: "GCash" }];

  useEffect(() => {
    setCountError(0);
    //ugly code
    keys.map((data) => {
      if (!inputData[data.key])
        setCountError((count) => {
          return (count += 1);
        });
    });

    console.log("Error Count: ", countError);
    console.log(inputData);
    console.log("isEditing", isEditing);
  }, [inputData]);

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Account Information
      </Typography>
      <Typography gutterBottom>Personal</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Control number"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.control_number}
            error={!inputData.control_number}
            helperText={!inputData.control_number ? "Empty value" : ""}
            readOnly
            disabled={!inputData.control_number}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Account name"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.account_name}
            error={!inputData.account_name}
            helperText={!inputData.account_name ? "Empty value" : ""}
            readOnly
            disabled={!inputData.account_name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Spouse name"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.spouse_name}
            error={!inputData.spouse_name}
            helperText={!inputData.spouse_name ? "Empty value" : ""}
            readOnly
            disabled={!inputData.spouse_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Credit Terms"
            size="small"
            variant="standard"
            value={
              inputData.credit_terms
                ? creditTerms.find((x) => x.id == inputData.credit_terms).value
                : ""
            }
            error={!inputData.credit_terms}
            helperText={!inputData.credit_terms ? "Empty value" : ""}
            readOnly
            disabled={!inputData.credit_terms}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Credit Limit"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.credit_limit}
            error={!inputData.credit_limit}
            helperText={!inputData.credit_limit ? "Empty value" : ""}
            readOnly
            disabled={!inputData.credit_limit}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact number 1"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.contact_number1}
            error={!inputData.contact_number1}
            helperText={!inputData.contact_number1 ? "Empty value" : ""}
            readOnly
            disabled={!inputData.contact_number1}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact number 2"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.contact_number2}
            readOnly
            disabled={!inputData.contact_number2}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Account category"
            size="small"
            variant="standard"
            value={
              inputData.account_category
                ? accountCategory.find(
                    (x) => x.id == inputData.account_category
                  ).label
                : ""
            }
            error={!inputData.account_category}
            helperText={!inputData.account_category ? "Empty value" : ""}
            readOnly
            disabled={!inputData.account_category}
          />
        </Grid>
      </Grid>
      <Typography marginTop={4} gutterBottom>
        Address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Purok/Street"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.purok_street}
            error={!inputData.purok_street}
            helperText={!inputData.purok_street ? "Empty value" : ""}
            readOnly
            disabled={!inputData.purok_street}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            label="Barangay"
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.barangay.id
                  ? barangay.find((x) => x.id == inputData.barangay.id)
                      .barangay +
                    ", " +
                    barangay.find((x) => x.id == inputData.barangay.id)
                      .municipality.municipality +
                    ", " +
                    barangay.find((x) => x.id == inputData.barangay.id)
                      .municipality.province.province
                  : inputData.barangay
                  ? barangay.find((x) => x.id == inputData.barangay).barangay +
                    ", " +
                    barangay.find((x) => x.id == inputData.barangay)
                      .municipality.municipality +
                    ", " +
                    barangay.find((x) => x.id == inputData.barangay)
                      .municipality.province.province
                  : ""
                : inputData.barangay
                ? barangay.find((x) => x.id == inputData.barangay).barangay +
                  ", " +
                  barangay.find((x) => x.id == inputData.barangay).municipality
                    .municipality +
                  ", " +
                  barangay.find((x) => x.id == inputData.barangay).municipality
                    .province.province
                : ""
            }
            error={!inputData.barangay}
            helperText={!inputData.barangay ? "Empty value" : ""}
            readOnly
            disabled={!inputData.barangay}
          />
        </Grid>
      </Grid>
      <Typography marginTop={4} gutterBottom>
        Co-maker/Agent
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Co-maker"
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.co_maker.id
                  ? users.find((x) => x.id == inputData.co_maker.id).first_name
                  : inputData.co_maker
                  ? users.find((x) => x.id == inputData.co_maker).first_name
                  : ""
                : inputData.co_maker
                ? users.find((x) => x.id == inputData.co_maker).first_name
                : ""
            }
            error={!inputData.co_maker}
            helperText={!inputData.co_maker ? "Empty value" : ""}
            readOnly
            disabled={!inputData.co_maker}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Agent"
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.agent.id
                  ? users.find((x) => x.id == inputData.agent.id).first_name
                  : inputData.agent
                  ? users.find((x) => x.id == inputData.agent).first_name
                  : ""
                : inputData.agent
                ? users.find((x) => x.id == inputData.agent).first_name
                : ""
            }
            error={!inputData.agent}
            helperText={!inputData.agent ? "Empty value" : ""}
            readOnly
            disabled={!inputData.agent}
          />
        </Grid>
      </Grid>
      <Typography variant="h6" mt={4} gutterBottom>
        Work Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Company"
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.company.id
                  ? company.find((x) => x.id == inputData.company.id).company
                  : inputData.company
                  ? company.find((x) => x.id == inputData.company).company
                  : ""
                : inputData.company
                ? company.find((x) => x.id == inputData.company).company
                : ""
            }
            error={!inputData.company}
            helperText={!inputData.company ? "Empty value" : ""}
            readOnly
            disabled={!inputData.company}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Supervisor"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.supervisor}
            error={!inputData.supervisor}
            helperText={!inputData.supervisor ? "Empty value" : ""}
            readOnly
            disabled={!inputData.supervisor}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Assignment"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.assignment}
            error={!inputData.assignment}
            helperText={!inputData.assignment ? "Empty value" : ""}
            readOnly
            disabled={!inputData.assignment}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={inputData.date_hired ? dayjs(inputData.date_hired) : null}
              readOnly
              disabled={!inputData.date_hired}
              slotProps={{
                textField: {
                  label: "Date hired",
                  size: "small",
                  variant: "standard",
                  fullWidth: true,
                  error: !inputData.date_hired,
                  helperText: !inputData.date_hired ? "Empty value" : "",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Company ID"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.company_id_number}
            error={!inputData.company_id_number}
            helperText={!inputData.company_id_number ? "Empty value" : ""}
            readOnly
            disabled={!inputData.company_id_number}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Contact number"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.work_contact_number}
            error={!inputData.work_contact_number}
            helperText={!inputData.work_contact_number ? "Empty value" : ""}
            readOnly
            disabled={!inputData.work_contact_number}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Employment status"
            size="small"
            variant="standard"
            value={
              inputData.employment_status
                ? employmentStatus.find(
                    (x) => x.id == inputData.employment_status
                  ).label
                : ""
            }
            error={!inputData.employment_status}
            helperText={!inputData.employment_status ? "Empty value" : ""}
            readOnly
            disabled={!inputData.employment_status}
          />
        </Grid>
      </Grid>
      <Typography variant="h6" mt={4} gutterBottom>
        Salary ATM Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Bank account name"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.bank_account_name}
            error={!inputData.bank_account_name}
            helperText={!inputData.bank_account_name ? "Empty value" : ""}
            readOnly
            disabled={!inputData.bank_account_name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Bank account number"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.bank_account_number}
            error={!inputData.bank_account_number}
            helperText={!inputData.bank_account_number ? "Empty value" : ""}
            readOnly
            disabled={!inputData.bank_account_number}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Bank"
            variant="standard"
            value={
              isEditing
                ? inputData.bank.id
                  ? bank.find((x) => x.id == inputData.bank.id).bank
                  : inputData.bank
                  ? bank.find((x) => x.id == inputData.bank).bank
                  : ""
                : inputData.bank
                ? bank.find((x) => x.id == inputData.bank).bank
                : ""
            }
            error={!inputData.bank}
            helperText={!inputData.bank ? "Empty value" : ""}
            readOnly
            disabled={!inputData.bank}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Bank branch"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.bank_branch}
            error={!inputData.bank_branch}
            helperText={!inputData.bank_branch ? "Empty value" : ""}
            readOnly
            disabled={!inputData.bank_branch}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Card number"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.card_number}
            error={!inputData.card_number}
            helperText={!inputData.card_number ? "Empty value" : ""}
            readOnly
            disabled={!inputData.card_number}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Card Pin"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.card_pin}
            error={!inputData.card_pin}
            helperText={!inputData.card_pin ? "Empty value" : ""}
            readOnly
            disabled={!inputData.card_pin}
          />
        </Grid>
      </Grid>
      <Typography variant="h6" marginTop={4} gutterBottom>
        Funds Transfer Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Send to"
            size="small"
            variant="standard"
            value={
              inputData.send_to
                ? funds.find((x) => x.id == inputData.send_to).label
                : ""
            }
            error={!inputData.send_to}
            helperText={!inputData.send_to ? "Empty value" : ""}
            readOnly
            disabled={!inputData.send_to}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Registered name"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.funds_registered_name}
            error={!inputData.funds_registered_name}
            helperText={!inputData.funds_registered_name ? "Empty value" : ""}
            readOnly
            disabled={!inputData.funds_registered_name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Account/Mobile number"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.funds_account_number}
            error={!inputData.funds_account_number}
            helperText={!inputData.funds_account_number ? "Empty value" : ""}
            readOnly
            disabled={!inputData.funds_account_number}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}
