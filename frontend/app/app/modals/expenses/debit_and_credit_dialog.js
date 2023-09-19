import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DebitDialog(props) {
  const {
    dialog,
    openDebitAndCreditDialog,
    setOpenDebitAndCreditDialog,
    selected,
    mutate,
    setIsSuccess,
    setSuccessText,
  } = props;
  const [post, setPost] = useState();
  const { data: session } = useSession();
  const {
    data: supplier,
    error: supplier_error,
    isLoading: supplier_isLoading,
  } = useSWR("/components/supplier", fetcher);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [receiptDate, setReceiptDate] = useState();
  const [receiptType] = useState([
    {
      id: 1,
      label: "Original Receipt",
    },
  ]);

  const handleClose = () => {
    setOpenDebitAndCreditDialog(false);
  };

  const handleSuccessful = (bool, text) => {
    setIsError(false);
    setIsSuccess(bool);
    setSuccessText(text);
    mutate();
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(selected);
    const postData = {
      post: post,
      receipt_date: new Date(data.get("receipt_date")),
      receipt_type: data.get("receipt_type"),
      invoice_number: data.get("invoice_number"),
      particulars: data.get("particulars"),
      credit: dialog == "Credit" ? parseInt(data.get("amount")) : 0,
      debit: dialog == "Debit" ? parseInt(data.get("amount")) : 0,
      control_number: selected.control_number,
      expenses: selected.id,
      supplier: data.get("supplier"),
      user: session.user.name[1],
    };
    console.log("asdasdasd", postData);

    axiosInstance
      .post("expenses/ledger/", postData)
      .then((response) => {
        handleSuccessful(true, "Ledger posted successfully!");
        console.log(response);
      })
      .catch((response) => {
        console.log(response);
        setIsError(true);
        setErrorText(response.message);
      });
  };

  if (selected === null || supplier_isLoading) return;

  return (
    <Dialog
      open={openDebitAndCreditDialog}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>{dialog}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          {isError ? <Alert severity="error">{errorText}</Alert> : <></>}
          <Grid container spacing={2} marginBottom={1}>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                fullWidth
                autoFocus
                required
                label="Account number"
                type="text"
                size="small"
                value={selected.account_number}
                readOnly
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={receiptDate || null}
                  onChange={(newValue) => {
                    setReceiptDate(newValue);
                  }}
                  slotProps={{
                    textField: {
                      margin: "normal",
                      size: "small",
                      fullWidth: true,
                      required: true,
                      name: "receipt_date",
                      id: "receipt_date",
                      label: "Receipt date",
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="receipt_type"
                name="receipt_type"
                label="Receipt type"
                select
                size="small"
              >
                {receiptType.map((option) => (
                  <MenuItem key={option.id} value={option.id.toString()}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="supplier"
                name="supplier"
                label="Supplier"
                select
                error={supplier_error}
                size="small"
              >
                {supplier.map((option) => (
                  <MenuItem key={option.id} value={option.id.toString()}>
                    {option.supplier}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box paddingRight={1}>
                <TextField
                  margin="dense"
                  fullWidth
                  autoFocus
                  required
                  label="Invoice #"
                  id="invoice_number"
                  name="invoice_number"
                  type="text"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                fullWidth
                required
                id="particulars"
                label="Particulars"
                name="particulars"
                type="textarea"
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <Box paddingRight={1}>
                <TextField
                  margin="dense"
                  fullWidth
                  required
                  label="Amount"
                  id="amount"
                  name="amount"
                  type="text"
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box paddingLeft={1}>
                <TextField
                  margin="dense"
                  fullWidth
                  required
                  label="Control #"
                  id="control_number"
                  name="control_number"
                  type="text"
                  value={selected.control_number}
                  size="small"
                  readOnly
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            id="post_data"
            name="post_data"
            type="submit"
          >
            Post
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

DebitDialog.propTypes = {
  dialog: PropTypes.string.isRequired,
  openDebitAndCreditDialog: PropTypes.bool.isRequired,
  setOpenDebitAndCreditDialog: PropTypes.func.isRequired,
  selected: PropTypes.object,
  mutate: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setSuccessText: PropTypes.func.isRequired,
};
