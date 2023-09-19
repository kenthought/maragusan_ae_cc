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

export default function OwnersEquityView(props) {
  const { data, barangay, municipality, province } = props;
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
