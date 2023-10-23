import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";

import InputEle from "../register-and-login/InputEle";
import Toast from "./Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";

function PageModal(props) {
  const { show, type } = props;

  const [email, setEmail] = useState("");
  const [modalBody, setModalBody] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail("");

    if (!show) {
      setModalBody(null);
    }
  }, [show]);

  const handleFormSubmit = async event => {
    event.preventDefault();

    setIsLoading(true);

    let endPoint;
    if (type === "forgot") {
      endPoint = RX_ONE_ENDPOINTS.USER.FORGOT_PASSWORD;
    } else {
      endPoint = RX_ONE_ENDPOINTS.USER.RESEND_CONFIRMATION_EMAIL;
    }

    try {
      const res = await rxOneApi.post(endPoint + "/" + email);

      if (res) {
        props.onHide();

        setShowToast(true);
        setToastType("success");
        setToastMessage(res.data.message);
      }
    } catch (error) {
      props.onHide();

      setShowToast(true);
      setToastType("error");
      setToastMessage(error?.error?.message || error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="page-modal" centered>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title id="page-modal">
            {type === "forgot" ? "Forgot Password" : "Resend Confirmation Link"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="mx-auto">
          {modalBody || (
            <>
              <p className="text-muted" style={{ fontSize: "1.25rem" }}>
                Please enter your registered mail address to request{" "}
                {type === "forgot"
                  ? "temporary password"
                  : "new confirmation link"}{" "}
                on mail.
              </p>

              <Form
                onSubmit={handleFormSubmit}
                className="mb-4 d-flex justify-content-evenly align-items-center"
              >
                <Container>
                  <Row className="justify-content-center mx-auto align-items-center">
                    <Col xs={12} sm={7}>
                      <InputEle
                        // className="w-50"
                        type="email"
                        name="email-address"
                        value={email}
                        setValue={setEmail}
                      />
                    </Col>
                    <Col xs={12} sm={5}>
                      <Button
                        type="submit"
                        className="rounded-0 px-5 fw-bold mx-auto"
                        style={{ backgroundColor: "#0070c0" }}
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-3"
                          />
                        )}

                        {!isLoading &&
                          (type === "forgot"
                            ? "Request Password"
                            : "Resend Link")}
                      </Button>
                    </Col>
                  </Row>
                </Container>

                {/* </Form.Group> */}
              </Form>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0">
          {/* <Button onClick={props.onHide}>Close</Button> */}
        </Modal.Footer>
      </Modal>

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </>
  );
}

export default PageModal;
