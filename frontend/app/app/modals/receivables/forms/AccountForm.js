import { useState, Fragment, useRef } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";

export default function AccountForm(props) {
  const { optionsData, inputData, handleInputChange, isEditing } = props;
  const [creditTerms] = useState([
    { id: 1, value: 1 },
    { id: 2, value: 7 },
    { id: 3, value: 15 },
    { id: 4, value: 21 },
    { id: 5, value: 30 },
    { id: 6, value: 45 },
    { id: 7, value: 60 },
  ]);
  const [accountStatus] = useState([
    { id: 1, label: "Active" },
    { id: 2, label: "Inactive" },
    { id: 3, label: "Bad Debts" },
  ]);
  const [accountCategory] = useState([
    { id: 1, label: "Employee" },
    { id: 2, label: "Funds" },
    { id: 3, label: "Temp charge" },
    { id: 4, label: "Customer" },
  ]);
  const [barangay] = useState(optionsData.barangay);
  const [users] = useState(optionsData.users);
  const [barangayData, setBarangayData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const barangayRef = useRef();

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Account Information
      </Typography>
      <Grid container spacing={3}>
        {/* <Grid item xs={12}>
          <TextField
            id="control_number"
            name="control_number"
            label="Control number"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.control_number || ""}
            onChange={handleInputChange}
            autoComplete="off"
            readOnly
          />
        </Grid> */}
        <Grid item xs={12}>
          <TextField
            required
            id="account_name"
            name="account_name"
            label="Account name"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.account_name || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="spouse_name"
            name="spouse_name"
            label="Spouse name"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.spouse_name || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="credit_terms"
            name="credit_terms"
            label="Credit Terms"
            select
            size="small"
            variant="standard"
            value={inputData.credit_terms || ""}
            onChange={handleInputChange}
          >
            {creditTerms.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="credit_limit"
            name="credit_limit"
            label="Credit Limit"
            required
            fullWidth
            size="small"
            variant="standard"
            value={inputData.credit_limit || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="contact_number1"
            name="contact_number1"
            label="Contact number 1"
            required
            fullWidth
            size="small"
            variant="standard"
            value={inputData.contact_number1 || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="contact_number2"
            name="contact_number2"
            label="Contact number 2"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.contact_number2 || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="account_category"
            name="account_category"
            label="Account category"
            value={inputData.account_category || ""}
            onChange={handleInputChange}
            select
            variant="standard"
            size="small"
          >
            {accountCategory.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Typography variant="h6" marginTop={4} gutterBottom>
        Address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <TextField
            id="purok_street"
            name="purok_street"
            label="Purok/Street"
            fullWidth
            size="small"
            variant="standard"
            value={inputData.purok_street || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          {/* <Autocomplete
            disablePortal
            ref={barangayRef}
            id="barangay"
            name="barangay"
            getOptionLabel={(option) =>
              option.barangay +
              ", " +
              option.municipality.municipality +
              ", " +
              option.municipality.province.province
            }
            options={barangay}
            // value={barangayData}
            onChange={(event, newInputValue) => {
              if (newInputValue != null) {
                setBarangayData(newInputValue);
              }
            }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.barangay +
                    ", " +
                    option.municipality.municipality +
                    ", " +
                    option.municipality.province.province}
                </li>
              );
            }}
            renderTags={(tagValue, getTagProps) => {
              return tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} />
              ));
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                id="barangay"
                name="barangay"
                label="Barangay/Municipality/Province"
                size="small"
                variant="standard"
                {...params}
              />
            )}
          /> */}
          <TextField
            required
            fullWidth
            id="barangay"
            name="barangay"
            label="Barangay/Municipality/Province"
            select
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.barangay
                  ? inputData.barangay.id
                  : ""
                : inputData.barangay || ""
            }
            onChange={handleInputChange}
          >
            {barangay.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.barangay +
                  ", " +
                  option.municipality.municipality +
                  ", " +
                  option.municipality.province.province}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Typography variant="h6" marginTop={4} gutterBottom>
        Co-maker/Agent
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="co_maker"
            name="co_maker"
            label="Co-maker"
            select
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.co_maker
                  ? inputData.co_maker // add id
                  : ""
                : inputData.co_maker || ""
            }
            onChange={handleInputChange}
          >
            {users.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.first_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="agent"
            name="agent"
            label="Agent"
            select
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.agent
                  ? inputData.agent // add id
                  : ""
                : inputData.agent || ""
            }
            onChange={handleInputChange}
          >
            {users.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.first_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {isEditing && (
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="account_status"
              name="account_status"
              label="Account status"
              value={inputData.account_status || ""}
              onChange={handleInputChange}
              select
              size="small"
            >
              {accountStatus.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
}
AccountForm.propTypes = {
  optionsData: PropTypes.object.isRequired,
  inputData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};
