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
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
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
import OwnersEquityView from "./views/owners_equity";
import BankAccount from "./views/bank_account";
import { MaskPasswordInput } from "@/app/utils/mask_password_input";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const EnterUserPassword = (props) => {
  const {
    openEnterUserPassword,
    setOpenEnterUserPassword,
    data,
    setIsSuccess,
    setSuccessText,
    approvalsMutate,
    closeViewApproval,
  } = props;
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const { data: session } = useSession();

  const handleClose = () => {
    setOpenEnterUserPassword(false);
    closeViewApproval();
  };

  const handleSuccessful = (bool, text) => {
    setIsError(false);
    setIsSuccess(bool);
    setSuccessText(text);
    approvalsMutate();
    handleClose();
  };

  const handleSubmit = () => {
    data.approved_by = session.user.name[1];
    data.password = password;

    axiosInstance
      .put("approvals/" + data.id + "/", data)
      .then((response) => {
        handleSuccessful(true, data.approval_type + "ed successfully!");
        console.log(response);
      })
      .catch((response) => {
        console.log(response);
        setIsError(true);
        setErrorText(response.response.data);
      });
  };

  return (
    <Dialog open={openEnterUserPassword} onClose={handleClose}>
      <DialogTitle>{data.approval_type + " " + data.type}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To proceed please enter your password.
        </DialogContentText>
        {isError ? <Alert severity="error">{errorText}</Alert> : <></>}
        <TextField
          autoFocus
          margin="normal"
          id="password"
          label="Password"
          type="text"
          fullWidth
          variant="standard"
          autoComplete="off"
          InputProps={{ inputComponent: MaskPasswordInput }}
          onChange={(event) => setPassword(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

EnterUserPassword.propTypes = {
  data: PropTypes.object.isRequired,
  openEnterUserPassword: PropTypes.bool.isRequired,
  setOpenEnterUserPassword: PropTypes.func.isRequired,
  approvalsMutate: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setSuccessText: PropTypes.func.isRequired,
  closeViewApproval: PropTypes.func.isRequired,
};

const ViewApproval = (props) => {
  const {
    data,
    openViewApproval,
    setOpenViewApproval,
    approvalsMutate,
    setIsSuccess,
    setSuccessText,
  } = props;
  const [openEnterUserPassword, setOpenEnterUserPassword] = useState(false);
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

  const handleClose = () => {
    setOpenViewApproval(false);
  };

  if (
    barangay_isLoading ||
    municipality_isLoading ||
    province_isLoading ||
    bank_isLoading
  )
    return;

  return (
    <>
      <Dialog open={openViewApproval} onClose={handleClose}>
        <DialogContent>
          {data.type == "Owner's Equity" && (
            <OwnersEquityView
              data={data}
              barangay={barangay}
              municipality={municipality}
              province={province}
            />
          )}
          {data.type == "Bank Account" && (
            <BankAccount
              data={data}
              barangay={barangay}
              municipality={municipality}
              province={province}
              bank={bank}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEnterUserPassword(true)}
            variant="contained"
            color="success"
          >
            {data.approval_type}
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <EnterUserPassword
        openEnterUserPassword={openEnterUserPassword}
        setOpenEnterUserPassword={setOpenEnterUserPassword}
        data={data}
        approvalsMutate={approvalsMutate}
        setIsSuccess={setIsSuccess}
        setSuccessText={setSuccessText}
        closeViewApproval={handleClose}
      />
    </>
  );
};

ViewApproval.propTypes = {
  data: PropTypes.object.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setSuccessText: PropTypes.func.isRequired,
  openViewApproval: PropTypes.bool.isRequired,
  setOpenViewApproval: PropTypes.func.isRequired,
  approvalsMutate: PropTypes.func.isRequired,
};

export default function Approvals() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const {
    data: approvals,
    error: approvals_error,
    isLoading: approvals_isLoading,
    mutate,
  } = useSWR("approvals/", fetcher);
  const [data, setData] = useState({});
  const [openViewApproval, setOpenViewApproval] = useState(false);
  const [openApproved, setOpenApproved] = useState(false);
  const loading = open && options.length === 0;
  const [isSuccess, setIsSuccess] = useState(false);
  const [selected, setSelected] = useState(null);
  const [successText, setSuccessText] = useState("");

  useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      setOptions(approvals);
    }
  }, [open, approvals]);

  const search = (
    <>
      <Autocomplete
        freeSolo
        id="asynchronous-demo"
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(event, newValue) => {
          setData(newValue);
          setOpenViewApproval(true);
        }}
        size="small"
        isOptionEqualToValue={(option, value) =>
          option.old_data.account_name === value.title
        }
        getOptionLabel={(option) => option.old_data.account_name}
        options={options}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.old_data.account_name}
            </li>
          );
        }}
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option, index) => (
            <Chip {...getTagProps({ index })} key={option} label={option} />
          ));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search Account"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <SearchIcon color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    </>
  );

  if (approvals_error) return <Typography>Unable to fetch data!</Typography>;

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
      {search}
      <Box elevation={0} sx={{ padding: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Success
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            successText={successText}
          />
          {approvals.length != 0 ? (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell align="right">Approval</TableCell>
                    <TableCell align="right">Type</TableCell>
                    <TableCell align="right">Account #</TableCell>
                    <TableCell align="right">Account name</TableCell>
                    <TableCell align="right">Requested by</TableCell>
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
                          {new Date(row.created_at).toLocaleDateString() +
                            " " +
                            new Date(row.created_at).toLocaleTimeString()}
                        </TableCell>
                        <TableCell align="right">{row.approval_type}</TableCell>
                        <TableCell align="right">{row.type}</TableCell>
                        <TableCell align="right">
                          {row.account_number}
                        </TableCell>
                        <TableCell align="right">
                          {row.old_data.account_name}
                        </TableCell>
                        <TableCell align="right">
                          {row.submitted_by.first_name}
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
      {openViewApproval && data != null && (
        <ViewApproval
          data={data}
          openViewApproval={openViewApproval}
          setOpenViewApproval={setOpenViewApproval}
          approvalsMutate={mutate}
          setSuccessText={setSuccessText}
          setIsSuccess={setIsSuccess}
        />
      )}
      {openApproved && (
        <ApprovedDialog
          openApproved={openApproved}
          setOpenApproved={setOpenApproved}
        />
      )}
    </>
  );
}
