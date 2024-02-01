import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function IncomeView(props) {
  const { data } = props;
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
    { id: 3, label: "Bad Debts", value: false },
  ]);
  if (data.approval_type == "Add")
    return (
      <Box>
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          marginBottom={2}
        >
          {data.approval_type} {data.type}
        </Typography>
        <TableContainer>
          <Table aria-label="simple table" size="small">
            <TableBody>
              <TableRow>
                <TableCell>Account number:</TableCell>
                <TableCell colSpan={2}>{data.account_number}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account name:</TableCell>
                <TableCell colSpan={2}>{data.new_data.account_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description:</TableCell>
                <TableCell colSpan={2}>{data.new_data.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account Status</TableCell>
                <TableCell>
                  <Chip
                    label={
                      accountStatus[data.new_data.account_status - 1].label
                    }
                    color={
                      accountStatus[data.new_data.account_status - 1].id == 1
                        ? "success"
                        : accountStatus[data.new_data.account_status - 1].id ==
                          2
                        ? "error"
                        : "secondary"
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  else
    return (
      <Box>
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          marginBottom={2}
        >
          {data.approval_type} {data.type}
        </Typography>
        <TableContainer>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Account number:</TableCell>
                <TableCell colSpan={2}>{data.account_number}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account name</TableCell>
                <TableCell>{data.old_data.account_name}</TableCell>
                <TableCell>{data.new_data.account_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Asset description</TableCell>
                <TableCell>{data.old_data.description}</TableCell>
                <TableCell>{data.new_data.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account Status</TableCell>
                <TableCell>
                  <Chip
                    label={
                      accountStatus[data.old_data.account_status - 1].label
                    }
                    color={
                      accountStatus[data.old_data.account_status - 1].id == 1
                        ? "success"
                        : accountStatus[data.old_data.account_status - 1].id ==
                          2
                        ? "error"
                        : "secondary"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      accountStatus[data.new_data.account_status - 1].label
                    }
                    color={
                      accountStatus[data.new_data.account_status - 1].id == 1
                        ? "success"
                        : accountStatus[data.new_data.account_status - 1].id ==
                          2
                        ? "error"
                        : "secondary"
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
}
