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
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
  } = useSWR("expenses/ledger/" + selected.id, fetcher);

  const [openDebitAndCreditDialog, setOpenDebitAndCreditDialog] =
    useState(false);
  const [dialog, setDialog] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [receiptType] = useState([
    {
      id: 1,
      label: "Original Receipt",
    },
  ]);
  const handleClose = () => {
    setIsSuccess(false);
    setOpenLedgerDialog(false);
  };

  const exportToPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = "Expenses ledger";
    const headers = [
      [
        "Date",
        "Invoice #",
        "Particulars",
        "Debit",
        "Credit",
        "Balance",
        "Trans no.",
        "User",
        "Time",
        "Receipt date",
        "Receipt type",
        "Supplier",
      ],
    ];

    const data = ledger.map((elt) => [
      new Date(elt.created_at).toLocaleDateString(),
      elt.invoice_number,
      elt.particulars,
      numFormat(parseFloat(elt.debit)),
      numFormat(parseFloat(elt.credit)),
      numFormat(parseFloat(elt.balance)),
      elt.trans_number,
      elt.user.first_name,
      new Date(elt.created_at).toLocaleTimeString(),
      new Date(elt.receipt_date).toLocaleDateString(),
      receiptType[elt.receipt_type - 1].label,
      elt.supplier.supplier,
    ]);

    let content = {
      startY: 110,
      head: headers,
      body: data,
      theme: "grid",
      headStyles: { fillColor: [25, 118, 210] },
    };

    doc.text(new Date().toDateString(), 700, 20);
    doc.text(title, marginLeft, 50);
    doc.text("Account number: " + selected.account_number, marginLeft, 70);
    doc.text("Account name: " + selected.account_name, 250, 70);
    doc.autoTable(content);
    doc.save("expenses_soa.pdf");
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
                    <StyledTableCell align="right">
                      Receipt date
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Receipt type
                    </StyledTableCell>
                    <StyledTableCell align="right">Supplier</StyledTableCell>
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
                      <TableCell align="right">
                        {new Date(row.receipt_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {receiptType[row.receipt_type - 1].label}
                      </TableCell>
                      <TableCell align="right">
                        {row.supplier.supplier}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={12} align="left">
                      <Typography component="div" padding={2}>
                        Balance: {numFormat(ledger[ledger.length - 1].balance)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
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
          <Button variant="contained" onClick={exportToPDF}>
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
            balance={
              ledger.length != 0
                ? numFormat(ledger[ledger.length - 1].balance)
                : 0
            }
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
