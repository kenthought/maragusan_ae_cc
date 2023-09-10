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

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const ViewApproval = (props) => {
  const { data, api, openViewApproval, setOpenViewApproval } = props;
  const { data: session } = useSession();
  const {
    data: module,
    error: module_error,
    isLoading: module_isLoading,
    mutate,
  } = useSWR(api + "/" + data.module_id, fetcher);
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
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
    { id: 3, label: "Bad Debts", value: false },
  ]);

  const handleClose = () => {
    setOpenViewApproval(false);
  };

  if (
    module_isLoading ||
    barangay_isLoading ||
    municipality_isLoading ||
    province_isLoading
  )
    return;

  return (
    <Dialog open={openViewApproval} onClose={handleClose}>
      <DialogContent>
        <Box>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            padding={1}
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Typography>Account number:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>{data.account_number}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Account name:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>{data.data.account_name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Purok/Street:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>{data.data.purok_street}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Barangay:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>
                {barangay.find((x) => x.id == data.data.barangay).barangay}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Municipality:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>
                {
                  municipality.find((x) => x.id == data.data.municipality)
                    .municipality
                }
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Province:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>
                {province.find((x) => x.id == data.data.province).province}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Account status:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Chip
                label={accountStatus[data.data.account_status - 1].label}
                color={
                  accountStatus[data.data.account_status - 1].id == 1
                    ? "success"
                    : accountStatus[data.data.account_status - 1].id == 2
                    ? "error"
                    : "secondary"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Date created:</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography>{module.created_at.split("T")[0]}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Box>
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
  api: PropTypes.string.isRequired,
  openViewApproval: PropTypes.bool.isRequired,
  setOpenViewApproval: PropTypes.func.isRequired,
};

export default function ApprovedDialog(props) {
  const { openApproved, setOpenApproved } = props;
  const [data, setData] = useState({});
  const [openViewApproval, setOpenViewApproval] = useState(false);
  const [api, setAPI] = useState("");
  const {
    data: approved,
    error: approved_error,
    isLoading: approved_isLoading,
  } = useSWR("approvals/approved", fetcher);

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
                      <TableCell>Date</TableCell>
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
                            {new Date(row.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">{row.type}</TableCell>
                          <TableCell align="right">
                            {row.account_number}
                          </TableCell>
                          <TableCell align="right">
                            {row.data.account_name}
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
                                if (row.type == "Owner's Equity")
                                  setAPI("owners_equity");
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
          api={api}
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
