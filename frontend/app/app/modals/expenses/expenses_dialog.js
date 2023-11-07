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

export default function ExpensesDialog(props) {
  const {
    openExpensesDialog,
    setOpenExpensesDialog,
    setIsSuccess,
    setSuccessText,
    mutate,
    isEditing,
    setIsEditing,
    editData,
  } = props;
  const {
    data: expenses_category,
    error: expenses_category_error,
    isLoading: expenses_category_isLoading,
  } = useSWR("components/expenses_category", fetcher);
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
    setOpenExpensesDialog(false);
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
      expenses_description: data.get("expenses_description"),
      expenses_category: data.get("expenses_category"),
      account_status: !isEditing ? 1 : data.get("account_status"),
      under_approval: !isEditing ? 1 : 0,
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing) {
      postData.forApproval = {
        type: "Expenses",
        approval_type: "Add",
        old_data: { ...postData },
        new_data: { ...postData },
        submitted_by: session.user.name[1],
      };
      axiosInstance
        .post("expenses/", postData)
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
      //   .put("expenses/" + editData.id + "/", postData)
      //   .then((response) => {
      //     handleSuccessful(true, "Expenses edited successfully!");
      //     console.log(response);
      //   })
      //   .catch((response) => {
      //     console.log(response);
      //     setIsError(true);
      //     setErrorText(response.message);
      //   });

      const old_data = editData;
      old_data.expenses_category = editData.expenses_category.id;

      const forApproval = {
        type: "Expenses",
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

  if (expenses_category_isLoading) return;

  return (
    <Dialog open={openExpensesDialog} onClose={handleClose} fullWidth>
      <DialogTitle>{!isEditing ? "Add Expenses" : "Edit Expenses"}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Expenses Information</Typography>
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
              value={generateControlNumber().toString()}
              size="small"
              autoComplete="off"
              readOnly
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
              type="text"
              size="small"
              autoComplete="off"
              readOnly
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
          {/* Expenses Description
           */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="expenses_description"
              label="Expenses Description"
              name="expenses_description"
              type="textarea"
              size="small"
              multiline
              rows={3}
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="expenses_description"
              label="Expenses Description"
              name="expenses_description"
              value={newData.expenses_description || ""}
              onChange={handleEditChange}
              type="textarea"
              size="small"
              multiline
              rows={3}
            />
          )}
          {/* Expenses Category */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="expenses_category"
              name="expenses_category"
              label="Expenses Category"
              select
              error={expenses_category_error}
              size="small"
            >
              {expenses_category.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.expenses_category}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="expenses_category"
              name="expenses_category"
              label="Expenses Category"
              value={
                newData.expenses_category
                  ? newData.expenses_category.id
                    ? newData.expenses_category.id
                    : newData.expenses_category
                  : ""
              }
              onChange={handleEditChange}
              select
              error={expenses_category_error}
              size="small"
            >
              {expenses_category.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.expenses_category}
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

ExpensesDialog.propTypes = {
  openExpensesDialog: PropTypes.bool.isRequired,
  setOpenExpensesDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
};
