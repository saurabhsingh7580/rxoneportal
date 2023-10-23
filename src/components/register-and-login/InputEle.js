import Form from "react-bootstrap/Form";

import getPlaceholder from "../../utils/register-and-login/input-ele-placeholder";

function InputEle(props) {
  const { type, className, name, value, notRequired, setValue, ...rest } =
    props;

  return (
    <>
      {/* <Form.Group className="" controlId={`${page}-form`}> */}
      <Form.Control
        className={`my-1 ${className ? className : ""}`}
        type={type}
        name={name}
        placeholder={
          name !== "referral-code"
            ? getPlaceholder(name)
            : " Referral Code (Optional)"
        }
        value={value}
        onChange={event => setValue(event.target.value)}
        required={!notRequired}
        {...(type === "tel" ? { pattern: "[1-9]{1}[0-9]{9}" } : null)}
        size="lg"
        {...rest}
      />
      {/* </Form.Group> */}
    </>
  );
}

export default InputEle;
