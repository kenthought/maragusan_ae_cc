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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import BankAccountDialog from "@/app/modals/bank_account/bank_account_dialog";
import LedgerDialog from "@/app/modals/bank_account/ledger_dialog";
import Success from "@/app/utils/success";
import Loading from "@/app/utils/loading";
import useSWR from "swr";
import axiosInstance from "@/app/axios";
import PropTypes from "prop-types";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const BankAccountInformation = (props) => {
  const {
    id,
    setEditData,
    setIsEditing,
    setBankAccountInfoMutate,
    setOpenBankAccountDialog,
    setOpenLedgerDialog,
  } = props;
  const { data, error, isLoading, mutate } = useSWR(
    "/bank_account/" + id,
    fetcher
  );
  const [accountType] = useState([
    { id: 1, label: "Current" },
    { id: 2, label: "Savings" },
  ]);
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
  ]);

  const buttons = [
    <Button key="two" onClick={() => setOpenLedgerDialog(true)}>
      Ledger
    </Button>,
    <Button key="three">Summary</Button>,
    <Button
      key="four"
      startIcon={<EditIcon />}
      onClick={() => {
        setEditData(data);
        setIsEditing(true);
        setBankAccountInfoMutate(() => mutate);
        setOpenBankAccountDialog(true);
      }}
      color="secondary"
    >
      Edit
    </Button>,
  ];

  if (isLoading) return <Loading />;

  if (error) return <Typography>Unable to fetch data!</Typography>;

  return (
    <Card sx={{ padding: 2, position: "relative" }}>
      <Typography component="h2" variant="h6" color="primary" marginBottom={2}>
        Bank Records Information
      </Typography>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        sx={{ marginBottom: 2 }}
        size="small"
      >
        {buttons}
      </ButtonGroup>
      <Grid item xs={8}></Grid>
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
            <Typography>{data.account_name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography>Account type:</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography>{accountType[data.account_type - 1].label}</Typography>
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
              label={accountStatus[data.account_status - 1].label}
              color={
                accountStatus[data.account_status - 1].id == 1
                  ? "success"
                  : accountStatus[data.account_status - 1].id == 2
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
            <Typography>{data.created_at.split("T")[0]}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default function BankAccount() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("/bank_account", fetcher);
  const [openBankAccountDialog, setOpenBankAccountDialog] = useState(false);
  const [openLedgerDialog, setOpenLedgerDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const loading = open && options.length === 0;
  const [selected, setSelected] = useState(null);
  const [bankAccountInfoMutate, setBankAccountInfoMutate] = useState();

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

  if (error) return <Typography>Unable to fetch data!</Typography>;

  if (isLoading) return <Loading />;

  return (
    <>
      <Typography
        component="h2"
        variant="h5"
        color="primary"
        gutterBottom
        marginBottom={2}
      >
        Bank Records Information
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenBankAccountDialog(true)}
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
                <BankAccountInformation
                  id={selected.id}
                  setEditData={setEditData}
                  setIsEditing={setIsEditing}
                  setBankAccountInfoMutate={setBankAccountInfoMutate}
                  setOpenBankAccountDialog={setOpenBankAccountDialog}
                  setOpenLedgerDialog={setOpenLedgerDialog}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
      <BankAccountDialog
        openBankAccountDialog={openBankAccountDialog}
        setOpenBankAccountDialog={setOpenBankAccountDialog}
        setIsSuccess={setIsSuccess}
        setSuccessText={setSuccessText}
        mutate={!isEditing ? mutate : bankAccountInfoMutate}
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
            dialogName="Bank Ledger"
          />
        </>
      )}
    </>
  );
}
