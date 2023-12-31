import { useState, useEffect, forwardRef } from "react";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";

export const MaskControlNumber = forwardRef(function TextMaskCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0000"
      displayChar="*"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite="shift"
    />
  );
});

MaskControlNumber.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
