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

export default function FrequencyDialog(props) {
  const {
    openFrequencyDialog,
    setOpenFrequencyDialog,
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
    setOpenFrequencyDialog(false);
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
      frequency: data.get("frequency"),
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing)
      axiosInstance
        .post("components/frequency/", postData)
        .then((response) => {
          handleSuccessful(true, "Frequency added successfully!");
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
        .put("components/frequency/" + editData.id + "/", postData)
        .then((response) => {
          handleSuccessful(true, "Frequency edited successfully!");
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
    <Dialog open={openFrequencyDialog} onClose={handleClose} fullWidth>
      <DialogTitle>
        {!isEditing ? "Add Frequency" : "Edit Frequency"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Frequency Information</Typography>
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="frequency"
              label="Frequency"
              name="frequency"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="frequency"
              label="Frequency"
              name="frequency"
              value={newData.frequency || ""}
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

FrequencyDialog.propTypes = {
  openFrequencyDialog: PropTypes.bool.isRequired,
  setOpenFrequencyDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
  setSelected: PropTypes.func.isRequired,
};
