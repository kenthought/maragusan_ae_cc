import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Chip from "@mui/material/Chip";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import ContactsDialog from "./contacts_dialog";
import Success from "@/app/utils/success";
import Loading from "@/app/utils/loading";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 600,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
const headCells = [
  {
    id: "personnel",
    numeric: false,
    disablePadding: true,
    label: "Personnel",
  },
  {
    id: "contact_no",
    numeric: false,
    disablePadding: true,
    label: "Contact #",
  },
  {
    id: "designation",
    numeric: false,
    disablePadding: true,
    label: "Designation",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all contacts",
            }}
          />
        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    selected,
    setOpenContactsDialog,
    setIsSuccess,
    setSuccessText,
    setSelected,
    mutate,
    setEditData,
    setIsEditing,
  } = props;

  const handleSuccessful = (bool, text) => {
    setIsSuccess(bool);
    setSuccessText(text);
    setSelected([]);
  };

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenContactsDialog(true)}
            color="primary"
          >
            Add
          </Button>
        )}

        {numSelected > 0 && (
          <>
            {numSelected === 1 ? (
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => {
                    setEditData(selected[0]);
                    setIsEditing(true);
                    setOpenContactsDialog(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
            <Tooltip title="Delete">
              <IconButton
                onClick={() => {
                  var str = "";
                  for (var i = 0; i < numSelected; i++) {
                    str +=
                      selected[i].id.toString() +
                      (numSelected - 1 == i ? "" : ",");
                  }

                  axiosInstance
                    .delete("payables/contacts/" + str)
                    .then((response) => {
                      handleSuccessful(
                        true,
                        "Deleted " +
                          (numSelected === 1 ? " " : numSelected + " items ") +
                          "successfully!"
                      );
                      mutate();
                    });
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  setOpenContactsDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setSuccessText: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  setEditData: PropTypes.func.isRequired,
};

const Contacts = ({ id, payablesMutate }) => {
  const { data, error, isLoading, mutate } = useSWR(
    "payables/get_contacts/" + id,
    fetcher
  );
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openContactsDialog, setOpenContactsDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n);
      setSelected(newSelected);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = stableSort(
    data !== undefined ? data : [],
    getComparator(order, orderBy)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (isLoading) return <Loading />;

  if (error) return <Typography>Error occured while fetching Data!</Typography>;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Success
            isSuccess={isSuccess}
            setIsSuccess={setIsSuccess}
            successText={successText}
          />
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
            setIsSuccess={setIsSuccess}
            setSuccessText={setSuccessText}
            setOpenContactsDialog={setOpenContactsDialog}
            setSelected={setSelected}
            setEditData={setEditData}
            setIsEditing={setIsEditing}
            mutate={mutate}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: "100%" }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.personnel}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.contact_no}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.designation}
                      </TableCell>
                      {/* Add additional cell if there are more data */}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 33 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <ContactsDialog
        openContactsDialog={openContactsDialog}
        setOpenContactsDialog={setOpenContactsDialog}
        setSuccessText={setSuccessText}
        setIsSuccess={setIsSuccess}
        mutate={mutate}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editData={editData}
        payablesId={id}
        payablesMutate={payablesMutate}
        setSelected={setSelected}
      />
    </>
  );
};

export default function PayablesDialog(props) {
  const {
    openPayablesDialog,
    setOpenPayablesDialog,
    setIsSuccess,
    setSuccessText,
    mutate,
    isEditing,
    setIsEditing,
    editData,
  } = props;
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
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const { data: session } = useSession();
  const [newData, setNewData] = useState({
    control_number: "",
    account_name: "",
    purok_street: "",
    contacts: [],
  });
  const [accountType] = useState([
    { id: 1, label: "Funds" },
    { id: 2, label: "Regular" },
    { id: 3, label: "Contacts" },
  ]);
  const [accountStatus] = useState([
    { id: 1, label: "Active" },
    { id: 2, label: "Inactive" },
    { id: 3, label: "Bad Debts" },
  ]);
  const [paymentArrangement] = useState([
    { id: 1, label: "COD" },
    { id: 2, label: "Term" },
  ]);
  const [barangayData, setBarangayData] = useState(null);

  useEffect(() => {
    setNewData(editData);
    if (isEditing) setBarangayData(editData.barangay);

    console.log(editData);
  }, [editData, isEditing]);

  const generateControlNumber = () => {
    var number;
    do {
      number = Math.floor(Math.random() * 9999);
    } while (number < 1);

    return number;
  };

  const handleEditChange = (event) => {
    const value = event.target.value;
    setNewData({ ...newData, [event.target.name]: value });
  };

  const handleClose = () => {
    setOpenPayablesDialog(false);
    setBarangayData(null);
    setIsEditing(false);
  };

  const handleSuccessful = (bool, text) => {
    setIsError(false);
    setIsSuccess(bool);
    setSuccessText(text);
    mutate();
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const postData = {
      control_number: data.get("control_number"),
      account_name: data.get("account_name"),
      purok_street: data.get("purok_street"),
      barangay: barangayData.id,
      municipality: barangayData.municipality.id,
      province: barangayData.municipality.province.id,
      account_type: data.get("account_type"),
      term: data.get("term"),
      payment_arrangement: data.get("payment_arrangement"),
      account_status: !isEditing ? 1 : data.get("account_status"),
      under_approval: !isEditing ? 1 : 0,
      user: session.user.name[1],
    };

    console.log(postData);

    if (!isEditing) {
      postData.forApproval = {
        type: "Payables",
        approval_type: "Add",
        old_data: { ...postData },
        new_data: { ...postData },
        submitted_by: session.user.name[1],
      };
      axiosInstance
        .post("payables/", postData)
        .then((response) => {
          handleSuccessful(true, "Submitted for approval!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(response.message);
        });
    } else {
      // axiosInstance
      //   .put("payables/" + editData.id + "/", postData)
      //   .then((response) => {
      //     handleSuccessful(true, "Payables edited successfully!");
      //     console.log(response);
      //   })
      //   .catch((response) => {
      //     console.log(response);
      //     setIsError(true);
      //     setErrorText(response.message);
      //   });

      const old_data = editData;
      old_data.barangay = editData.barangay.id;
      old_data.municipality = editData.municipality.id;
      old_data.province = editData.province.id;

      const forApproval = {
        type: "Payables",
        approval_type: "Edit",
        module_id: editData.id,
        account_number: editData.account_number,
        old_data: old_data,
        new_data: postData,
        submitted_by: session.user.name[1],
      };

      axiosInstance
        .post("approvals/", forApproval)
        .then((response) => {
          handleSuccessful(true, "Submitted for approval!");
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
          setIsError(true);
          setErrorText(response.message);
        });
    }
  };

  if (
    barangay_isLoading ||
    municipality_isLoading ||
    province_isLoading ||
    !editData
  )
    return;

  return (
    <Dialog open={openPayablesDialog} onClose={handleClose} fullWidth>
      <DialogTitle>{!isEditing ? "Add Payables" : "Edit Payables"}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography color="primary">Payables Information</Typography>
          {/* Control Number */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="control_number"
              label="Control number"
              name="control_number"
              type="text"
              size="small"
              value={generateControlNumber().toString()}
              autoComplete="off"
              readOnly
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="control_number"
              label="Control number"
              name="control_number"
              value={newData.control_number || ""}
              type="text"
              size="small"
              autoComplete="off"
              readOnly
            />
          )}
          {/* Account Name */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="account_name"
              label="Account name"
              name="account_name"
              type="text"
              size="small"
              autoComplete="off"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="account_name"
              label="Account name"
              name="account_name"
              value={newData.account_name || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
              autoComplete="off"
            />
          )}
          {/* Account Type */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="account_type"
              name="account_type"
              label="Account type"
              select
              size="small"
            >
              {accountType.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="account_type"
              name="account_type"
              label="Account type"
              value={
                accountType[newData.account_type - 1]
                  ? accountType[newData.account_type - 1].id
                  : ""
              }
              onChange={handleEditChange}
              select
              error={barangay_error}
              size="small"
            >
              {accountType.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
          {/* Payment Arrangement */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="payment_arrangement"
              name="payment_arrangement"
              label="Payment arrangement"
              select
              size="small"
            >
              {paymentArrangement.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="payment_arrangement"
              name="payment_arrangement"
              label="Payment arrangement"
              value={
                paymentArrangement[newData.payment_arrangement - 1]
                  ? paymentArrangement[newData.payment_arrangement - 1].id
                  : ""
              }
              onChange={handleEditChange}
              select
              error={barangay_error}
              size="small"
            >
              {paymentArrangement.map((option) => (
                <MenuItem key={option.id} value={option.id.toString()}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
          {/* Term */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="term"
              label="Term"
              name="term"
              type="number"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="term"
              label="Term"
              name="term"
              value={newData.term || ""}
              onChange={handleEditChange}
              type="number"
              size="small"
            />
          )}
          {/* Account Status */}
          {isEditing && (
            <TextField
              margin="normal"
              fullWidth
              id="account_status"
              name="account_status"
              label="Account status"
              value={
                accountStatus[newData.account_status - 1]
                  ? accountStatus[newData.account_status - 1].id
                  : ""
              }
              onChange={handleEditChange}
              select
              size="small"
            >
              {accountStatus.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Typography color="secondary" marginTop={1}>
            Address
          </Typography>
          {/* Purok/Street */}
          {!isEditing ? (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="purok_street"
              label="Purok/Street"
              name="purok_street"
              type="text"
              size="small"
            />
          ) : (
            <TextField
              margin="normal"
              required
              autoFocus
              fullWidth
              id="purok_street"
              label="Purok/Street"
              name="purok_street"
              value={newData.purok_street || ""}
              onChange={handleEditChange}
              type="text"
              size="small"
            />
          )}
          {/* Barangay */}
          {!isEditing ? (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.barangay}
              options={barangay}
              size="small"
              onChange={(event, newInputValue) => {
                if (newInputValue != null) setBarangayData(newInputValue);
              }}
              renderOption={(props, option) => {
                console.log(option);
                return (
                  <li {...props} key={option.id}>
                    {option.barangay +
                      ", " +
                      option.municipality.municipality +
                      ", " +
                      option.municipality.province.province}
                  </li>
                );
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                  />
                ));
              }}
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  required
                  id="barangay"
                  label="Barangay"
                  name="barangay"
                  fullWidth
                  {...params}
                />
              )}
            />
          ) : (
            <Autocomplete
              disablePortal
              getOptionLabel={(option) => option.barangay}
              options={barangay}
              size="small"
              value={newData.barangay || null}
              onChange={(event, newInputValue) => {
                setBarangayData(newInputValue);
              }}
              inputValue={barangayData ? barangayData.barangay : ""}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.barangay +
                      ", " +
                      option.municipality.municipality +
                      ", " +
                      option.municipality.province.province}
                  </li>
                );
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                  />
                ));
              }}
              renderInput={(params) => (
                <TextField
                  margin="normal"
                  required
                  id="barangay"
                  label="Barangay"
                  name="barangay"
                  fullWidth
                  {...params}
                />
              )}
            />
          )}
          {/* Municipality */}
          <TextField
            margin="normal"
            fullWidth
            label="Municipality"
            value={barangayData ? barangayData.municipality.municipality : ""}
            onChange={handleEditChange}
            type="text"
            size="small"
            readOnly
          />
          {/* Province */}
          <TextField
            margin="normal"
            fullWidth
            label="Province"
            value={
              barangayData ? barangayData.municipality.province.province : ""
            }
            onChange={handleEditChange}
            type="text"
            size="small"
            readOnly
          />
          {/* {isEditing && (
            <>
              <Typography color="secondary" sx={{ mt: 1, mb: 1 }}>
                Contacts
              </Typography>
              <Contacts id={editData.id} payablesMutate={mutate} />
            </>
          )} */}
          {isError ? <Alert severity="error">{errorText}</Alert> : <></>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="success">
            {!isEditing ? "Add" : "Edit"}
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

PayablesDialog.propTypes = {
  openPayablesDialog: PropTypes.bool.isRequired,
  setOpenPayablesDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
};
