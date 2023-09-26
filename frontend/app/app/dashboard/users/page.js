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
import UserDialog from "@/app/modals/user/users_dialog";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const ViewUser = (props) => {
  const { data, openViewUser, setOpenViewUser } = props;

  const handleClose = () => {
    setOpenViewUser(false);
  };

  return (
    <Dialog open={openViewUser} onClose={handleClose}>
      <DialogContent>
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          marginBottom={2}
        >
          User details
        </Typography>
        <Table aria-label="simple table" size="small">
          <TableBody>
            <TableRow>
              <TableCell>Username:</TableCell>
              <TableCell>{data.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email:</TableCell>
              <TableCell>{data.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>First name:</TableCell>
              <TableCell>{data.first_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Middle name:</TableCell>
              <TableCell>{data.middle_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Last name:</TableCell>
              <TableCell>{data.last_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status:</TableCell>
              <TableCell>
                {data.is_active ? (
                  <Chip label="Active" color="success" />
                ) : (
                  <Chip label="Inactive" color="error" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Access:</TableCell>
              <TableCell>
                {data.is_staff ? (
                  <Chip label="Admin" color="primary" />
                ) : (
                  <Chip label="User" color="secondary" />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default function Users() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const {
    data: users,
    error: users_error,
    isLoading: users_isLoading,
    mutate,
  } = useSWR("users/", fetcher);
  const [data, setData] = useState({});
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openViewUser, setOpenViewUser] = useState(false);
  const loading = open && options.length === 0;
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      setOptions(users);
    }
    console.log("asdasd", users);
  }, [open, users]);

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
          setOpenViewUser(true);
        }}
        size="small"
        isOptionEqualToValue={(option, value) =>
          option.first_name === value.title
        }
        getOptionLabel={(option) => option.first_name}
        options={options}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.first_name}
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
            placeholder="Search user"
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

  if (users_isLoading) return <Loading />;

  return (
    <>
      <Typography
        component="h2"
        variant="h5"
        color="primary"
        gutterBottom
        marginBottom={2}
      >
        Users
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setOpenUserDialog(true)}
          color="primary"
          sx={{ marginLeft: 2 }}
        >
          Add user
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
          {users.length != 0 ? (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>First name</TableCell>
                    <TableCell align="right">Middle name</TableCell>
                    <TableCell align="right">Last name</TableCell>
                    <TableCell align="right">Bussiness code</TableCell>
                    <TableCell align="right">Branch code</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Access</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((row) => {
                    // const data = JSON.parse(row.data);
                    return (
                      <TableRow
                        key={row.created_at}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.first_name}
                        </TableCell>
                        <TableCell align="right">{row.middle_name}</TableCell>
                        <TableCell align="right">{row.last_name}</TableCell>
                        <TableCell align="right">{row.business_code}</TableCell>
                        <TableCell align="right">{row.branch_code}</TableCell>
                        <TableCell align="right">
                          {row.is_active ? (
                            <Chip label={"Active"} color={"success"} />
                          ) : (
                            <Chip label={"Active"} color={"error"} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {row.is_staff ? (
                            <Chip label={"Admin"} color={"primary"} />
                          ) : (
                            <Chip label={"User"} color={"secondary"} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            startIcon={<VisibilityIcon />}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setData(row);
                              setOpenViewUser(true);
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
            <Typography align="left">No pending users</Typography>
          )}
        </Box>
      </Box>

      <UserDialog
        openUserDialog={openUserDialog}
        setOpenUserDialog={setOpenUserDialog}
        setIsSuccess={setIsSuccess}
        setSuccessText={setSuccessText}
        mutate={!isEditing ? mutate : UserInfoMutate}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editData={editData}
      />
      {openViewUser && data != null && (
        <ViewUser
          data={data}
          openViewUser={openViewUser}
          setOpenViewUser={setOpenViewUser}
        />
      )}
    </>
  );
}
