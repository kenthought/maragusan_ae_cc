import { useState, useEffect, forwardRef } from "react";
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
import { ButtonGroup, Divider, Fade } from "@mui/material";
import { NumericFormatCustom } from "@/app/utils/numberic_format";
import { MaskControlNumber } from "@/app/utils/mask_control_number";

const numFormat = (num) => {
  return `${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export default function DebitDialog(props) {
  const {
    dialog,
    openDebitAndCreditDialog,
    setOpenDebitAndCreditDialog,
    selected,
    mutate,
    setIsSuccess,
    setSuccessText,
    balance,
  } = props;
  const [post, setPost] = useState();
  const { data: session } = useSession();
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [controlNumber, setControlNumber] = useState("");

  const handleClose = () => {
    setControlNumber("")
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
    const amount = parseFloat(data.get("amount").replace(/\,/g, ""), 10);

    if (selected.control_number != controlNumber) {
      setIsError(true);
      setErrorText("Invalid control number");
      return;
    }

    if (
      dialog == "Credit" &&
      parseFloat(balance.replace(/\,/g, ""), 10) < amount
    ) {
      setIsError(true);
      setErrorText("Credit should not be above balance");
      return;
    }

    const postData = {
      post: post,
      invoice_number: data.get("invoice_number"),
      particulars: data.get("particulars"),
      credit: dialog == "Credit" ? amount : 0,
      debit: dialog == "Debit" ? amount : 0,
      owners_equity: selected.id,
      user: session.user.name[1],
    };

    console.log(postData);

    axiosInstance
      .post("owners_equity/ledger/", postData)
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

  if (selected === null) return;

  return (
    <Dialog open={openDebitAndCreditDialog} onClose={handleClose} fullWidth>
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
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={6}>
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
                  autoComplete="off"
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
                autoComplete="off"
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
                  InputProps={{ inputComponent: NumericFormatCustom }}
                  autoComplete="off"
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
                  size="small"
                  InputProps={{ inputComponent: MaskControlNumber }}
                  value={controlNumber}
                  onChange={(event) => {
                    setControlNumber(event.target.value);
                  }}
                  autoComplete="off"
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
  balance: PropTypes.string.isRequired,
};
