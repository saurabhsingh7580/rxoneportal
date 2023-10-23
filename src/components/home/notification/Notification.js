import { useState } from "react";
import Button from "react-bootstrap/Button";
import CloseIcon from "@mui/icons-material/Close";

function Notification(props) {
  const {
    type,
    children,
    bgColor,
    btn,
    handleCloseClick,
    closeBtn = true,
  } = props;

  const [dismissNotification, setDismissNotification] = useState(false);

  return (
    <div
      className={`text-white shadow mt-3 mx-4 pe-5 alert alert-dismissible fade show  align-items-center notification-action-button ${
        dismissNotification ? "d-none" : ""
      }`}
      role="alert"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`mx-3 me-0 me-md-3 ms-3 ms-md-5 ps-md-5 notification-action-button`}
        style={{ maxWidth: "70%" }}
      >
        {children}
      </div>

      {btn && (
        <div className="notification-action-button">
          <Button
            className="text-capitalize mt-3 mt-md-0 mx-3 mx-md-0"
            onClick={btn.handleClick}
          >
            {btn.text}
          </Button>
        </div>
      )}

      {closeBtn && (
        <button
          type="button"
          // className="btn-close"
          className="btn"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={() => {
            setDismissNotification(true);
            handleCloseClick();
          }}
          style={{ position: "absolute", top: "0", right: "0" }}
        >
          <CloseIcon className="text-white" />
        </button>
      )}
    </div>
  );
}

export default Notification;
