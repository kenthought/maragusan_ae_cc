import { Fragment, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const keys = [
  { key: "account_name", label: "Account Name" },
  { key: "spouse_name", label: "Spouse Name" },
  { key: "credit_terms", label: "Credit Terms" },
  { key: "credit_limit", label: "Credit Limit" },
  { key: "contact_number1", label: "Contact number 1" },
  { key: "contact_number2", label: "Contact Number 2" },
  { key: "purok_street", label: "Purok Street" },
  { key: "barangay", label: "Barangay" },
  { key: "account_category", label: "Account Category" },
  { key: "account_status", label: "Account Status" },
  { key: "co_maker", label: "Co-maker" },
  { key: "agent", label: "Agent" },
  { key: "company", label: "Company" },
  { key: "supervisor", label: "Supervisor" },
  { key: "assignment", label: "Assignment" },
  { key: "date_hired", label: "Date hired" },
  { key: "company_id", label: "Company ID" },
  { key: "company_id_number", label: "Company ID number" },
  { key: "work_contact_number", label: "Work contact number" },
  { key: "employment_status", label: "Employment Status" },
  { key: "bank_account_name", label: "Bank Account Name" },
  { key: "bank_account_number", label: "Bank Account Number" },
  { key: "bank", label: "Bank" },
  { key: "bank_branch", label: "Bank branch" },
  { key: "card_number", label: "Card number" },
  { key: "card_pin", label: "Card Pin" },
  { key: "send_to", label: "Send to" },
  { key: "funds_registered_name", label: "Registered name" },
  { key: "funds_account_number", label: "Funds Account number" },
];

export default function ReceivablesView(props) {
  const { data, barangay, bank, user, company } = props;
  const [creditTerms] = useState([
    { id: 1, value: 1 },
    { id: 2, value: 7 },
    { id: 3, value: 15 },
    { id: 4, value: 21 },
    { id: 5, value: 30 },
    { id: 6, value: 45 },
    { id: 7, value: 60 },
  ]);
  const [employmentStatus] = useState([
    { id: 1, label: "Regular" },
    { id: 2, label: "Provisional" },
    { id: 3, label: "Contractual" },
  ]);
  const [funds] = useState([{ id: "1", label: "GCash" }]);
  const [accountStatus] = useState([
    { id: 1, label: "Active", value: true },
    { id: 2, label: "Inactive", value: false },
    { id: 3, label: "Bad Debts", value: false },
  ]);
  const [accountCategory] = useState([
    { id: 1, label: "Employee" },
    { id: 2, label: "Funds" },
    { id: 3, label: "Temp charge" },
    { id: 4, label: "Customer" },
  ]);

  const AccountInformation = () => (
    <Grid container padding={1} spacing={1}>
      <Grid item xs={12} md={4}>
        <Typography>Account number:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.account_number}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Account name:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.account_name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Spouse name:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.spouse_name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Purok/Street:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.purok_street}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Barangay:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {barangay.find((x) => x.id == data.new_data.barangay).barangay}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Municipality:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {
            barangay.find((x) => x.id == data.new_data.barangay).municipality
              .municipality
          }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Province:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {
            barangay.find((x) => x.id == data.new_data.barangay).municipality
              .province.province
          }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Account status:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Chip
          label={
            accountStatus.find((x) => x.id === data.new_data.account_status)
              .label
          }
          color={
            accountStatus.find((x) => x.id == data.new_data.account_status)
              .id == 1
              ? "success"
              : accountStatus.find((x) => x.id == data.new_data.account_status)
                  .id == 2
              ? "error"
              : "secondary"
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Credit Terms:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.credit_terms} days</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Credit Limit:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.credit_limit}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Category:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {
            accountCategory.find((x) => x.id === data.new_data.account_category)
              .label
          }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Contact number 1:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.contact_number1}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Contact number 2:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.contact_number2}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Date created:</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography>{data.created_at.split("T")[0]}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );

  const SalaryATMandFundsTransfer = () => (
    <Grid container padding={1} spacing={1}>
      <Grid item xs={12} md={4}>
        <Typography>Account name:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.bank_account_name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Bank account number:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.bank_account_number}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Bank:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {bank.find((x) => x.id == data.new_data.bank).bank}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Bank branch:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.bank_branch}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Card number:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.card_number}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Card pin:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.card_pin}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" my={2} textAlign="center" gutterBottom>
          Fund transfer account
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Send to:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {funds.find((x) => x.id === data.new_data.send_to).label}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Registered name:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.funds_registered_name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Account number:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.funds_account_number}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );

  const EmploymentInformation = () => (
    <Grid container padding={1} spacing={1}>
      <Grid item xs={12} md={4}>
        <Typography>Company:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {company.find((x) => x.id == data.new_data.company).company}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Company address:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {company.find((x) => x.id == data.new_data.company).address}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Supervisor:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.supervisor}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Assignment:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.assignment}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Company ID:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>{data.new_data.company_id_number}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Frequency:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {
            company.find((x) => x.id == data.new_data.company).frequency
              .frequency
          }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Date hired:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {new Date(data.new_data.date_hired).toLocaleDateString()}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Status:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {
            employmentStatus.find(
              (x) => x.id == data.new_data.employment_status
            ).label
          }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );

  const ComakerandAgent = () => (
    <Grid container padding={1} spacing={1}>
      <Grid item xs={12} md={4}>
        <Typography>Co-maker:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {user.find((x) => x.id == data.new_data.co_maker).first_name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography>Agent:</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography>
          {user.find((x) => x.id == data.new_data.agent).first_name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );

  const information = [
    {
      label: "Account Information",
      component: <AccountInformation />,
    },
    {
      label: "Salary ATM/Funds transfer",
      component: <SalaryATMandFundsTransfer />,
    },
    {
      label: "Employment Information",
      component: <EmploymentInformation />,
    },
    {
      label: " Co-maker/agent",
      component: <ComakerandAgent />,
    },
  ];

  const SwipeableTextMobileStepper = () => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = information.length;

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
      setActiveStep(step);
    };

    return (
      <Box sx={{ maxWidth: 600, mt: 1 }}>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {information.map((step, index) => (
            <Card
              sx={{ mt: 2, mx: 2, p: 2, height: 700 }}
              key={index}
              variant="outlined"
            >
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  sx={{
                    display: "block",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" textAlign="center" gutterBottom>
                    {step.label}
                  </Typography>
                  <Box mt={2}>{step.component}</Box>
                </Box>
              ) : null}
            </Card>
          ))}
        </SwipeableViews>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              {activeStep === maxSteps - 1
                ? ""
                : information[activeStep + 1].label}
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              {activeStep === 0 ? "" : information[activeStep - 1].label}
            </Button>
          }
        />
      </Box>
    );
  };

  const compareData = () => {
    const oldData = { ...data.old_data };
    const newData = { ...data.new_data };
    let from = {};
    let to = {};
    let unmatchedKeys = [];

    keys.filter((data) => {
      if (
        data.key == "barangay" ||
        data.key == "company" ||
        data.key == "bank" ||
        data.key == "co_maker" ||
        data.key == "agent"
      ) {
        console.log(data.key, oldData[data.key], newData[data.key]);
        if (oldData[data.key].id != newData[data.key]) {
          from[data.key] = oldData[data.key].id;
          to[data.key] = newData[data.key];
          unmatchedKeys.push(data);
          return true;
        }
        return false;
      }
      if (oldData[data.key] != newData[data.key]) {
        from[data.key] = oldData[data.key];
        to[data.key] = newData[data.key];
        unmatchedKeys.push(data);
        return true;
      }
      return false;
    });

    console.log(from, to, unmatchedKeys);

    return {
      from,
      to,
      unmatchedKeys,
    };
  };

  const EditData = ({ data }) => {
    console.log(data, data.unmatchedKey);
    let element = (
      <TableRow>
        <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
        <TableCell>{data.from}</TableCell>
        <TableCell>{data.to}</TableCell>
      </TableRow>
    );

    if (data.unmatchedKey.key == "barangay") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>
            {barangay.find((x) => x.id == data.from).barangay}
          </TableCell>
          <TableCell>
            {barangay.find((x) => x.id == data.to).barangay}
          </TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "bank") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>{bank.find((x) => x.id == data.from).bank}</TableCell>
          <TableCell>{bank.find((x) => x.id == data.to).bank}</TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "co_maker") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>
            {user.find((x) => x.id == data.from).first_name}
          </TableCell>
          <TableCell>{user.find((x) => x.id == data.to).first_name}</TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "agent") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>
            {user.find((x) => x.id == data.from).first_name}
          </TableCell>
          <TableCell>{user.find((x) => x.id == data.to).first_name}</TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "company") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>
            {company.find((x) => x.id == data.from).company}
          </TableCell>
          <TableCell>{company.find((x) => x.id == data.to).company}</TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "account_status") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>
            {accountStatus.find((x) => x.id == data.from).label}
          </TableCell>
          <TableCell>
            {accountStatus.find((x) => x.id == data.to).label}
          </TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "credit_terms") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>
            {creditTerms.find((x) => x.id == data.from).label}
          </TableCell>
          <TableCell>
            {creditTerms.find((x) => x.id == data.to).label}
          </TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "employment_status") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>
            {employmentStatus.find((x) => x.id == data.from).label}
          </TableCell>
          <TableCell>
            {employmentStatus.find((x) => x.id == data.to).label}
          </TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "funds") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>{funds.find((x) => x.id == data.from).label}</TableCell>
          <TableCell>{funds.find((x) => x.id == data.to).label}</TableCell>
        </TableRow>
      );
    }
    if (data.unmatchedKey.key == "account_category") {
      element = (
        <TableRow>
          <TableCell>{data.unmatchedKey.label + ":"}</TableCell>
          <TableCell>
            {accountCategory.find((x) => x.id == data.from).label}
          </TableCell>
          <TableCell>
            {accountCategory.find((x) => x.id == data.to).label}
          </TableCell>
        </TableRow>
      );
    }
    return element;
  };

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
        <SwipeableTextMobileStepper />
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
              {compareData().unmatchedKeys.length != 0 ? (
                <>
                  <TableRow>
                    <TableCell>Account number:</TableCell>
                    <TableCell colSpan={2}>{data.account_number}</TableCell>
                  </TableRow>
                  {compareData().unmatchedKeys.map((data, index) => {
                    console.log(data.key);
                    return (
                      <EditData
                        data={{
                          from: compareData().from[data.key],
                          to: compareData().to[data.key],
                          unmatchedKey: data,
                        }}
                        key={index}
                      />
                    );
                  })}
                </>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
}
