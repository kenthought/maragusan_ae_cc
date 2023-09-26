import { useState, useEffect, forwardRef } from "react";
import { IMaskInput } from "react-imask";
import PropTypes from "prop-types";

export const MaskPasswordInput = forwardRef(function TextMaskCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      mask="**************************************************"
      {...other}
      displayChar="*"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
    />
  );
});

MaskPasswordInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
