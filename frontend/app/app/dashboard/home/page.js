"use client";

import Fade from "@mui/material/Fade";
import { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import useSWR from "swr";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Loading from "@/app/utils/loading";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSession } from "next-auth/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "grey",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function Home() {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR(
    "/dailyClosingToday/" +
      session.user.name[1] +
      "/" +
      new Date().getFullYear() +
      "/" +
      (new Date().getMonth() + 1) +
      "/" +
      new Date().getDate(),
    fetcher
  );
  const [dailyClosingDate, setDailyClosingDate] = useState();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (data != null) setItems(data);
  }, [data]);

  const getDailyClosing = (date) => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var date = date.getDate();
    axiosInstance
      .get(
        "/dailyClosingToday/" +
          session.user.name[1] +
          "/" +
          year +
          "/" +
          month +
          "/" +
          date
      )
      .then((response) => {
        setItems(response.data);
      });
  };

  if (error) return <Typography>Unable to fetch data!</Typography>;
  if (isLoading) return <Loading />;
  return (
    <Fade in={true}>
      <Box>
        <Typography variant="h6" color="primary" marginBottom={1}>
          Daily closing of entries
        </Typography>
        <Box sx={{ mb: 1, mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dailyClosingDate || dayjs(new Date())}
              onChange={(newValue) => {
                setDailyClosingDate(newValue);
                getDailyClosing(new Date(newValue));
              }}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
        </Box>
        <Divider />
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell align="right">Time</StyledTableCell>
                <StyledTableCell align="right">TransNo</StyledTableCell>
                <StyledTableCell align="right">Ledger</StyledTableCell>
                <StyledTableCell align="right">Account #</StyledTableCell>
                <StyledTableCell align="right">Account Name</StyledTableCell>
                <StyledTableCell align="right">Particulars</StyledTableCell>
                <StyledTableCell align="right">Cash in</StyledTableCell>
                <StyledTableCell align="right">Cash out</StyledTableCell>
                <StyledTableCell align="right">Balance</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length != 0 ? (
                items.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">
                      {new Date(row.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(row.created_at).toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="right">{row.trans_number}</TableCell>
                    <TableCell align="left">{row.ledger}</TableCell>
                    <TableCell align="right">{row.account_number}</TableCell>
                    <TableCell align="right">{row.account_name}</TableCell>
                    <TableCell align="right">{row.particulars}</TableCell>
                    <TableCell align="right">{row.cash_in}</TableCell>
                    <TableCell align="right">{row.cash_out}</TableCell>
                    <TableCell align="right">{row.balance}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No data to show
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {items.length != 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={10} align="left">
                    <Typography component="div">
                      Cash on hand: {items[items.length - 1].balance}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
}
