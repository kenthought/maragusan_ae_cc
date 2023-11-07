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
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function SummaryDialog(props) {
  const { openSummaryDialog, setOpenSummaryDialog } = props;
  const {
    data: summary,
    error: summary_error,
    isLoading: summary_isLoading,
  } = useSWR("balance/Owner's Equity", fetcher);
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
    { id: 3, label: "Bad Debts", value: false },
  ]);

  const handleClose = () => {
    setOpenSummaryDialog(false);
  };

  const exportToPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = "Owner's equity summary";
    const headers = [["Account #", "Account name", "Status", "Balance"]];

    const data = summary.map((elt) => [
      elt.module.account_number,
      elt.module.account_name,
      accountStatus.find((x) => x.id === elt.module.account_status).label,
      numFormat(parseFloat(elt.balance)),
    ]);

    let content = {
      startY: 110,
      head: headers,
      body: data,
      theme: "grid",
      headStyles: { fillColor: [25, 118, 210] },
    };

    doc.text(title, marginLeft, 50);
    doc.text(new Date().toDateString(), marginLeft, 70);
    doc.autoTable(content);
    doc.save("summary.pdf");
  };

  const numFormat = (num) => {
    return `${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  if (summary_isLoading) return;

  if (summary_error) return <div>Unable to fetch summary!</div>;

  return (
    <Dialog
      open={openSummaryDialog}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Owners equity summary</DialogTitle>
      <DialogContent>
        <Typography mb={1}>{new Date().toDateString()}</Typography>
        {summary.length != 0 ? (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Account #</TableCell>
                  <TableCell align="right">Account name</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.module.account_number}
                    </TableCell>
                    <TableCell align="right">
                      {row.module.account_name}
                    </TableCell>
                    <TableCell align="right">
                      {
                        accountStatus.find(
                          (x) => x.id === row.module.account_status
                        ).label
                      }
                    </TableCell>
                    <TableCell align="right">
                      {numFormat(parseFloat(row.balance))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No summary available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {summary.length != 0 && (
          <Button variant="contained" color="primary" onClick={exportToPDF}>
            Print
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

SummaryDialog.propTypes = {
  openSummaryDialog: PropTypes.bool.isRequired,
  setOpenSummaryDialog: PropTypes.func.isRequired,
};
