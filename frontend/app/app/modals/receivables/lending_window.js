import { useState, useEffect, forwardRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import axiosInstance from "@/app/axios";
import Success from "../../utils/success";
import Loading from "@/app/utils/loading";
import DebitAndCreditDialog from "./debit_and_credit_dialog";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const ErrorTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.error.main,
  },
}));

const SuccessTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    color: theme.palette.success.main,
    fontWeight: "bold",
  },
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EnhancedTableToolbar(props) {
  const { selected } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickOverLimit = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Grid container direction="row">
          <Grid item p={1}>
            <TextField
              margin="dense"
              label="Payment period"
              fullWidth
              size="small"
              InputProps={{ disableUnderline: true }}
              value={selected.account_number}
              readOnly
            />
          </Grid>
          <Grid item p={1}>
            <TextField
              margin="dense"
              label="Terms"
              fullWidth
              size="small"
              InputProps={{ disableUnderline: true }}
              value={selected.company.frequency.frequency}
              readOnly
            />
          </Grid>
          <Grid item p={1}>
            <TextField
              margin="dense"
              label="Date"
              fullWidth
              size="small"
              variant="standard"
              InputProps={{ disableUnderline: true }}
              value={today.toDateString()}
              readOnly
            />
          </Grid>
          <Grid item p={1}>
            <TextField
              margin="dense"
              label="Time"
              fullWidth
              size="small"
              variant="standard"
              InputProps={{ disableUnderline: true }}
              value={today.toLocaleTimeString()}
              readOnly
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup
              variant="contained"
              aria-label="outlined success button group"
              size="small"
            >
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClickMenu}
              >
                Menu
              </Button>
              <Button
                id="basic-button2"
                aria-controls={open2 ? "basic-menu2" : undefined}
                aria-haspopup="true"
                aria-expanded={open2 ? "true" : undefined}
                onClick={handleClickOverLimit}
              >
                Over limit approval
              </Button>
              <Button key="nine">Loans history</Button>
              <Button key="ten">Savings ledger</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>Loans</MenuItem>
          <MenuItem onClick={handleClose}>Cash advance</MenuItem>
          <MenuItem onClick={handleClose}>Trade</MenuItem>
          <MenuItem onClick={handleClose}>Payments</MenuItem>
        </Menu>
        <Menu
          id="basic-menu2"
          anchorEl={anchorEl2}
          open={open2}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button2",
          }}
        >
          <MenuItem onClick={handleClose}>Cash advance</MenuItem>
          <MenuItem onClick={handleClose}>Trade</MenuItem>
          <MenuItem onClick={handleClose}>Edit deduction</MenuItem>
          <MenuItem onClick={handleClose}>Edit limit and interest</MenuItem>
        </Menu>
      </Toolbar>
    </>
  );
}

export default function LendingWindow(props) {
  const { openLendingWindow, setOpenLendingWindow, selected } = props;
  const [funds] = useState([{ id: 1, label: "GCash" }]);

  const handleClose = () => {
    setOpenLendingWindow(false);
  };
  return (
    <Dialog
      open={openLendingWindow}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullScreen
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="h2">
            Lending Window
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Account #"
                  fullWidth
                  size="small"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={selected.account_number}
                  readOnly
                />
                <TextField
                  margin="dense"
                  label="Account name"
                  fullWidth
                  size="small"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={selected.account_name}
                  readOnly
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Company"
                  fullWidth
                  size="small"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={selected.company.company}
                  readOnly
                />
                <TextField
                  margin="dense"
                  label="Cash advance rate"
                  fullWidth
                  size="small"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={selected.account_number}
                  readOnly
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  label="Penalty rate"
                  fullWidth
                  size="small"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={selected.account_name}
                  readOnly
                />
                <TextField
                  margin="dense"
                  label="Salary schedule:"
                  fullWidth
                  size="small"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={selected.company.schedule.schedule}
                  readOnly
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  label="Payable limit"
                  fullWidth
                  size="small"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={selected.account_number}
                  readOnly
                />
                <TextField
                  margin="dense"
                  label="Limit balance"
                  fullWidth
                  size="small"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  value={selected.account_name}
                  readOnly
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Table */}
          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={12}>
                <Paper sx={{ width: "100%" }}>
                  <EnhancedTableToolbar selected={selected} />
                  <TableContainer sx={{ maxHeight: 500 }}>
                    <Table
                      sx={{ minWidth: 1500 }}
                      aria-labelledby="Transaction"
                      stickyHeader
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Voucher #</TableCell>
                          <TableCell>Particulars</TableCell>
                          <TableCell>TOP</TableCell>
                          <TableCell>Loan Int.</TableCell>
                          <TableCell>Loan</TableCell>
                          <TableCell>Int amount</TableCell>
                          <TableCell>Deductions</TableCell>
                          <TableCell>Prev Bal</TableCell>
                          <TableCell>Penalty</TableCell>
                          <TableCell>Cash Adv</TableCell>
                          <TableCell>Interest</TableCell>
                          <TableCell>Trade</TableCell>
                          <TableCell>Payments</TableCell>
                          <TableCell>Cash</TableCell>
                          <TableCell>User</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{new Date().toDateString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* Menu */}
                  <Box sx={{ p: 1 }}>
                    <Grid container>
                      <Grid item xs={12} md={2}>
                        <TextField
                          margin="dense"
                          label="Send to"
                          fullWidth
                          size="small"
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          value={
                            funds.find((x) => x.id === selected.send_to).label
                          }
                          readOnly
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          margin="dense"
                          label="Registered name"
                          fullWidth
                          size="small"
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          value={selected.funds_registered_name}
                          readOnly
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          margin="dense"
                          label="Account number"
                          fullWidth
                          size="small"
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          value={selected.funds_account_number}
                          readOnly
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          {/* Computation */}
          <Grid item xs={2}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table aria-labelledby="Computation" size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={2}>Loan amount:</TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Deductions:</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>123213</TableCell>
                    </TableRow>
                    <TableRow>
                      <SuccessTableCell colSpan={2} align="center">
                        Loan balance:
                      </SuccessTableCell>
                      <SuccessTableCell>123</SuccessTableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Deductions:</TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Prev balance:</TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Penalty:</TableCell>
                      <TableCell>-</TableCell>
                      <ErrorTableCell>123</ErrorTableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Cash advance:</TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Interest:</TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Trade:</TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <SuccessTableCell colSpan={2} align="center">
                        Total payables:
                      </SuccessTableCell>
                      <SuccessTableCell sx={{ fontWeight: "bold" }}>
                        123
                      </SuccessTableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        Total payment:
                      </TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <SuccessTableCell colSpan={2} align="center">
                        Total balance:
                      </SuccessTableCell>
                      <SuccessTableCell>123</SuccessTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table aria-labelledby="Computation" size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={2}>Loan balance:</TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total balance:</TableCell>
                      <TableCell>+</TableCell>
                      <TableCell>123</TableCell>
                    </TableRow>
                    <TableRow>
                      <SuccessTableCell colSpan={2} align="right">
                        Grand balance:
                      </SuccessTableCell>
                      <SuccessTableCell>123</SuccessTableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

LendingWindow.propTypes = {
  openLendingWindow: PropTypes.bool.isRequired,
  setOpenLendingWindow: PropTypes.func.isRequired,
  selected: PropTypes.object,
};
