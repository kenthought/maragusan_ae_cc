import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import { useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function UserDialog(props) {
  const {
    openUserDialog,
    setOpenUserDialog,
    setIsSuccess,
    setSuccessText,
    mutate,
    isEditing,
    setIsEditing,
    editData,
  } = props;
  const {
    data: municipality,
    error: municipality_error,
    isLoading: municipality_isLoading,
  } = useSWR("components/municipality", fetcher);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [newData, setNewData] = useState({});
  const [municipalityData, setMunicipalityData] = useState(null);
  const [userAccess, setUserAccess] = useState("");
  const [grantedAccess, setGrantedAccess] = useState({
    assets: false,
    bank_accounts: false,
    components: false,
    expenses: false,
    owners_equity: false,
    payables: false,
    receivables: false,
  });

  useEffect(() => {
    setNewData(editData);
    if (isEditing) setMunicipalityData(editData.municipality);
  }, [editData, isEditing]);

  useEffect(() => {
    console.log(userAccess);
  }, [userAccess]);

  const handleEditChange = (event) => {
    const value = event.target.value;
    setNewData({ ...newData, [event.target.name]: value });
  };

  const handleUserAccessChange = (event) => {
    setUserAccess(event.target.value);
  };

  const handleGrantedAccessChange = (event) => {
    setGrantedAccess({
      ...grantedAccess,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClose = () => {
    setOpenUserDialog(false);
    setIsEditing(false);
    setMunicipalityData(null);
  };

  const handleSuccessful = (bool, text) => {
    setIsError(false);
    setIsSuccess(bool);
    setSuccessText(text);
    mutate();
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") == data.get("current_password")) {
      const postData = {
        username: data.get("username"),
        password: data.get("password"),
        first_name: data.get("first_name"),
        middle_name: data.get("middle_name"),
        last_name: data.get("last_name"),
        business_code: data.get("business_code"),
        branch: municipalityData.id,
        is_staff: userAccess == "admin" ? true : false,
        is_admin: userAccess == "admin" ? true : false,
        granted_access: userAccess == "admin" ? null : grantedAccess,
      };

      if (!isEditing) {
        console.log("Submit", postData);

        axiosInstance
          .post("users/register/", postData)
          .then((response) => {
            handleSuccessful(true, "User created!");
            console.log(response);
          })
          .catch((response) => {
            console.log("ERROR", response);
            setIsError(true);
            setErrorText(response.message);
          });
      }
    } else {
      setIsError(true);
      setErrorText("Password does not match!");
    }
  };

  if (municipality_isLoading) return;

  return (
    <Dialog open={openUserDialog} onClose={handleClose} fullWidth>
      <DialogTitle>{!isEditing ? "Add User" : "Edit User"}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">User Credentials</Typography>
          {/* Username */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="username"
              label="Username"
              name="username"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={newData.username || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {/* Password */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="password"
              label="Password"
              name="password"
              value={newData.password || ""}
              onChange={handleEditChange}
              type="password"
              size="small"
            />
          )}
          {/* Current Password */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="current_password"
              label="Current Password"
              name="current_password"
              type="password"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="current_password"
              label="Current Password"
              name="current_password"
              value={newData.current_password || ""}
              onChange={handleEditChange}
              type="password"
              size="small"
            />
          )}
          <Typography color="primary" mt={2}>
            User Information
          </Typography>
          {/* First name */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="first_name"
              label="First name"
              name="first_name"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="first_name"
              label="First name"
              name="first_name"
              value={newData.first_name || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {/* Middle name */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="middle_name"
              label="Middle name"
              name="middle_name"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="middle_name"
              label="Middle name"
              name="middle_name"
              value={newData.middle_name || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {/* Last name */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="last_name"
              label="Last name"
              name="last_name"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="last_name"
              label="Last name"
              name="last_name"
              value={newData.last_name || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {/* Business code */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="business_code"
              label="Business code"
              name="business_code"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="business_code"
              label="Business code"
              name="business_code"
              value={newData.business_code || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {/* Branch */}
          {!isEditing ? (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.municipality}
              options={municipality}
              size="small"
              onChange={(event, newInputValue) => {
                if (newInputValue != null) setMunicipalityData(newInputValue);
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.municipality}
                  </li>
                );
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                  />
                ));
              }}
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  required
                  id="branch"
                  label="Branch"
                  name="branch"
                  fullWidth
                  {...params}
                />
              )}
            />
          ) : (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.municipality}
              options={municipality}
              size="small"
              value={newData.municipality || null}
              onChange={(event, newInputValue) => {
                setMunicipalityData(newInputValue);
              }}
              inputValue={municipalityData ? municipalityData.municipality : ""}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.municipality}
                  </li>
                );
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                  />
                ));
              }}
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  required
                  id="branch"
                  label="Branch"
                  name="branch"
                  fullWidth
                  {...params}
                />
              )}
            />
          )}
          {/* Access */}
          <Typography color="primary" mt={2}>
            User Access
          </Typography>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={userAccess}
              onChange={handleUserAccessChange}
              required
            >
              <FormControlLabel value="user" control={<Radio />} label="User" />
              <FormControlLabel
                value="admin"
                control={<Radio />}
                label="Admin"
              />
            </RadioGroup>
          </FormControl>
          {userAccess == "user" && (
            <Box sx={{ p: 1 }}>
              <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Grant access</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={grantedAccess.assets}
                        onChange={handleGrantedAccessChange}
                        name="assets"
                      />
                    }
                    label="Assets"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={grantedAccess.bank_accounts}
                        onChange={handleGrantedAccessChange}
                        name="bank_accounts"
                      />
                    }
                    label="Bank accounts"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={grantedAccess.components}
                        onChange={handleGrantedAccessChange}
                        name="components"
                      />
                    }
                    label="Components"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={grantedAccess.expenses}
                        onChange={handleGrantedAccessChange}
                        name="expenses"
                      />
                    }
                    label="Expenses"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={grantedAccess.owners_equity}
                        onChange={handleGrantedAccessChange}
                        name="owners_equity"
                      />
                    }
                    label="Owner's equity"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={grantedAccess.payables}
                        onChange={handleGrantedAccessChange}
                        name="payables"
                      />
                    }
                    label="Payables"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={grantedAccess.receivables}
                        onChange={handleGrantedAccessChange}
                        name="receivables"
                      />
                    }
                    label="Receivables"
                  />
                </FormGroup>
              </FormControl>
            </Box>
          )}
          {isError ? <Alert severity="error">{errorText}</Alert> : <></>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="success">
            Add
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
