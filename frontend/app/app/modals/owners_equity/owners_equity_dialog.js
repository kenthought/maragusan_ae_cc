import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import { useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function OwnersEquityDialog(props) {
  const {
    openOwnersEquityDialog,
    setOpenOwnersEquityDialog,
    setIsSuccess,
    setSuccessText,
    mutate,
    isEditing,
    setIsEditing,
    editData,
  } = props;
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
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
    { id: 3, label: "Bad Debts", value: false },
  ]);

  useEffect(() => {
    setNewData(editData);
  }, [editData]);

  const handleEditChange = (event) => {
    const value = event.target.value;
    setNewData({ ...newData, [event.target.name]: value });
  };

  const handleClose = () => {
    setOpenOwnersEquityDialog(false);
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
    const postData = {
      control_number: data.get("control_number"),
      account_name: data.get("account_name"),
      purok_street: data.get("purok_street"),
      barangay: data.get("barangay"),
      municipality: data.get("municipality"),
      province: data.get("province"),
      account_status: !isEditing ? 1 : data.get("account_status"),
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing)
      axiosInstance
        .post("owners_equity/", postData)
        .then((response) => {
          handleSuccessful(true, "Owners Equity added successfully!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(response.message);
        });
    else
      axiosInstance
        .put("owners_equity/" + editData.id + "/", postData)
        .then((response) => {
          handleSuccessful(true, "Owners Equity edited successfully!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(response.message);
        });
  };

  if (barangay_isLoading || municipality_isLoading || province_isLoading)
    return;

  return (
    <Dialog open={openOwnersEquityDialog} onClose={handleClose} fullWidth>
      <DialogTitle>
        {!isEditing ? "Add Owners Equity" : "Edit Owners Equity"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Owners Equity Information</Typography>
          {/* Control Number */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="control_number"
              label="Control number"
              name="control_number"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="control_number"
              label="Control number"
              name="control_number"
              value={newData.control_number || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
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
          {/* Account Status */}
          {isEditing && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="account_status"
              name="account_status"
              label="Account status"
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="barangay"
              name="barangay"
              label="Barangay"
              select
              error={barangay_error}
              size="small"
            >
              {barangay.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.barangay}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="barangay"
              name="barangay"
              label="Barangay"
              value={
                newData.barangay
                  ? newData.barangay.id
                    ? newData.barangay.id
                    : newData.barangay
                  : ""
              }
              onChange={handleEditChange}
              select
              error={barangay_error}
              size="small"
            >
              {barangay.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.barangay}
                </MenuItem>
              ))}
            </TextField>
          )}
          {/* Municipality */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="municipality"
              name="municipality"
              label="Municipality"
              select
              error={municipality_error}
              size="small"
            >
              {municipality.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.municipality}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="municipality"
              name="municipality"
              label="Municipality"
              value={
                newData.municipality
                  ? newData.municipality.id
                    ? newData.municipality.id
                    : newData.municipality
                  : ""
              }
              onChange={handleEditChange}
              select
              error={municipality_error}
              size="small"
            >
              {municipality.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.municipality}
                </MenuItem>
              ))}
            </TextField>
          )}
          {/* Province */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="province"
              name="province"
              label="Province"
              select
              error={province_error}
              size="small"
            >
              {province.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.province}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="province"
              name="province"
              label="Province"
              value={
                newData.province
                  ? newData.province.id
                    ? newData.province.id
                    : newData.province
                  : ""
              }
              onChange={handleEditChange}
              select
              error={province_error}
              size="small"
            >
              {province.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.province}
                </MenuItem>
              ))}
            </TextField>
          )}
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

OwnersEquityDialog.propTypes = {
  openOwnersEquityDialog: PropTypes.bool.isRequired,
  setOpenOwnersEquityDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
};
