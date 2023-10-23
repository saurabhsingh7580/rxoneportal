import { useState } from "react";

function AmountPaidInput(props) {
  const { id } = props;

  const [value, setValue] = useState("");

  return (
    <input
      id={id}
      value={value}
      onChange={event => setValue(event.target.value)}
      className="amount-paid-input"
    />
  );
}

export default AmountPaidInput;
