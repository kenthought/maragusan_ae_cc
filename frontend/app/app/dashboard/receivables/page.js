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
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ReceivablesDialog from "@/app/modals/receivables/receivables_dialog";
import LedgerDialog from "@/app/modals/receivables/ledger_dialog";
import Success from "@/app/utils/success";
import Loading from "@/app/utils/loading";
import useSWR from "swr";
import axiosInstance from "@/app/axios";
import PropTypes from "prop-types";
import LendingWindow from "@/app/modals/receivables/lending_window";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const ReceivablesInformation = (props) => {
  const {
    id,
    setEditData,
    setIsEditing,
    setReceivablesInfoMutate,
    setOpenReceivablesDialog,
    setOpenLedgerDialog,
    setOpenLendingWindow,
  } = props;
  const { data, error, isLoading, mutate } = useSWR(
    "/receivables/" + id,
    fetcher
  );
  const [creditTerms] = useState([
    { id: 1, value: 1 },
    { id: 2, value: 7 },
    { id: 3, value: 15 },
    { id: 4, value: 21 },
    { id: 5, value: 30 },
    { id: 6, value: 45 },
    { id: 7, value: 60 },
  ]);
  const [employmentStatus] = useState([
    { id: 1, label: "Regular" },
    { id: 2, label: "Provisional" },
    { id: 3, label: "Contractual" },
  ]);
  const [funds] = useState([{ id: 1, label: "GCash" }]);
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
    { id: 3, label: "Bad Debts", value: false },
  ]);
  const [accountCategory] = useState([
    { id: 1, label: "Employee" },
    { id: 2, label: "Funds" },
    { id: 3, label: "Temp charge" },
    { id: 4, label: "Customer" },
  ]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const buttons = [
    <Button key="one" onClick={() => setOpenLedgerDialog(true)}>
      Ledger
    </Button>,
    <Button key="two">Summary</Button>,
    <Button
      key="three"
      startIcon={<EditIcon />}
      onClick={() => {
        setEditData(data);
        setIsEditing(true);
        setReceivablesInfoMutate(() => mutate);
        setOpenReceivablesDialog(true);
      }}
      color="secondary"
    >
      Edit
    </Button>,
  ];

  const buttons2 = [
    <Button key="five" onClick={() => setOpenLendingWindow(true)}>
      Lending Window
    </Button>,
    <Button key="six">1st Payment Period</Button>,
  ];

  if (isLoading) return <Loading />;

  if (error) return <Typography>Unable to fetch data!</Typography>;

  return (
    <Card sx={{ padding: 2, position: "relative" }}>
      <Typography component="h2" variant="h6" color="primary" marginBottom={2}>
        Receivables Information
      </Typography>
      <Grid container spacing={1} mb={2} direction="row" alignItems="end">
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <Typography component="div" variant="h7" mb={1}>
                Term: {data.company.frequency.frequency}
              </Typography>
            </Grid>
            <Grid item>
              <ButtonGroup
                variant="contained"
                aria-label="outlined success button group"
                size="small"
              >
                {buttons2}
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            size="small"
          >
            {buttons}
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid direction="row" container>
        <Grid item justifyContent="flex-start" padding={1} xs={12} md={6}>
          {/* Account Information */}
          <Card sx={{ padding: 2, position: "relative", mb: 1 }}>
            <Grid container padding={1} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
              </Grid>
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
                <Typography>{data.account_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Spouse name:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.spouse_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Purok/Street:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.purok_street}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Barangay:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.barangay.barangay}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Municipality:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.municipality.municipality}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Province:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.province.province}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Account status:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Chip
                  label={
                    accountStatus.find((x) => x.id === data.account_status)
                      .label
                  }
                  color={
                    accountStatus.find((x) => x.id == data.account_status).id ==
                    1
                      ? "success"
                      : accountStatus.find((x) => x.id == data.account_status)
                          .id == 2
                      ? "error"
                      : "secondary"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Credit Terms:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.credit_terms} days</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Credit Limit:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.credit_limit}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Category:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>
                  {
                    accountCategory.find((x) => x.id === data.account_category)
                      .label
                  }
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Contact number 1:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.contact_number1}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Contact number 2:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.contact_number2}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Date created:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{data.created_at.split("T")[0]}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
            {/* Salary ATM/Funds transfer */}
            <Grid container padding={1} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Salary ATM details
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Account name:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.bank_account_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Bank account number:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.bank_account_number}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Bank:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.bank.bank}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Bank branch:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.bank_branch}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Card number:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.card_number}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Card pin:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.card_pin}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Fund transfer account
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Send to:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>
                  {funds.find((x) => x.id === data.send_to).label}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Registered name:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.funds_registered_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Account number:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.funds_account_number}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item justifyContent="flex-start" padding={1} xs={12} md={6}>
          {/* Employment Information */}
          <Card sx={{ padding: 2, position: "relative", mb: 1 }}>
            <Grid container padding={1} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Employment Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Company:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.company.company}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Company address:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.company.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Supervisor:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.supervisor}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Assignment:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.assignment}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Company ID:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.company_id_number}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Frequency:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.company.frequency.frequency}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Date hired:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>
                  {new Date(data.date_hired).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Status:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>
                  {
                    employmentStatus.find((x) => x.id == data.employment_status)
                      .label
                  }
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
            {/* Co-maker/agent */}
            <Grid container padding={1} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Co-maker/agent
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Co-maker:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.co_maker.province}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Agent:</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography>{data.agent.province}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default function Receivables() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("/receivables", fetcher);
  const [openReceivablesDialog, setOpenReceivablesDialog] = useState(false);
  const [openLedgerDialog, setOpenLedgerDialog] = useState(false);
  const [openLendingWindow, setOpenLendingWindow] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const loading = open && options.length === 0;
  const [selected, setSelected] = useState(null);
  const [receivablesInfoMutate, setReceivablesInfoMutate] = useState();

  useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      setOptions(data);
    }
  }, [open, data]);

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
          console.log(newValue);
          setSelected(newValue);
        }}
        size="small"
        isOptionEqualToValue={(option, value) =>
          option.account_name === value.title
        }
        getOptionLabel={(option) => option.account_name}
        options={options}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.account_name}
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

  return (
    <>
      <Typography
        component="h2"
        variant="h5"
        color="primary"
        gutterBottom
        marginBottom={2}
      >
        Receivables Information
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenReceivablesDialog(true)}
          color="primary"
          sx={{ marginLeft: 2 }}
        >
          Add
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
          {selected && (
            <Fade in={true}>
              <Box
                sx={{
                  padding: 2,
                  textAlign: "left",
                  justifyItems: "bottom",
                }}
              >
                <ReceivablesInformation
                  id={selected.id}
                  setEditData={setEditData}
                  setIsEditing={setIsEditing}
                  setReceivablesInfoMutate={setReceivablesInfoMutate}
                  setOpenReceivablesDialog={setOpenReceivablesDialog}
                  setOpenLedgerDialog={setOpenLedgerDialog}
                  setOpenLendingWindow={setOpenLendingWindow}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
      <ReceivablesDialog
        openReceivablesDialog={openReceivablesDialog}
        setOpenReceivablesDialog={setOpenReceivablesDialog}
        setIsSuccess={setIsSuccess}
        setSuccessText={setSuccessText}
        mutate={!isEditing ? mutate : receivablesInfoMutate}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editData={editData}
      />
      {selected && (
        <>
          <LedgerDialog
            openLedgerDialog={openLedgerDialog}
            setOpenLedgerDialog={setOpenLedgerDialog}
            selected={selected}
            dialogName="Receivables Ledger"
          />
          <LendingWindow
            openLendingWindow={openLendingWindow}
            setOpenLendingWindow={setOpenLendingWindow}
            selected={selected}
          />
        </>
      )}
    </>
  );
}
