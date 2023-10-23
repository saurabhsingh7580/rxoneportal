import { Button } from "react-bootstrap";

function CustomButton(props) {
  const { className, children, ...rest } = props;

  return (
    <Button
      className={`rounded-0 px-4  fw-bold ${className ? className : ""}`}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default CustomButton;
