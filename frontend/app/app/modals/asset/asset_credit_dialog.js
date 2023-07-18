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
import { ButtonGroup, Divider, Fade } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "grey",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function AssetCreditDialog(props) {
  const {
    openAssetCreditDialog,
    setOpenAssetCreditDialog,
    selected,
    mutate,
    setIsSuccess,
    setSuccessText,
  } = props;
  const [rows, setRows] = useState([]);
  const [post, setPost] = useState();
  const { data: session } = useSession();
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);

  const handleClose = () => {
    setOpenAssetCreditDialog(false);
    setRows([]);
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
      invoice_number: data.get("invoice_number"),
      term: data.get("depreciation_term"),
      particulars: data.get("particulars"),
      credit: parseInt(data.get("amount")),
      control_number: selected.control_number,
      asset: selected.id,
      user: session.user.name[1],
    };

    axiosInstance
      .post("ledger/", postData)
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
    <Dialog
      open={openAssetCreditDialog}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Credit</DialogTitle>
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
            <Grid item xs={6}>
              <Box>
                <TextField
                  margin="dense"
                  fullWidth
                  required
                  label="Depreciation Term (Number of months)"
                  id="depreciation_term"
                  name="depreciation_term"
                  type="number"
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

AssetCreditDialog.propTypes = {
  openAssetCreditDialog: PropTypes.bool.isRequired,
  setOpenAssetCreditDialog: PropTypes.func.isRequired,
  selected: PropTypes.object,
  mutate: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setSuccessText: PropTypes.func.isRequired,
};
