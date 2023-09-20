import { useState, useEffect, forwardRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import axiosInstance from "@/app/axios";
import Success from "../../utils/success";
import Loading from "@/app/utils/loading";
import DebitAndCreditDialog from "./debit_and_credit_dialog";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "grey",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const numFormat = (num) => {
  return `${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LedgerDialog(props) {
  const { dialogName, openLedgerDialog, setOpenLedgerDialog, selected } = props;
  const {
    data: ledger,
    error: ledger_error,
    isLoading: ledger_isLoading,
    mutate,
  } = useSWR("owners_equity/ledger/" + selected.id, fetcher);

  const [openDebitAndCreditDialog, setOpenDebitAndCreditDialog] =
    useState(false);
  const [dialog, setDialog] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const handleClose = () => {
    setIsSuccess(false);
    setOpenLedgerDialog(false);
  };

  const exportToExcel = () => {
    var tab_text =
      "<table border='2px'><tr><td style='font-weight: bold; font-size: 15px'>" +
      "Owner's equity ledger" +
      "</td></tr>" +
      "<tr><td>Account number: " +
      selected.account_number +
      "</td><td>Account name:" +
      selected.account_name +
      "</tr></td>" +
      "<tr>";
    var textRange;
    var j = 0;
    var tab = document.getElementById("ledger_table"); // id of table

    for (j = 0; j < tab.rows.length; j++) {
      tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
      //tab_text=tab_text+"</tr>";
    }

    tab_text =
      tab_text + "<tr><td>" + new Date().toDateString() + "</td></tr></table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var sa;

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      // If Internet Explorer
      txtArea1.document.open("txt/html", "replace");
      txtArea1.document.write(tab_text);
      txtArea1.document.close();
      txtArea1.focus();
      sa = txtArea1.document.execCommand("SaveAs", true, "");
    } //other browser not tested on IE 11
    else
      sa = window.open(
        "data:application/vnd.ms-excel," + encodeURIComponent(tab_text)
      );

    return sa;
  };

  if (ledger_isLoading) return;

  return (
    <>
      <Dialog
        open={openLedgerDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="h2">
              {dialogName}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Grid container>
            <Grid item xs={6} md={4}>
              <Box padding={1}>
                <TextField
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  label="Account number"
                  value={selected.account_number}
                  readOnly
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={8}>
              <Box padding={1}>
                <TextField
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  label="Account name"
                  value={selected.account_name}
                  readOnly
                />
              </Box>
            </Grid>
          </Grid>
          <Success
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            successText={successText}
          />
          {ledger.length != 0 ? (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
                id="ledger_table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell align="right">Invoice #</StyledTableCell>
                    <StyledTableCell align="right">Particulars</StyledTableCell>
                    <StyledTableCell align="right">Debit</StyledTableCell>
                    <StyledTableCell align="right">Credit</StyledTableCell>
                    <StyledTableCell align="right">Balance</StyledTableCell>
                    <StyledTableCell align="right">Trans No.</StyledTableCell>
                    <StyledTableCell align="right">User</StyledTableCell>
                    <StyledTableCell align="right">Time</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ledger.map((row) => (
                    <TableRow
                      key={row.created_at}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {new Date(row.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">{row.invoice_number}</TableCell>
                      <TableCell align="right">{row.particulars}</TableCell>
                      <TableCell align="right">
                        {numFormat(parseFloat(row.debit))}
                      </TableCell>
                      <TableCell align="right">
                        {numFormat(parseFloat(row.credit))}
                      </TableCell>
                      <TableCell align="right">
                        {numFormat(parseFloat(row.balance))}
                      </TableCell>
                      <TableCell align="right">{row.trans_number}</TableCell>
                      <TableCell align="right">{row.user.first_name}</TableCell>
                      <TableCell align="right">
                        {new Date(row.created_at).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={9} align="right">
                      <Typography component="div" padding={2}>
                        Balance: {ledger[ledger.length - 1].balance}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>

              <Typography component="div" padding={2}>
                Balance: {numFormat(ledger[ledger.length - 1].balance)}
              </Typography>
            </TableContainer>
          ) : (
            <Typography component="div" textAlign="center" marginTop={2}>
              No data available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained">Reconcile</Button>
          <Button
            variant="contained"
            onClick={() => {
              setDialog("Debit");
              setOpenDebitAndCreditDialog(true);
            }}
          >
            Debit
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setDialog("Credit");
              setOpenDebitAndCreditDialog(true);
            }}
          >
            Credit
          </Button>
          <Button variant="contained" onClick={exportToExcel}>
            Print Soa
          </Button>
          <Button variant="contained" onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {selected != null && (
        <>
          <DebitAndCreditDialog
            dialog={dialog}
            openDebitAndCreditDialog={openDebitAndCreditDialog}
            setOpenDebitAndCreditDialog={setOpenDebitAndCreditDialog}
            selected={selected}
            mutate={mutate}
            setIsSuccess={setIsSuccess}
            setSuccessText={setSuccessText}
          />
        </>
      )}
    </>
  );
}

LedgerDialog.propTypes = {
  openLedgerDialog: PropTypes.bool.isRequired,
  setOpenLedgerDialog: PropTypes.func.isRequired,
  selected: PropTypes.object,
};
