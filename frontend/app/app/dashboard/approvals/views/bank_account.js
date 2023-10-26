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

export default function BankAccountView(props) {
  const { data, barangay, municipality, province, bank } = props;
  const [accountType] = useState([
    { id: 1, label: "Current" },
    { id: 2, label: "Savings" },
  ]);
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
                <TableCell>Account name</TableCell>
                <TableCell>{data.new_data.account_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account type</TableCell>
                <TableCell>
                  {
                    accountType.find((x) => x.id == data.new_data.account_type)
                      .label
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bank</TableCell>
                <TableCell>
                  {bank.find((x) => x.id == data.new_data.bank).bank}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bank branch</TableCell>
                <TableCell>{data.new_data.bank_branch}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Purok/Street</TableCell>
                <TableCell>{data.new_data.purok_street}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Barangay</TableCell>
                <TableCell>
                  {
                    barangay.find((x) => x.id == data.new_data.barangay)
                      .barangay
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Municipality</TableCell>
                <TableCell>
                  {
                    municipality.find((x) => x.id == data.new_data.municipality)
                      .municipality
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Province</TableCell>
                <TableCell>
                  {
                    province.find((x) => x.id == data.new_data.province)
                      .province
                  }
                </TableCell>
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
                <TableCell>Account type</TableCell>
                <TableCell>
                  {
                    accountType.find((x) => x.id == data.old_data.account_type)
                      .label
                  }
                </TableCell>
                <TableCell>
                  {
                    accountType.find((x) => x.id == data.new_data.account_type)
                      .label
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bank</TableCell>
                <TableCell>
                  {bank.find((x) => x.id == data.old_data.bank).bank}
                </TableCell>
                <TableCell>
                  {bank.find((x) => x.id == data.new_data.bank).bank}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bank branch</TableCell>
                <TableCell>{data.old_data.bank_branch}</TableCell>
                <TableCell>{data.new_data.bank_branch}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Purok/Street</TableCell>
                <TableCell>{data.old_data.purok_street}</TableCell>
                <TableCell>{data.new_data.purok_street}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Barangay</TableCell>
                <TableCell>
                  {
                    barangay.find((x) => x.id == data.old_data.barangay)
                      .barangay
                  }
                </TableCell>
                <TableCell>
                  {
                    barangay.find((x) => x.id == data.new_data.barangay)
                      .barangay
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Municipality</TableCell>
                <TableCell>
                  {
                    municipality.find((x) => x.id == data.old_data.municipality)
                      .municipality
                  }
                </TableCell>
                <TableCell>
                  {
                    municipality.find((x) => x.id == data.new_data.municipality)
                      .municipality
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Province</TableCell>
                <TableCell>
                  {
                    province.find((x) => x.id == data.old_data.province)
                      .province
                  }
                </TableCell>
                <TableCell>
                  {
                    province.find((x) => x.id == data.new_data.province)
                      .province
                  }
                </TableCell>
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
