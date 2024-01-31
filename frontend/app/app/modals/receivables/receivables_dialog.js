import { useState, useEffect, Fragment } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Link from "@mui/material/Link";
import AccountForm from "./forms/AccountForm";
import WorkForm from "./forms/WorkForm";
import SalaryFundsForm from "./forms/SalaryFundsForm";
import Review from "./forms/Review";
import PropTypes from "prop-types";
import axiosInstance from "@/app/axios";
import { useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const steps = ["Account", "Work", "Salary/Funds", "Review"];

const generateControlNumber = () => {
  var number;
  do {
    number = Math.floor(Math.random() * 9999);
  } while (number < 1);

  return number;
};

const getStepContent = (
  step,
  optionsData,
  inputData,
  handleInputChange,
  countError,
  setCountError,
  isEditing
) => {
  if (!isEditing) inputData.control_number = generateControlNumber().toString();

  switch (step) {
    case 0:
      return (
        <AccountForm
          optionsData={{
            barangay: optionsData.barangay,
            users: optionsData.users,
          }}
          inputData={inputData}
          handleInputChange={handleInputChange}
          isEditing={isEditing}
        />
      );
    case 1:
      return (
        <WorkForm
          optionsData={{
            company: optionsData.company,
          }}
          inputData={inputData}
          handleInputChange={handleInputChange}
          isEditing={isEditing}
        />
      );
    case 2:
      return (
        <SalaryFundsForm
          optionsData={{
            bank: optionsData.bank,
          }}
          inputData={inputData}
          handleInputChange={handleInputChange}
          isEditing={isEditing}
        />
      );
    case 3:
      return (
        <Review
          inputData={inputData}
          optionsData={optionsData}
          countError={countError}
          setCountError={setCountError}
          isEditing={isEditing}
        />
      );
    default:
      return (
        <Review
          inputData={inputData}
          optionsData={optionsData}
          countError={countError}
          setCountError={setCountError}
        />
      );
  }
};
export default function ReceivablesDialog(props) {
  const {
    openReceivablesDialog,
    setOpenReceivablesDialog,
    setIsSuccess,
    setSuccessText,
    mutate,
    isEditing,
    setIsEditing,
    editData,
  } = props;
  const [activeStep, setActiveStep] = useState(0);
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
  const {
    data: company,
    error: company_error,
    isLoading: company_isLoading,
  } = useSWR("components/company", fetcher);
  const {
    data: bank,
    error: bank_error,
    isLoading: bank_isLoading,
  } = useSWR("components/bank", fetcher);
  const {
    data: users,
    error: users_error,
    isLoading: users_isLoading,
  } = useSWR("users/", fetcher);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const { data: session } = useSession();
  const [inputData, setInputData] = useState({});
  const [countError, setCountError] = useState(0);

  useEffect(() => {
    if (editData != null) setInputData(editData);
  }, [editData]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputData({ ...inputData, [event.target.name]: value });
  };

  const handleClose = () => {
    if (isEditing) {
      setInputData({});
      setActiveStep(0);
    }
    setOpenReceivablesDialog(false);
    setIsEditing(false);
  };

  const handleSuccessful = (bool, text) => {
    setIsError(false);
    setIsSuccess(bool);
    setSuccessText(text);
    setActiveStep(0);
    setInputData({});
    mutate();
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(countError);
    if (countError > 0) {
      setIsError(true);
      setErrorText("Please review inputs");
    } else {
      inputData.user = session.user.name[1];
      if (!isEditing) {
        inputData.account_status = 1;
        axiosInstance
          .post("receivables/", inputData)
          .then((response) => {
            handleSuccessful(true, "Receivables added successfully!");
            console.log(response);
          })
          .catch((response) => {
            console.log(response);
            setIsError(true);
            setErrorText(response.message);
          });
      } else inputData.bank = inputData.bank.id;
      inputData.barangay = inputData.barangay.id;
      inputData.company = inputData.company.id;

      axiosInstance
        .put("receivables/" + editData.id + "/", inputData)
        .then((response) => {
          handleSuccessful(true, "Receivables edited successfully!");
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
    company_isLoading ||
    bank_isLoading ||
    users_isLoading
  )
    return;

  return (
    <Dialog open={openReceivablesDialog} onClose={handleClose} fullWidth>
      <DialogTitle>
        {!isEditing ? "Add Recivables" : "Edit Recivables"}
      </DialogTitle>
      <Box component="form">
        <DialogContent>
          <CssBaseline />
          <Stepper activeStep={activeStep} sx={{ pb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {/* {activeStep === steps.length ? (
           <Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </Fragment>
          ) : ( */}
          {getStepContent(
            activeStep,
            {
              barangay: barangay,
              municipality: municipality,
              province: province,
              company: company,
              bank: bank,
              users: users,
            },
            inputData,
            handleInputChange,
            countError,
            setCountError,
            isEditing
          )}
          {/* )} */}
          <Box sx={{ mt: 2 }}>
            {isError ? <Alert severity="error">{errorText}</Alert> : <></>}
          </Box>
        </DialogContent>
        <DialogActions>
          {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="success" onClick={handleSubmit}>
              {!isEditing ? "Add" : "Edit"}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

ReceivablesDialog.propTypes = {
  openReceivablesDialog: PropTypes.bool.isRequired,
  setOpenReceivablesDialog: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  editData: PropTypes.object.isRequired,
};
