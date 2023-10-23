import { Form } from "react-bootstrap";

function InputErrorMessage(props) {
  return (
    <Form.Text className="d-block text-danger text-nowrap text-end  h-100 ">
      {/* position-absolute */}
      {props.children}
    </Form.Text>
  );
}

export default InputErrorMessage;
