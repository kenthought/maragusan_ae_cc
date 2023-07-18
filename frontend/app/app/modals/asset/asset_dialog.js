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

export default function AssetDialog(props) {
  const {
    openAssetDialog,
    setOpenAssetDialog,
    setIsSuccess,
    setSuccessText,
    mutate,
    isEditing,
    setIsEditing,
    editData,
  } = props;
  const {
    data: asset_type,
    error: asset_type_error,
    isLoading: asset_type_isLoading,
  } = useSWR("/asset_type", fetcher);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const { data: session } = useSession();
  const [newData, setNewData] = useState({
    control_number: "",
    account_name: "",
    asset_description: "",
    asset_type: {
      id: 0,
    },
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
    setOpenAssetDialog(false);
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
      asset_description: data.get("asset_description"),
      asset_type: data.get("asset_type"),
      account_status: data.get("account_status"),
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing)
      axiosInstance
        .post("asset/", postData)
        .then((response) => {
          handleSuccessful(true, "Asset added successfully!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(response.message);
        });
    else
      axiosInstance
        .put("asset/" + editData.id + "/", postData)
        .then((response) => {
          handleSuccessful(true, "Asset edited successfully!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(response.message);
        });
  };

  if (asset_type_isLoading) return;

  return (
    <Dialog open={openAssetDialog} onClose={handleClose} fullWidth>
      <DialogTitle>{!isEditing ? "Add Asset" : "Edit Asset"}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Asset Information</Typography>
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
          {/* Asset Description */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="asset_description"
              label="Asset Description"
              name="asset_description"
              type="textarea"
              size="small"
              multiline
              rows={3}
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="asset_description"
              label="Asset Description"
              name="asset_description"
              value={newData.asset_description || ""}
              onChange={handleEditChange}
              type="textarea"
              size="small"
              multiline
              rows={3}
            />
          )}
          {/* Asset Type */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="asset_type"
              name="asset_type"
              label="Asset type"
              select
              error={asset_type_error}
              size="small"
            >
              {asset_type.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.asset_type}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="asset_type"
              name="asset_type"
              label="Asset type"
              value={
                newData.asset_type
                  ? newData.asset_type.id
                    ? newData.asset_type.id
                    : newData.asset_type
                  : ""
              }
              onChange={handleEditChange}
              select
              error={asset_type_error}
              size="small"
            >
              {asset_type.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.asset_type}
                </MenuItem>
              ))}
            </TextField>
          )}
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

AssetDialog.propTypes = {
  openAssetDialog: PropTypes.bool.isRequired,
  setOpenAssetDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
};
