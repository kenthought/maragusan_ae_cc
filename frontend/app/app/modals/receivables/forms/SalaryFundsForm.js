import { useState, Fragment } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function SalaryFundsForm(props) {
  const { optionsData, inputData, handleInputChange, isEditing } = props;
  const [bank] = useState(optionsData.bank);
  const [funds] = useState([{ id: 1, label: "GCash" }]);

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Salary ATM Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="bank_account_name"
            name="bank_account_name"
            label="Bank account name"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.bank_account_name || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="bank_account_number"
            name="bank_account_number"
            label="Bank account number"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.bank_account_number || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="bank"
            name="bank"
            label="Bank"
            select
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.bank
                  ? inputData.bank.id
                  : ""
                : inputData.bank || ""
            }
            onChange={handleInputChange}
          >
            {bank.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.bank}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="bank_branch"
            name="bank_branch"
            label="Bank branch"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.bank_branch || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="card_number"
            name="card_number"
            label="Card number"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.card_number || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="card_pin"
            name="card_pin"
            label="Card Pin"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.card_pin || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Typography variant="h6" marginTop={4} gutterBottom>
        Funds Transfer Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="send_to"
            name="send_to"
            label="Send to"
            select
            size="small"
            variant="standard"
            value={inputData.send_to || ""}
            onChange={handleInputChange}
          >
            {funds.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="funds_registered_name"
            name="funds_registered_name"
            label="Registered name"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.funds_registered_name || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="funds_account_number"
            name="funds_account_number"
            label="Account/Mobile number"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.funds_account_number || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}
SalaryFundsForm.propTypes = {
  optionsData: PropTypes.object.isRequired,
};
