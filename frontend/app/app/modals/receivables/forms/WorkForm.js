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

export default function WorkForm(props) {
  const { optionsData, inputData, handleInputChange, isEditing } = props;
  const [company] = useState(optionsData.company);
  const [employmentStatus] = useState([
    { id: 1, label: "Regular" },
    { id: 2, label: "Provisional" },
    { id: 3, label: "Contractual" },
  ]);

  return (
    <Fragment>
      <Typography variant="h6" gutterBottom>
        Work Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="company"
            name="company"
            label="Company"
            select
            size="small"
            variant="standard"
            value={
              isEditing
                ? inputData.company
                  ? inputData.company.id
                  : ""
                : inputData.company || ""
            }
            onChange={handleInputChange}
            readOnly={isEditing}
          >
            {company.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.company}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="supervisor"
            name="supervisor"
            label="Supervisor"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.supervisor || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="assignment"
            name="assignment"
            label="Assignment"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.assignment || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={inputData.date_hired ? dayjs(inputData.date_hired) : ""}
              onChange={(newValue) => {
                inputData.date_hired = new Date(newValue);
                handleInputChange;
              }}
              slotProps={{
                textField: {
                  id: "date_hired",
                  name: "date_hired",
                  label: "Date hired",
                  size: "small",
                  variant: "standard",
                  fullWidth: true,
                  required: true,
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="company_id_number"
            name="company_id_number"
            label="Company ID"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.company_id_number || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="work_contact_number"
            name="work_contact_number"
            label="Contact number"
            fullWidth
            variant="standard"
            size="small"
            value={inputData.work_contact_number || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="employment_status"
            name="employment_status"
            label="Employment status"
            select
            size="small"
            variant="standard"
            value={inputData.employment_status || ""}
            onChange={handleInputChange}
          >
            {employmentStatus.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Fragment>
  );
}
WorkForm.propTypes = {
  optionsData: PropTypes.object.isRequired,
};
