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

const ccyFormat = (num) => {
  return `${num.toFixed(2)}`;
};

export default function DebitDialog(props) {
  const {
    openDebitDialog,
    setOpenDebitDialog,
    selected,
    mutate,
    setIsSuccess,
    setSuccessText,
  } = props;
  const [rows, setRows] = useState([]);
  const { data: session } = useSession();
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [openAssetTransactionTable, setOpenAssetTransactionTable] =
    useState(false);

  const handleClose = () => {
    setOpenDebitDialog(false);
    setRows([]);
  };

  const handleCloseAssetTransactionTable = () => {
    setIsError(false);
    setOpenAssetTransactionTable(false);
  };

  const handleSuccessful = (bool, text) => {
    setIsError(false);
    setIsSuccess(bool);
    setSuccessText(text);
    mutate();
    handleCloseAssetTransactionTable();
    handleClose();
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    setRows([]);
    const data = new FormData(event.currentTarget);
    var amount = parseInt(data.get("amount"));

    for (var i = 0; i <= data.get("depreciation_term"); i++) {
      const postData = {
        post: i == 0 ? 1 : 2,
        depreciation_date:
          i == 0
            ? new Date().toDateString()
            : new Date(
                new Date(
                  new Date().setMonth(new Date().getMonth() + i)
                ).getFullYear(),
                new Date(
                  new Date().setMonth(new Date().getMonth() + i)
                ).getMonth(),
                0
              ).toDateString(),
        invoice_number: data.get("invoice_number"),
        term: data.get("depreciation_term") - i,
        particulars: data.get("particulars"),
        debit: i == 0 ? amount : 0,
        credit: i > 0 ? amount / data.get("depreciation_term") : 0,
        control_number: selected.control_number,
        asset: selected.id,
        user: session.user.name[1],
      };

      setRows((array) => {
        const temp = [...array];
        temp.push(postData);

        return temp;
      });
    }

    setOpenAssetTransactionTable(true);
  };

  const handleSubmit = (rows) => {
    axiosInstance
      .post("assets/ledger/", rows)
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

  const AssetTranscactionTable = () => (
    <Dialog
      open={openAssetTransactionTable}
      onClose={handleCloseAssetTransactionTable}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Asset Transaction Table</DialogTitle>
      <DialogContent>
        {isError ? (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorText}
          </Alert>
        ) : null}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 780 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Depreciation Date</StyledTableCell>
                <StyledTableCell align="right">Term</StyledTableCell>
                <StyledTableCell align="right">Particulars</StyledTableCell>
                <StyledTableCell align="right">Debit</StyledTableCell>
                <StyledTableCell align="right">Credit</StyledTableCell>
                <StyledTableCell align="right">Balance</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.depreciation_date}
                  </TableCell>
                  <TableCell align="right">{row.term}</TableCell>
                  <TableCell align="right">
                    {row.post == 1
                      ? "Asset purchase value"
                      : "Depreciation Schedule"}
                  </TableCell>
                  <TableCell align="right">{ccyFormat(row.debit)}</TableCell>
                  <TableCell align="right">{ccyFormat(row.credit)}</TableCell>
                  <TableCell align="right">
                    {index == 0
                      ? ccyFormat(row.debit - row.credit)
                      : ccyFormat(rows[0].debit - row.credit * index)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        {rows.length != 0 ? (
          <Button
            variant="contained"
            color="success"
            onClick={() => handleSubmit(rows)}
            id="post_data"
            name="post_data"
          >
            Post
          </Button>
        ) : (
          <></>
        )}
        <Button
          onClick={handleCloseAssetTransactionTable}
          variant="contained"
          color="error"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (selected === null) return;

  return (
    <Dialog
      open={openDebitDialog}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Debit</DialogTitle>
      <Box component="form" onSubmit={handleGenerate}>
        <DialogContent>
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
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: 2,
                  textAlign: "right",
                }}
              ></Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              {rows.length != 0 ? (
                <Box sx={{ padding: 1 }}>
                  <AssetTranscactionTable
                    rows={rows}
                    open={openAssetTransactionTable}
                    onClose={handleCloseAssetTransactionTable}
                  />
                </Box>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit">
            Generate
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
  openDebitDialog: PropTypes.bool.isRequired,
  setOpenDebitDialog: PropTypes.func.isRequired,
  selected: PropTypes.object,
  mutate: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setSuccessText: PropTypes.func.isRequired,
};
