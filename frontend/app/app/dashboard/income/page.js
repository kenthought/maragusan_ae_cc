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
import IncomeDialog from "@/app/modals/income/income_dialog";
import LedgerDialog from "@/app/modals/income/ledger_dialog";
import SummaryDialog from "@/app/modals/income/summary_dialog";
import Success from "@/app/utils/success";
import Loading from "@/app/utils/loading";
import useSWR from "swr";
import axiosInstance from "@/app/axios";
import PropTypes from "prop-types";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);
const IncomeInformation = (props) => {
  const {
    id,
    setEditData,
    setIsEditing,
    setIncomeInfoMutate,
    setOpenIncomeDialog,
    setOpenLedgerDialog,
  } = props;
  const { data, error, isLoading, mutate } = useSWR("/income/" + id, fetcher);
  const [accountStatus] = useState([
    { id: 1, label: "Active" },
    { id: 2, label: "Inactive" },
    { id: 3, label: "Bad Debts" },
  ]);

  const buttons = [
    <Button key="two" onClick={() => setOpenLedgerDialog(true)}>
      Ledger
    </Button>,
    <Button
      key="four"
      startIcon={<EditIcon />}
      onClick={() => {
        setEditData(data);
        setIsEditing(true);
        setIncomeInfoMutate(() => mutate);
        setOpenIncomeDialog(true);
      }}
      color="secondary"
    >
      Edit
    </Button>,
  ];

  if (isLoading) return <Loading />;

  if (error) return <Typography>Unable to fetch data!</Typography>;

  return (
    <Card sx={{ padding: 2, position: "relative", width: 600 }}>
      <Typography component="h2" variant="h6" color="primary" marginBottom={2}>
        Income Information
      </Typography>

      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        sx={{ marginBottom: 2 }}
        size="small"
        disabled={data.under_approval}
      >
        {buttons}
      </ButtonGroup>

      {data.under_approval && (
        <Box>
          <Chip label="For approval" color="warning" />
        </Box>
      )}
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
            <Typography>Description:</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography>{data.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {!data.under_approval && (
            <>
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
            </>
          )}
          <Grid item xs={12} md={4}>
            <Typography>Date created:</Typography>
          </Grid>
          <Grid item xs={12} md={8}>
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
export default function Income() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { data, error, isLoading, mutate } = useSWR("/income", fetcher);
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const [openLedgerDialog, setOpenLedgerDialog] = useState(false);
  const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const loading = open && options.length === 0;
  const [selected, setSelected] = useState(null);
  const [incomeInfoMutate, setIncomeInfoMutate] = useState();

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
        sx={{ width: 385, mt: 2 }}
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
        Income
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenIncomeDialog(true)}
          color="primary"
          sx={{ marginLeft: 2 }}
        >
          Add
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenSummaryDialog(true)}
          sx={{ ml: 2 }}
        >
          Summary
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
                <IncomeInformation
                  id={selected.id}
                  setEditData={setEditData}
                  setIsEditing={setIsEditing}
                  setIncomeInfoMutate={setIncomeInfoMutate}
                  setOpenIncomeDialog={setOpenIncomeDialog}
                  setOpenLedgerDialog={setOpenLedgerDialog}
                />
              </Box>
            </Fade>
          )}
        </Box>
      </Box>
      <IncomeDialog
        openIncomeDialog={openIncomeDialog}
        setOpenIncomeDialog={setOpenIncomeDialog}
        setIsSuccess={setIsSuccess}
        setSuccessText={setSuccessText}
        mutate={!isEditing ? mutate : incomeInfoMutate}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editData={editData}
      />
      <SummaryDialog
        openSummaryDialog={openSummaryDialog}
        setOpenSummaryDialog={setOpenSummaryDialog}
      />
      {selected && (
        <>
          <LedgerDialog
            openLedgerDialog={openLedgerDialog}
            setOpenLedgerDialog={setOpenLedgerDialog}
            selected={selected}
            dialogName="Income Ledger"
          />
        </>
      )}
    </>
  );
}
