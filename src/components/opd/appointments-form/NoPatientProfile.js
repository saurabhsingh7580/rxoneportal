import Modal from "react-bootstrap/Modal";

import Button from "../../ui/Button";

function NoPatientProfile(props) {
  const { show, onHide, message, onProceed } = props;

  return (
    <Modal
      centered
      show={show}
      onHide={onHide}
      backdropClassName="no-patient-modal-backdrop"
      className="no-patient-modal text-center"
    >
      <Modal.Body className="fs-5">{message}</Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button
          onClick={onHide}
          style={{
            backgroundColor: "white",
            border: "1px solid primary",
            color: "black",
          }}
        >
          Cancel
        </Button>

        <Button onClick={onProceed}>Proceed</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoPatientProfile;
