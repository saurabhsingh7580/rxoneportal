import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";

import InputEle from "../register-and-login/InputEle";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";

function RemoveUserForm(props) {
  const { userName, onHide, staffId, setShallUpdate } = props;

  const [isUserNameValid, setIsUserNameValid] = useState(false);
  const [inputName, setInputName] = useState("");
  const [removingUser, setRemovingUser] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  useEffect(() => {
    if (submittedSuccessfully && !showToast) {
      setShallUpdate(true);
      onHide();
    }
  }, [submittedSuccessfully, showToast]);

  useEffect(() => {
    if (inputName === userName.toUpperCase()) {
      setIsUserNameValid(true);
    } else {
      setIsUserNameValid(false);
    }
  }, [inputName]);

  const handleRemoveUser = async () => {
    setRemovingUser(true);

    try {
      const userSecret = localStorage.getItem("usr_secret");
      const userToken = localStorage.getItem("usr_token");
      const res = await rxOneApi.axios.delete(
        RX_ONE_ENDPOINTS.SETTINGS.USER_DETAILS +
          "/" +
          userToken +
          "/" +
          staffId,
        null,
        { headers: { usr_secret: userSecret } }
      );

      setShowToast(true);
      setToastType("success");
      setToastMessage(res.data.message);
      setSubmittedSuccessfully(true);
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setRemovingUser(false);
    }
  };

  return (
    <>
      <p>
        Once the user is removed, no data associated with the user can be
        recovered. <br />
        <br />
        To delete the user write below text in the input box and click REMOVE:
      </p>

      <p className="fw-bold text-uppercase">{userName}</p>

      <InputEle name="input" value={inputName} setValue={setInputName} />

      <Row className="justify-content-center my-3">
        <Col xs={6} className="d-flex justify-content-end pe-1">
          <Button
            style={{
              backgroundColor: "white",
              border: "1px solid primary",
              color: "black",
            }}
            onClick={onHide}
            disabled={removingUser}
          >
            Cancel
          </Button>
        </Col>

        <Col xs={6} className="d-flex justify-content-start ps-1">
          <Button
            className="bg-danger border-danger"
            disabled={!isUserNameValid || removingUser}
            onClick={handleRemoveUser}
          >
            {removingUser ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mx-3"
              />
            ) : (
              "REMOVE"
            )}
          </Button>
        </Col>
      </Row>

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </>
  );
}

export default RemoveUserForm;
