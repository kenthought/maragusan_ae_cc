"use client";

import { Fragment, useEffect, useState } from "react";
import Fade from "@mui/material/Fade";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CssBaseline from "@mui/material/CssBaseline";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ApprovedDialog from "@/app/modals/approval/approved_dialog";
import Success from "@/app/utils/success";
import Loading from "@/app/utils/loading";
import useSWR from "swr";
import axiosInstance from "@/app/axios";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const ViewApproval = (props) => {
  const { data, api, openViewApproval, setOpenViewApproval, approvalsMutate } =
    props;
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);

  const handleSuccessful = (bool, text) => {
    setIsError(false);
    setIsSuccess(bool);
    setSuccessText(text);
    approvalsMutate();
    handleClose();
  };

  const handleEdit = () => {
    data.approved_by = session.user.name[1];
    console.log("DATA", data);
    axiosInstance
      .put("approvals/" + data.id + "/", data)
      .then((response) => {
        handleSuccessful(true, "Owners Equity edited successfully!");
        console.log(response);
      })
      .catch((response) => {
        console.log(response);
        setIsError(true);
        setErrorText(response.message);
      });
  };

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
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          marginBottom={2}
        >
          Edit {data.type}
        </Typography>
        <Box>
          <Success
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            successText={successText}
          />
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
              <Typography>
                {module.account_name + " => " + data.data.account_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Purok/Street:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>
                {module.purok_street + " => " + data.data.purok_street}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography>Barangay:</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography>
                {module.barangay.barangay +
                  " => " +
                  barangay.find((x) => x.id == data.data.barangay).barangay}
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
                {module.municipality.municipality +
                  " => " +
                  municipality.find((x) => x.id == data.data.municipality)
                    .municipality}
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
                {module.province.province +
                  " => " +
                  province.find((x) => x.id == data.data.province).province}
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
                label={accountStatus[module.account_status - 1].label}
                color={
                  accountStatus[module.account_status - 1].id == 1
                    ? "success"
                    : accountStatus[module.account_status - 1].id == 2
                    ? "error"
                    : "secondary"
                }
              />
              {"    =>   "}
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
        {isError ? <Alert severity="error">{errorText}</Alert> : <></>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEdit} variant="contained" color="success">
          Edit
        </Button>
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
  approvalsMutate: PropTypes.func.isRequired,
};

export default function Approvals() {
  const {
    data: approvals,
    error: approvals_error,
    isLoading: approvals_isLoading,
    mutate,
  } = useSWR("approvals/", fetcher);
  const [data, setData] = useState({});
  const [openViewApproval, setOpenViewApproval] = useState(false);
  const [openApproved, setOpenApproved] = useState(false);
  const [api, setAPI] = useState("");

  if (approvals_isLoading) return <Loading />;

  return (
    <>
      <Typography
        component="h2"
        variant="h5"
        color="primary"
        gutterBottom
        marginBottom={2}
      >
        Approvals
        <Button
          variant="outlined"
          onClick={() => setOpenApproved(true)}
          color="primary"
          sx={{ marginLeft: 2 }}
        >
          Approved
        </Button>
      </Typography>
      <Box elevation={0} sx={{ padding: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          {approvals.length != 0 ? (
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
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvals.map((row) => {
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
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography align="left">No pending approvals</Typography>
          )}
        </Box>
      </Box>
      {openViewApproval && (
        <ViewApproval
          data={data}
          api={api}
          openViewApproval={openViewApproval}
          setOpenViewApproval={setOpenViewApproval}
          approvalsMutate={mutate}
        />
      )}
      <ApprovedDialog
        openApproved={openApproved}
        setOpenApproved={setOpenApproved}
      />
    </>
  );
}
