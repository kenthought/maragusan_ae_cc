import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import { useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import Loading from "@/app/utils/loading";
import OwnersEquity from "@/app/dashboard/approvals/views/owners_equity";
import BankAccount from "@/app/dashboard/approvals/views/bank_account";
import Expenses from "@/app/dashboard/approvals/views/expenses";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const ViewApproval = (props) => {
  const { data, openViewApproval, setOpenViewApproval } = props;
  const { data: session } = useSession();
  const {
    data: barangay,
    error: barangay_error,
    isLoading: barangay_isLoading,
  } = useSWR("components/barangay", fetcher);
  const {
    data: municipality,
    error: municipality_error,
    isLoading: municipality_isLoading,
  } = useSWR("components/municipality", fetcher);
  const {
    data: province,
    error: province_error,
    isLoading: province_isLoading,
  } = useSWR("components/province", fetcher);
  const {
    data: bank,
    error: bank_error,
    isLoading: bank_isLoading,
  } = useSWR("components/bank", fetcher);
  const {
    data: expenses_category,
    error: expenses_category_error,
    isLoading: expenses_category_isLoading,
  } = useSWR("components/expenses_category", fetcher);

  const handleClose = () => {
    setOpenViewApproval(false);
  };

  if (
    barangay_isLoading ||
    municipality_isLoading ||
    province_isLoading ||
    bank_isLoading ||
    expenses_category_isLoading
  )
    return;

  return (
    <Dialog open={openViewApproval} onClose={handleClose}>
      <DialogContent>
        {data.type == "Owner's Equity" && (
          <OwnersEquity
            data={data}
            barangay={barangay}
            municipality={municipality}
            province={province}
          />
        )}
        {data.type == "Bank Account" && (
          <BankAccount
            data={data}
            bank={bank}
            barangay={barangay}
            municipality={municipality}
            province={province}
          />
        )}
        {data.type == "Expenses" && (
          <Expenses data={data} expenses_category={expenses_category} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewApproval.propTypes = {
  data: PropTypes.object.isRequired,
  openViewApproval: PropTypes.bool.isRequired,
  setOpenViewApproval: PropTypes.func.isRequired,
};

export default function ApprovedDialog(props) {
  const { openApproved, setOpenApproved } = props;
  const [data, setData] = useState({});
  const [openViewApproval, setOpenViewApproval] = useState(false);
  const {
    data: approved,
    error: approved_error,
    isLoading: approved_isLoading,
  } = useSWR("approvals/approved", fetcher, { refreshInterval: 1000 });

  const handleClose = () => {
    setOpenApproved(false);
  };

  if (approved_isLoading) return;

  return (
    <Dialog open={openApproved} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Approved list</DialogTitle>
      <DialogContent>
        <Box elevation={0} sx={{ padding: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            {approved.length != 0 ? (
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="simple table"
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Approved date & time</TableCell>
                      <TableCell align="right">Approval</TableCell>
                      <TableCell align="right">Type</TableCell>
                      <TableCell align="right">Account #</TableCell>
                      <TableCell align="right">Account name</TableCell>
                      <TableCell align="right">Approved by</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approved.map((row) => {
                      // const data = JSON.parse(row.data);
                      return (
                        <TableRow
                          key={row.created_at}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {new Date(row.approved_date).toLocaleDateString() +
                              " " +
                              new Date(row.approved_date).toLocaleTimeString()}
                          </TableCell>
                          <TableCell align="right">
                            {row.approval_type}
                          </TableCell>
                          <TableCell align="right">{row.type}</TableCell>
                          <TableCell align="right">
                            {row.account_number}
                          </TableCell>
                          <TableCell align="right">
                            {row.old_data.account_name}
                          </TableCell>
                          <TableCell align="right">
                            {row.approved_by.first_name}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              startIcon={<VisibilityIcon />}
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                setData(row);
                                setOpenViewApproval(true);
                              }}
                              size="small"
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography align="left">Nothing here...</Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="error">
          Close
        </Button>
      </DialogActions>
      {openViewApproval && (
        <ViewApproval
          data={data}
          openViewApproval={openViewApproval}
          setOpenViewApproval={setOpenViewApproval}
        />
      )}
    </Dialog>
  );
}

ApprovedDialog.propTypes = {
  openApproved: PropTypes.bool.isRequired,
  setOpenApproved: PropTypes.func.isRequired,
};
