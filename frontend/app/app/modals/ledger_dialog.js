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
import Success from "../utils/success";
import AssetDebitDialog from "./asset_debit_dialog";
import useSWR from "swr";
import AssetCreditDialog from "./asset_credit_dialog";

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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function LedgerDialog({
  openLedgerDialog,
  setOpenLedgerDialog,
  selected,
}) {
  const {
    data: ledger,
    error: ledger_error,
    isLoading: ledger_isLoading,
    mutate,
  } = useSWR("/ledger/" + selected.id, fetcher);

  const [openAssetDebitDialog, setOpenAssetDebitDialog] = useState(false);
  const [openAssetCreditDialog, setOpenAssetCreditDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const handleClose = () => {
    setIsSuccess(false);
    setOpenLedgerDialog(false);
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
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Asset Ledger
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
                      <TableCell align="right">{row.debit}</TableCell>
                      <TableCell align="right">{row.credit}</TableCell>
                      <TableCell align="right">{row.balance}</TableCell>
                      <TableCell align="right">{row.trans_number}</TableCell>
                      <TableCell align="right">{row.user.first_name}</TableCell>
                      <TableCell align="right">
                        {new Date(row.created_at).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={9} align="right">
                      <Typography component="div">
                        Balance:
                        <TextField
                          size="small"
                          value={ledger[ledger.length - 1].balance}
                          sx={{ width: "120px", marginLeft: 2 }}
                          readOnly
                        />
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
            onClick={() => setOpenAssetDebitDialog(true)}
          >
            Debit
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenAssetCreditDialog(true)}
          >
            Credit
          </Button>
          <Button variant="contained">Print Soa</Button>
          <Button variant="contained" onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {selected != null ? (
        <>
          <AssetDebitDialog
            openAssetDebitDialog={openAssetDebitDialog}
            setOpenAssetDebitDialog={setOpenAssetDebitDialog}
            selected={selected}
            mutate={mutate}
            setIsSuccess={setIsSuccess}
            setSuccessText={setSuccessText}
          />
          <AssetCreditDialog
            openAssetCreditDialog={openAssetCreditDialog}
            setOpenAssetCreditDialog={setOpenAssetCreditDialog}
            selected={selected}
            mutate={mutate}
            setIsSuccess={setIsSuccess}
            setSuccessText={setSuccessText}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

LedgerDialog.propTypes = {
  openLedgerDialog: PropTypes.bool.isRequired,
  setOpenLedgerDialog: PropTypes.func.isRequired,
  selected: PropTypes.object,
};
