import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

export default function Success({ isSuccess, setIsSuccess, successText }) {
  return (
    <Collapse in={isSuccess}>
      <Alert
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setIsSuccess(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {successText}
      </Alert>
    </Collapse>
  );
}

Success.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  successText: PropTypes.string.isRequired,
};
