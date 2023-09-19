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
import Autocomplete from "@mui/material/Autocomplete";
import useSWR from "swr";
import Chip from "@mui/material/Chip";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function MunicipalityDialog(props) {
  const {
    openMunicipalityDialog,
    setOpenMunicipalityDialog,
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
  const [provinceData, setProvinceData] = useState(null);
  const {
    data: province,
    error: province_error,
    isLoading: province_isLoading,
  } = useSWR("components/province", fetcher);

  useEffect(() => {
    setNewData(editData);
    if (isEditing) setProvinceData(editData.province);
  }, [editData, isEditing]);

  const handleEditChange = (event) => {
    const value = event.target.value;
    setNewData({ ...newData, [event.target.name]: value });
  };

  const handleClose = () => {
    setOpenMunicipalityDialog(false);
    setIsEditing(false);
    setProvinceData(null);
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
      municipality: data.get("municipality"),
      province: provinceData.id,
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing)
      axiosInstance
        .post("components/municipality/", postData)
        .then((response) => {
          handleSuccessful(true, "Municipality added successfully!");
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
        .put("components/municipality/" + editData.id + "/", postData)
        .then((response) => {
          handleSuccessful(true, "Municipality edited successfully!");
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

  if (province_isLoading) return;

  return (
    <Dialog open={openMunicipalityDialog} onClose={handleClose} fullWidth>
      <DialogTitle>
        {!isEditing ? "Add Municipality" : "Edit Municipality"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Municipality Information</Typography>
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="municipality"
              label="Municipality"
              name="municipality"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="municipality"
              label="Municipality"
              name="municipality"
              value={newData.municipality || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {!isEditing ? (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.province}
              options={province}
              size="small"
              onChange={(event, newInputValue) => {
                if (newInputValue != null) setProvinceData(newInputValue);
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.province}
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
                  id="province"
                  label="Province"
                  name="province"
                  fullWidth
                  {...params}
                />
              )}
            />
          ) : (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.province}
              options={province}
              size="small"
              value={newData.province || null}
              onChange={(event, newInputValue) => {
                console.log("asdasd123", newInputValue);
                setProvinceData(newInputValue);
              }}
              inputValue={provinceData ? provinceData.province : ""}
              // onInputChange={(event, newInputValue) => {
              //   console.log("asdasd", newInputValue);
              //   setProvinceData(newInputValue);
              // }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.province}
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
                  id="province"
                  label="Province"
                  name="province"
                  fullWidth
                  {...params}
                />
              )}
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

MunicipalityDialog.propTypes = {
  openMunicipalityDialog: PropTypes.bool.isRequired,
  setOpenMunicipalityDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
  setSelected: PropTypes.func.isRequired,
};
