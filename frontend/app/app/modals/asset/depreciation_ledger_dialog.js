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
import Success from "@/app/utils/success";
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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DepreciationLedgerDialog(props) {
  const {
    openDepreciationLedgerDialog,
    setOpenDepreciationLedgerDialog,
    selected,
  } = props;
  const {
    data: depreciation_ledger,
    error: depreciation_ledger_error,
    isLoading: depreciation_ledger_isLoading,
    mutate,
  } = useSWR("/depreciation_ledger/" + selected.id, fetcher);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");

  const handleClose = () => {
    setIsSuccess(false);
    setOpenDepreciationLedgerDialog(false);
  };

  if (depreciation_ledger_isLoading) return;

  return (
    <>
      <Dialog
        open={openDepreciationLedgerDialog}
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
              Depreciation Ledger
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Success
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            successText={successText}
          />
          {depreciation_ledger.length != 0 ? (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Account #</StyledTableCell>
                    <StyledTableCell align="right">
                      Account name
                    </StyledTableCell>
                    <StyledTableCell align="right">Trans date</StyledTableCell>
                    <StyledTableCell align="right">
                      Depreciation date
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Depreciation term
                    </StyledTableCell>
                    <StyledTableCell align="right">Debit</StyledTableCell>
                    <StyledTableCell align="right">Credit</StyledTableCell>
                    <StyledTableCell align="right">Balance</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {depreciation_ledger.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {selected.account_number}
                      </TableCell>
                      <TableCell align="right">
                        {selected.account_name}
                      </TableCell>
                      <TableCell align="right">
                        {new Date(row.trans_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {new Date(row.depreciation_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">{row.term}</TableCell>
                      <TableCell align="right">{row.debit}</TableCell>
                      <TableCell align="right">{row.credit}</TableCell>
                      <TableCell align="right">
                        {index == 0
                          ? row.debit - row.credit
                          : depreciation_ledger[0].debit - row.credit * index}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography component="div" textAlign="center" marginTop={2}>
              No data available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DepreciationLedgerDialog.propTypes = {
  openDepreciationLedgerDialog: PropTypes.bool.isRequired,
  setOpenDepreciationLedgerDialog: PropTypes.func.isRequired,
  selected: PropTypes.object,
};
