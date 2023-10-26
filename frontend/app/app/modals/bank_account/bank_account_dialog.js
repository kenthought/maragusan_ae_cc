import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import Chip from "@mui/material/Chip";
import { useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function BankAccountDialog(props) {
  const {
    openBankAccountDialog,
    setOpenBankAccountDialog,
    setIsSuccess,
    setSuccessText,
    mutate,
    isEditing,
    setIsEditing,
    editData,
  } = props;
  const {
    data: bank,
    error: bank_error,
    isLoading: bank_isLoading,
  } = useSWR("components/bank", fetcher);
  const {
    data: barangay,
    error: barangay_error,
    isLoading: barangay_isLoading,
  } = useSWR("components/barangay", fetcher);
  const {
    data: municipality,
    error: municipality_error,
    isLoading: municipality_isLoading,
  } = useSWR("components/municipality", fetcher);
  const {
    data: province,
    error: province_error,
    isLoading: province_isLoading,
  } = useSWR("components/province", fetcher);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const { data: session } = useSession();
  const [newData, setNewData] = useState({
    control_number: "",
    account_name: "",
    purok_street: "",
  });
  const [accountType] = useState([
    { id: 1, label: "Current" },
    { id: 2, label: "Savings" },
  ]);
  const [accountStatus] = useState([
    { id: 1, label: "Active" },
    { id: 2, label: "Inactive" },
    { id: 3, label: "Bad Debts" },
  ]);
  const [barangayData, setBarangayData] = useState(null);

  useEffect(() => {
    setNewData(editData);
    if (isEditing) setBarangayData(editData.barangay);
  }, [editData, isEditing]);

  const generateControlNumber = () => {
    var number;
    do {
      number = Math.floor(Math.random() * 9999);
    } while (number < 1);

    return number;
  };

  const handleEditChange = (event) => {
    const value = event.target.value;
    setNewData({ ...newData, [event.target.name]: value });
  };

  const handleClose = () => {
    setOpenBankAccountDialog(false);
    setIsEditing(false);
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
    var postData = {
      control_number: data.get("control_number"),
      account_name: data.get("account_name"),
      account_type: data.get("account_type"),
      bank: data.get("bank"),
      bank_branch: data.get("bank_branch"),
      purok_street: data.get("purok_street"),
      barangay: barangayData.id,
      municipality: barangayData.municipality.id,
      province: barangayData.municipality.province.id,
      account_status: !isEditing ? 1 : data.get("account_status"),
      under_approval: !isEditing ? 1 : 0,
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing) {
      postData.forApproval = {
        type: "Bank Account",
        approval_type: "Add",
        old_data: { ...postData },
        new_data: { ...postData },
        submitted_by: session.user.name[1],
      };
      axiosInstance
        .post("bank_account/", postData)
        .then((response) => {
          handleSuccessful(true, "Submitted for approval!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(response.message);
        });
    } else {
      // axiosInstance
      //   .put("bank_account/" + editData.id + "/", postData)
      //   .then((response) => {
      //     handleSuccessful(true, "Bank Account edited successfully!");
      //     console.log(response);
      //   })
      //   .catch((response) => {
      //     console.log(response);
      //     setIsError(true);
      //     setErrorText(response.message);
      //   });

      const old_data = editData;
      old_data.bank = editData.bank.id;
      old_data.barangay = editData.barangay.id;
      old_data.municipality = editData.municipality.id;
      old_data.province = editData.province.id;

      const forApproval = {
        type: "Bank Account",
        approval_type: "Edit",
        module_id: editData.id,
        account_number: editData.account_number,
        old_data: old_data,
        new_data: postData,
        submitted_by: session.user.name[1],
      };

      axiosInstance
        .post("approvals/", forApproval)
        .then((response) => {
          handleSuccessful(true, "Submitted for approval!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(response.message);
        });
    }
  };

  if (
    barangay_isLoading ||
    municipality_isLoading ||
    province_isLoading ||
    bank_isLoading
  )
    return;

  return (
    <Dialog open={openBankAccountDialog} onClose={handleClose} fullWidth>
      <DialogTitle>
        {!isEditing ? "Add Bank Account" : "Edit Bank Account"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Bank Account Information</Typography>
          {/* Control Number */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="control_number"
              label="Control number"
              name="control_number"
              type="text"
              value={generateControlNumber().toString()}
              size="small"
              autoComplete="off"
              readOnly
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="control_number"
              label="Control number"
              name="control_number"
              value={newData.control_number || ""}
              type="text"
              size="small"
              autoComplete="off"
              readOnly
            />
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Account Name */}
              {!isEditing ? (
                <TextField
                  margin="normal"
                  required
                  autoFocus
                  fullWidth
                  id="account_name"
                  label="Account name"
                  name="account_name"
                  type="text"
                  size="small"
                />
              ) : (
                <TextField
                  margin="normal"
                  required
                  autoFocus
                  fullWidth
                  id="account_name"
                  label="Account name"
                  name="account_name"
                  value={newData.account_name || ""}
                  onChange={handleEditChange}
                  type="text"
                  size="small"
                />
              )}
            </Grid>
          </Grid>
          {/* Account Type */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="account_type"
              name="account_type"
              label="Account Type"
              select
              size="small"
            >
              {accountType.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="account_type"
              name="account_type"
              label="Account Type"
              value={
                accountType[newData.account_type - 1]
                  ? accountType[newData.account_type - 1].id
                  : ""
              }
              onChange={handleEditChange}
              select
              size="small"
            >
              {accountType.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* Bank */}
              {!isEditing ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="bank"
                  name="bank"
                  label="Bank"
                  select
                  error={bank_error}
                  size="small"
                >
                  {bank.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.bank}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="bank"
                  name="bank"
                  label="Bank"
                  value={
                    newData.bank
                      ? newData.bank.id
                        ? newData.bank.id
                        : newData.bank
                      : ""
                  }
                  onChange={handleEditChange}
                  select
                  error={bank_error}
                  size="small"
                >
                  {bank.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.bank}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>
            <Grid item xs={6}>
              {/* Branch */}
              {!isEditing ? (
                <TextField
                  margin="normal"
                  required
                  autoFocus
                  fullWidth
                  id="bank_branch"
                  label="Bank Branch"
                  name="bank_branch"
                  type="text"
                  size="small"
                />
              ) : (
                <TextField
                  margin="normal"
                  required
                  autoFocus
                  fullWidth
                  id="bank_branch"
                  label="Bank Branch"
                  name="bank_branch"
                  value={newData.bank_branch || ""}
                  onChange={handleEditChange}
                  type="text"
                  size="small"
                />
              )}
            </Grid>
          </Grid>
          {/* Account Status */}
          {isEditing && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="account_status"
              name="account_status"
              label="Account Status"
              value={
                accountStatus[newData.account_status - 1]
                  ? accountStatus[newData.account_status - 1].id
                  : ""
              }
              onChange={handleEditChange}
              select
              size="small"
            >
              {accountStatus.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Typography color="secondary" marginTop={1}>
            Address
          </Typography>
          {/* Purok/Street */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="purok_street"
              label="Purok/Street"
              name="purok_street"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="purok_street"
              label="Purok/Street"
              name="purok_street"
              value={newData.purok_street || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {/* Barangay */}
          {!isEditing ? (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.barangay}
              options={barangay}
              size="small"
              onChange={(event, newInputValue) => {
                if (newInputValue != null) setBarangayData(newInputValue);
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.barangay}
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
                  id="barangay"
                  label="Barangay"
                  name="barangay"
                  fullWidth
                  {...params}
                />
              )}
            />
          ) : (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.barangay}
              options={barangay}
              size="small"
              value={newData.barangay || null}
              onChange={(event, newInputValue) => {
                setBarangayData(newInputValue);
              }}
              inputValue={barangayData ? barangayData.barangay : ""}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.barangay}
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
                  id="barangay"
                  label="Barangay"
                  name="barangay"
                  fullWidth
                  {...params}
                />
              )}
            />
          )}
          {/* Municipality */}
          <TextField
            margin="normal"
            fullWidth
            label="Municipality"
            value={barangayData ? barangayData.municipality.municipality : ""}
            onChange={handleEditChange}
            type="text"
            size="small"
            readOnly
          />
          {/* Province */}
          <TextField
            margin="normal"
            fullWidth
            label="Province"
            value={
              barangayData ? barangayData.municipality.province.province : ""
            }
            onChange={handleEditChange}
            type="text"
            size="small"
            readOnly
          />
          {isError ? <Alert severity="error">{errorText}</Alert> : <></>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="success">
            {!isEditing ? "Add" : "Edit"}
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

BankAccountDialog.propTypes = {
  openBankAccountDialog: PropTypes.bool.isRequired,
  setOpenBankAccountDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
};
