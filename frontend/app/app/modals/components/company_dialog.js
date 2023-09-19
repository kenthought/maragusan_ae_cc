import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function CompanyDialog(props) {
  const {
    openCompanyDialog,
    setOpenCompanyDialog,
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
  const {
    data: schedule,
    error: schedule_error,
    isLoading: schedule_isLoading,
  } = useSWR("components/schedule", fetcher);
  const {
    data: frequency,
    error: frequency_error,
    isLoading: frequency_isLoading,
  } = useSWR("components/frequency", fetcher);

  useEffect(() => {
    setNewData(editData);
  }, [editData]);

  const handleEditChange = (event) => {
    const value = event.target.value;
    setNewData({ ...newData, [event.target.name]: value });
  };

  const handleClose = () => {
    setOpenCompanyDialog(false);
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
      company: data.get("company"),
      address: data.get("address"),
      frequency: data.get("frequency"),
      schedule: data.get("schedule"),
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing)
      axiosInstance
        .post("components/company/", postData)
        .then((response) => {
          handleSuccessful(true, "Company added successfully!");
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
        .put("components/company/" + editData.id + "/", postData)
        .then((response) => {
          handleSuccessful(true, "Company edited successfully!");
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

  if (schedule_isLoading || frequency_isLoading) return;

  return (
    <Dialog open={openCompanyDialog} onClose={handleClose} fullWidth>
      <DialogTitle>
        {!isEditing ? "Add Company" : "Edit Company type"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Company Information</Typography>
          {/* Company */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="company"
              label="Company"
              name="company"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="company"
              label="Company"
              name="company"
              value={newData.company || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {/* Address */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="address"
              label="Address"
              name="address"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="address"
              label="Address"
              name="address"
              type="textarea"
              value={newData.address || ""}
              onChange={handleEditChange}
              size="small"
              multiline
              rows={3}
            />
          )}
          {/* Frequency */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="frequency"
              name="frequency"
              label="Frequency"
              select
              error={frequency_error}
              size="small"
            >
              {frequency.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.frequency}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="frequency"
              name="frequency"
              label="Frequency"
              value={
                newData.frequency
                  ? newData.frequency.id
                    ? newData.frequency.id
                    : newData.frequency
                  : ""
              }
              onChange={handleEditChange}
              select
              error={frequency_error}
              size="small"
            >
              {frequency.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.frequency}
                </MenuItem>
              ))}
            </TextField>
          )}
          {/* Schedule */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="schedule"
              name="schedule"
              label="Schedule"
              select
              error={schedule_error}
              size="small"
            >
              {schedule.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.schedule}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="schedule"
              name="schedule"
              label="Schedule"
              value={
                newData.schedule
                  ? newData.schedule.id
                    ? newData.schedule.id
                    : newData.schedule
                  : ""
              }
              onChange={handleEditChange}
              select
              error={schedule_error}
              size="small"
            >
              {schedule.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.schedule}
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
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

CompanyDialog.propTypes = {
  openCompanyDialog: PropTypes.bool.isRequired,
  setOpenCompanyDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
  setSelected: PropTypes.func.isRequired,
};
