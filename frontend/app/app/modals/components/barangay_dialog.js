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
import useSWR from "swr";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const Municipality = (props) => {
  const { id, setMunicipalityData, municipalityData, isEditing, newData } =
    props;
  const {
    data: municipality,
    error: municipality_error,
    isLoading: municipality_isLoading,
  } = useSWR("components/province_municipalities/" + id, fetcher);

  if (municipality_isLoading) return;

  if (isEditing)
    return (
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
        // onInputChange={(event, newInputValue) => {
        //   console.log("asdasd", newInputValue);
        //   setmunicipalityData(newInputValue);
        // }}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.municipality}
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
            margin="normal"
            required
            id="municipality"
            label="Municipality"
            name="municipality"
            fullWidth
            {...params}
          />
        )}
      />
    );

  return (
    <Autocomplete
      disablePortal
      getOptionLabel={(option) => option.municipality}
      options={municipality}
      size="small"
      onChange={(event, newInputValue) => {
        if (newInputValue != null) setMunicipalityData(newInputValue);
        else setMunicipalityData(null);
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
          <Chip {...getTagProps({ index })} key={option} label={option} />
        ));
      }}
      renderInput={(params) => (
        <TextField
          margin="normal"
          required
          id="municipality"
          label="Municipality"
          name="municipality"
          fullWidth
          {...params}
        />
      )}
    />
  );
};

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
  const [newData, setNewData] = useState(null);
  const [municipalityData, setMunicipalityData] = useState(null);
  const [provinceData, setProvinceData] = useState(null);
  const {
    data: province,
    error: province_error,
    isLoading: province_isLoading,
  } = useSWR("components/province", fetcher);

  useEffect(() => {
    if (isEditing) {
      setNewData(editData);
      setProvinceData(editData.municipality.province);
      setMunicipalityData(editData.municipality);
      console.log("123123", newData);
    }
  }, [editData, isEditing, newData]);

  const handleEditChange = (event) => {
    const value = event.target.value;
    setNewData({ ...newData, [event.target.name]: value });
  };

  const handleClose = () => {
    setOpenBarangayDialog(false);
    setIsEditing(false);
    setMunicipalityData(null);
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
      municipality: municipalityData.id,
      province: provinceData.id,
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

  if (province_isLoading) return;

  return (
    <Dialog open={openBarangayDialog} onClose={handleClose} fullWidth>
      <DialogTitle>{!isEditing ? "Add Barangay" : "Edit Barangay"}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Barangay Information</Typography>
          {!isEditing ? (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.province}
              options={province}
              size="small"
              onChange={(event, newInputValue) => {
                if (newInputValue != null) setProvinceData(newInputValue);
                else setProvinceData(null);
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
            newData && (
              <Autocomplete
                disablePortal
                getOptionLabel={(option) => option.province}
                options={province}
                size="small"
                value={newData.municipality.province || null}
                onChange={(event, newInputValue) => {
                  console.log(newInputValue);
                  setProvinceData(newInputValue);
                  setMunicipalityData(null);
                }}
                inputValue={provinceData ? provinceData.province : ""}
                // onInputChange={(event, newInputValue) => {
                //   console.log("asdasd", newInputValue);
                //   setmunicipalityData(newInputValue);
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
            )
          )}
          {provinceData ? (
            <Municipality
              setMunicipalityData={setMunicipalityData}
              municipalityData={municipalityData}
              id={provinceData.id}
              isEditing={isEditing}
              newData={newData}
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Municipality"
              type="text"
              size="small"
              disabled
            />
          )}
          {municipalityData ? (
            !isEditing ? (
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
            )
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Barangay"
              type="text"
              size="small"
              disabled
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
