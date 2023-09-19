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

export default function Review(props) {
  const { inputData, optionsData, countError, setCountError, isEditing } =
    props;
  const { barangay, municipality, province, bank, company } = optionsData;
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
    { id: 1, label: "Contractual" },
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
    if (!inputData.control_number)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.account_name)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.spouse_name)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.credit_terms)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.credit_limit)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.contact_number1)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.purok_street)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.barangay)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.municipality)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.province)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.co_maker)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.agent)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.company)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.supervisor)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.assignment)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.date_hired)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.company_id_number)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.work_contact_number)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.employment_status)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.bank_account_name)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.bank_account_number)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.bank)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.bank_branch)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.card_number)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.card_pin)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.send_to)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.funds_registered_name)
      setCountError((data) => {
        return (data += 1);
      });
    if (!inputData.funds_account_number)
      setCountError((data) => {
        return (data += 1);
      });

    console.log("123123", countError);
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
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Barangay"
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.barangay
                  ? barangay.find((x) => x.id == inputData.barangay.id).barangay
                  : ""
                : inputData.barangay
                ? barangay.find((x) => x.id == inputData.barangay).barangay
                : ""
            }
            error={!inputData.barangay}
            helperText={!inputData.barangay ? "Empty value" : ""}
            readOnly
            disabled={!inputData.barangay}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Municipality"
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.municipality
                  ? municipality.find((x) => x.id == inputData.municipality.id)
                      .municipality
                  : ""
                : inputData.municipality
                ? municipality.find((x) => x.id == inputData.municipality)
                    .municipality
                : ""
            }
            error={!inputData.municipality}
            helperText={!inputData.municipality ? "Empty value" : ""}
            readOnly
            disabled={!inputData.municipality}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Province"
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.province
                  ? province.find((x) => x.id == inputData.province.id).province
                  : ""
                : inputData.province
                ? province.find((x) => x.id == inputData.province).province
                : ""
            }
            error={!inputData.province}
            helperText={!inputData.province ? "Empty value" : ""}
            readOnly
            disabled={!inputData.province}
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
                ? inputData.co_maker
                  ? province.find((x) => x.id == inputData.co_maker).province
                  : ""
                : inputData.co_maker
                ? province.find((x) => x.id == inputData.province).province
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
                ? inputData.agent
                  ? province.find((x) => x.id == inputData.agent).province
                  : ""
                : inputData.agent
                ? province.find((x) => x.id == inputData.province).province
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
                ? inputData.company
                  ? company.find((x) => x.id == inputData.company.id).company
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
                ? inputData.bank
                  ? bank.find((x) => x.id == inputData.bank.id).bank
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
