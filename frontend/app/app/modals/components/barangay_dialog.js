import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import { useSession } from "next-auth/react";

export default function BarangayDialog(props) {
  const {
    openBarangayDialog,
    setOpenBarangayDialog,
    setIsSuccess,
    setSuccessText,
    mutate,
    isEditing,
    setIsEditing,
    editData,
    setSelected,
  } = props;
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const { data: session } = useSession();
  const [newData, setNewData] = useState({});

  useEffect(() => {
    setNewData(editData);
  }, [editData]);

  const handleEditChange = (event) => {
    const value = event.target.value;
    setNewData({ ...newData, [event.target.name]: value });
  };

  const handleClose = () => {
    setOpenBarangayDialog(false);
    setIsEditing(false);
  };

  const handleSuccessful = (bool, text) => {
    setIsError(false);
    setIsSuccess(bool);
    setSuccessText(text);
    setSelected([]);
    mutate();
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const postData = {
      barangay: data.get("barangay"),
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing)
      axiosInstance
        .post("components/barangay/", postData)
        .then((response) => {
          handleSuccessful(true, "Barangay added successfully!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(
            response.message +
              " - " +
              response.request.responseText.match(/\[(.*?)\]/)[1]
          );
        });
    else
      axiosInstance
        .put("components/barangay/" + editData.id + "/", postData)
        .then((response) => {
          handleSuccessful(true, "Barangay edited successfully!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(
            response.message +
              " - " +
              response.request.responseText.match(/\[(.*?)\]/)[1]
          );
        });
  };

  return (
    <Dialog open={openBarangayDialog} onClose={handleClose} fullWidth>
      <DialogTitle>{!isEditing ? "Add Barangay" : "Edit Barangay"}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Barangay Information</Typography>
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="barangay"
              label="Barangay"
              name="barangay"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="barangay"
              label="Barangay"
              name="barangay"
              value={newData.barangay || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}

          {isError ? <Alert severity="error">{errorText}</Alert> : <></>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="success">
            {!isEditing ? "Add" : "Edit"}
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

BarangayDialog.propTypes = {
  openBarangayDialog: PropTypes.bool.isRequired,
  setOpenBarangayDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
  setSelected: PropTypes.func.isRequired,
};
