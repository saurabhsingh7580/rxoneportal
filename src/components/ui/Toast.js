import { Button, Modal } from "react-bootstrap";

import checkIcon from "../../assets/images/icons/toast/check.svg";
import errorIcon from "../../assets/images/icons/toast/error.svg";
import infoIcon from "../../assets/images/icons/toast/info.svg";
import warningIcon from "../../assets/images/icons/toast/warning.svg";

const Toast = props => {
  const { show, type, handleToastClose, children } = props;

  let toastIcon;
  let toastBg;

  switch (type) {
    case "success":
      toastIcon = checkIcon;
      toastBg = "bg-success";
      break;

    case "error":
      toastIcon = errorIcon;
      toastBg = "bg-danger";
      break;

    case "info":
      toastIcon = infoIcon;
      toastBg = "bg-info";
      break;

    case "warning":
      toastIcon = warningIcon;
      toastBg = "bg-warning";
      break;

    default:
      toastIcon = "";
      toastBg = "bg-light";
  }

  return (
    <Modal
      className="toast-modal"
      show={show}
      size="lg"
      aria-labelledby="page-modal"
      centered
      backdropClassName="toaster-backdrop"
    >
      <Modal.Header
        className={`justify-content-start text-capitalize text-white ${toastBg}`}
      >
        <img
          src={toastIcon}
          className="rounded me-2"
          alt={type}
          style={{ width: "40px", height: "40px" }}
        />

        <Modal.Title className="">{type}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="fs-4">{children}</Modal.Body>

      <Modal.Footer className="border-0">
        <Button
          className="px-4 py-1 fs-5"
          onClick={() => handleToastClose(false)}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Toast;
