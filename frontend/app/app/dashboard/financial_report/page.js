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

const numFormat = (num) => {
  return `${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export default function FinancialReport() {
  const { data, error, isLoading } = useSWR("/financial-report/", fetcher);

  if (error) return <Typography>Unable to fetch data!</Typography>;
  if (isLoading) return <Loading />;

  return (
    <Fade in={true}>
      <Box>
        <Typography variant="h6" color="primary" marginBottom={1}>
          Financial Report
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  ASSETS
                  <Table>
                    <TableRow>
                      <TableCell align="left" width="30%">
                        Asset
                      </TableCell>
                      <TableCell align="left">
                        {numFormat(
                          !isNaN(parseFloat(data.assets.balance__sum))
                            ? parseFloat(data.assets.balance__sum)
                            : parseFloat(0)
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left" width="30%">
                        Bank Records
                      </TableCell>
                      <TableCell align="left">
                        {numFormat(
                          !isNaN(parseFloat(data.bank_account.balance__sum))
                            ? parseFloat(data.bank_account.balance__sum)
                            : parseFloat(0)
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left" width="30%">
                        Receivables
                      </TableCell>
                      <TableCell align="left">
                        {numFormat(
                          !isNaN(parseFloat(data.receivables.balance__sum))
                            ? parseFloat(data.receivables.balance__sum)
                            : parseFloat(0)
                        )}
                      </TableCell>
                    </TableRow>
                  </Table>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  PAYABLES
                  <Table>
                    <TableRow>
                      <TableCell align="left" width="30%">
                        Payables
                      </TableCell>
                      <TableCell align="left">
                        {numFormat(
                          !isNaN(parseFloat(data.payables.balance__sum))
                            ? parseFloat(data.payables.balance__sum)
                            : parseFloat(0)
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left" width="30%">
                        Savings
                      </TableCell>
                      <TableCell align="left">
                        {numFormat(
                          !isNaN(parseFloat(data.savings.balance__sum))
                            ? parseFloat(data.savings.balance__sum)
                            : parseFloat(0)
                        )}
                      </TableCell>
                    </TableRow>
                  </Table>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  CAPITAL
                  <Table>
                    <TableRow>
                      <TableCell align="left" width="30%">
                        Owner's Equity
                      </TableCell>
                      <TableCell align="left">
                        {numFormat(
                          !isNaN(parseFloat(data.owners_equity.balance__sum))
                            ? parseFloat(data.owners_equity.balance__sum)
                            : parseFloat(0)
                        )}
                      </TableCell>
                    </TableRow>
                  </Table>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fade>
  );
}
