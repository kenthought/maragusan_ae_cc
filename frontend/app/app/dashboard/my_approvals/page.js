"use client";

import { forwardRef, createRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import useSWR from "swr";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import axiosInstance from "@/app/axios";
import Loading from "@/app/utils/loading";
import { Card, CardContent } from "@mui/material";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 580,
    boxShadow: "0px 4px 12px 0px #00000047",
    border: "1px solid #dadde9",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
  },
}));

const ApprovalDetailsToolTip = (props) => {
  const { data } = props;

  switch (data.state) {
    case 1:
      return (
        <Box>
          <Typography variant="body" display="block">
            Approved by: {data.approver.first_name}
          </Typography>
          <Typography variant="body" display="block">
            Date:{" "}
            {new Date(data.date_executed).toLocaleDateString() +
              " at " +
              new Date(data.date_executed).toLocaleTimeString()}
          </Typography>
        </Box>
      );
    case 2:
      return (
        <Box>
          <Typography variant="body" display="block">
            Disapproved by: {data.approver.first_name}
          </Typography>
          <Typography variant="body" display="block">
            Date:{" "}
            {new Date(data.date_executed).toLocaleDateString() +
              " at " +
              new Date(data.date_executed).toLocaleTimeString()}
          </Typography>
          <Typography variant="body" display="block">
            Remarks: {data.remarks}
          </Typography>
        </Box>
      );
    default:
      return;
  }
};

const ApprovalStatus = forwardRef((props, ref) => {
  const { state } = props;

  switch (state) {
    case 1:
      return <Chip label="Approved" color="success" ref={ref} {...props} />;
    case 2:
      return <Chip label="Disapproved" color="warning" ref={ref} {...props} />;
    default:
      return <Chip label="Under Approval" color="info" ref={ref} {...props} />;
  }
});

ApprovalStatus.propTypes = {
  state: PropTypes.number.isRequired,
};

export default function MyApprovals() {
  const {
    data: userApprovals,
    error: userApprovals_error,
    isLoading: userApprovals_isLoading,
    mutate,
  } = useSWR("approvals/user", fetcher);
  const tooltipRef = createRef();

  if (userApprovals_error)
    return <Typography>Unable to fetch data!</Typography>;
  if (userApprovals_isLoading) return <Loading />;

  return (
    <>
      <Typography
        component="h2"
        variant="h5"
        color="primary"
        gutterBottom
        marginBottom={2}
      >
        My Approvals
      </Typography>
      <Box elevation={0} sx={{ padding: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          {userApprovals.length != 0 ? (
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell align="right">Approval</TableCell>
                    <TableCell align="right">Type</TableCell>
                    <TableCell align="right">Account #</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userApprovals.map((row) => {
                    // const data = JSON.parse(row.data);
                    return (
                      <TableRow
                        key={row.created_at}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(row.created_at).toLocaleDateString() +
                            " " +
                            new Date(row.created_at).toLocaleTimeString()}
                        </TableCell>
                        <TableCell align="right">{row.approval_type}</TableCell>
                        <TableCell align="right">{row.type}</TableCell>
                        <TableCell align="right">
                          {row.account_number}
                        </TableCell>
                        <TableCell align="right">
                          <CustomTooltip
                            title={<ApprovalDetailsToolTip data={row} />}
                            disableHoverListener={row.state == 0}
                            arrow
                          >
                            <ApprovalStatus
                              state={row.state}
                              ref={tooltipRef}
                            />
                          </CustomTooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography align="left">No approvals</Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
