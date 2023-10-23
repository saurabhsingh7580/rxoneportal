import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import warningIcon from "../../assets/images/icons/toast/warning.svg";

function Prompt(props) {
  const {
    show,
    handleNevermind,
    handleGoAhead,
    isGoAheading,
    setIsGoAheading,
    children,
  } = props;

  return (
    <Modal
      className="toast-modal"
      show={show}
      size="lg"
      aria-labelledby="page-modal"
      centered
      onHide={handleNevermind}
    >
      <Modal.Header className={`justify-content-start text-white bg-danger`}>
        <img
          src={warningIcon}
          className="rounded me-2"
          style={{ width: "40px", height: "40px" }}
        />

        <Modal.Title className="fs-5">{children}</Modal.Title>
      </Modal.Header>

      {/* <Modal.Body className="fs-4">{children}</Modal.Body> */}

      <Modal.Footer className="border-0">
        <button
          disabled={isGoAheading}
          className="px-4 py-1 fs-5 btn btn-primary mx-3"
          onClick={() => handleNevermind(false)}
        >
          Cancel
        </button>

        <button
          disabled={isGoAheading}
          className="px-4 py-1 fs-5 btn btn-outline-primary"
          onClick={handleGoAhead}
        >
          {isGoAheading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mx-3"
            />
          ) : (
            "Go Ahead"
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default Prompt;
