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

export default function PayablesView(props) {
  const { data, barangay, municipality, province } = props;
  const [accountType] = useState([
    { id: 1, label: "Funds" },
    { id: 2, label: "Regular" },
    { id: 3, label: "Supplier" },
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
                <TableCell>Payment arrangement</TableCell>
                <TableCell>
                  {accountType[data.new_data.payment_arrangement - 1].label}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account type</TableCell>
                <TableCell>
                  {accountType[data.new_data.account_type - 1].label}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Term</TableCell>
                <TableCell>{data.new_data.term}</TableCell>
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
                <TableCell>Payment arrangement</TableCell>
                <TableCell>
                  {accountType[data.old_data.payment_arrangement - 1].label}
                </TableCell>
                <TableCell>
                  {accountType[data.new_data.payment_arrangement - 1].label}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account type</TableCell>
                <TableCell>
                  {accountType[data.old_data.account_type - 1].label}
                </TableCell>
                <TableCell>
                  {accountType[data.new_data.account_type - 1].label}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Term</TableCell>
                <TableCell>{data.old_data.term}</TableCell>
                <TableCell>{data.new_data.term}</TableCell>
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
