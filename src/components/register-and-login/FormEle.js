import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from '@mui/material/Button';
import Modal from "react-bootstrap/Modal";

import AuthContext from "../../context/auth-context";
import InputEle from "./InputEle";
import PageModal from "../ui/PageModal";
import Toast from "../ui/Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";
import TermsNconditions from "./TermsNconditions";
import PrivacPolicy from "./PrivacPolicy";

const categoryOptions = [
  { label: "Medical Facility (Clinic/Hospital)", value: "medical_facility" },
  { label: "Doctor/Medical Professional", value: "doctor" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "Test Lab", value: "test_lab" },
];

function FormEle(props) {
  const { page } = props;

  const params = useParams();

  const authCtx = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(params["*"]);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [privacyPolicyshow, setPrivacyPolicyShow] = useState(false);
  const privacyPolicyhandleClose = () => setPrivacyPolicyShow(false);
  const privacyPolicyhandleShow = () => setPrivacyPolicyShow(true);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setReferralCode(params["*"]);
    setContactNumber("");
    setFirstName("");
    setLastName("");
    setCategory("");
    setIsLoading(false);
  }, [page]);

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setModalType("forgot");
    setShowModal(true);
  };

  const handleResendConfEmail = async () => {
    setModalType("resend");
    setShowModal(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (page === "sign-up" && category === "")
        throw new Error("Please select or enter a category");

      setIsLoading(true);

      let endPoint;
      let body = {};

      if (page === "sign-up") {
        endPoint = RX_ONE_ENDPOINTS.USER.SIGN_UP;
        body = {
          email,
          phone: "+91" + contactNumber,
          firstname: firstName,
          lastname: lastName,
          password,
          terms_agreement: "Yes",
          referral_code: referralCode,
          category: category.toLowerCase(),
        };
      } else {
        endPoint = RX_ONE_ENDPOINTS.USER.LOGIN;
        body = {
          email,
          password,
        };
      }

      const res = await rxOneApi.post(endPoint, body);

      if (res) {
        if (page === "login") {
          const userToken = res.data.usr_token;
          const userSecret = res.data.usr_secret;

          localStorage.setItem("usr_secret", userSecret);

          rxOneApi.setUserSecretAuthHeaders();
          const userTestKeysRes = await rxOneApi.get(
            RX_ONE_ENDPOINTS.USER.KEYS + "/test/" + userToken
          );
          const userLiveKeysRes = await rxOneApi.get(
            RX_ONE_ENDPOINTS.USER.KEYS + "/live/" + userToken
          );
          const userKeys = {
            test: { ...userTestKeysRes.data },
            live: { ...userLiveKeysRes.data },
          };

          localStorage.setItem("usr_keys", JSON.stringify(userKeys));

          authCtx.login(userToken, userSecret, email);

          navigate("/app/home", { replace: true });
        } else {
          setShowToast(true);
          setToastType("success");
          setToastMessage(res.data.message);

          navigate("/user/login");
        }
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error?.error?.message || error?.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <InputEle
          type="email"
          name="email-address"
          value={email}
          setValue={setEmail}
        />

        {page === "sign-up" ? (
          <>
            <Row className="align-items-center">
              <Col xs={3} className="pe-0">
                <Form.Control
                  className="py-1 form-control-lg"
                  value="+91"
                  readOnly
                />
              </Col>

              <Col xs={9} className="ps-1">
                <InputEle
                  type="tel"
                  name="contact-number"
                  value={contactNumber}
                  setValue={setContactNumber}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <InputEle
                  type="text"
                  name="first-name"
                  value={firstName}
                  setValue={setFirstName}
                  className="mt-0 mb-0"
                />
              </Col>

              <Col>
                <InputEle
                  type="text"
                  name="last-name"
                  value={lastName}
                  setValue={setLastName}
                  className="mt-0 mb-0"
                />
              </Col>
            </Row>
          </>
        ) : null}

        <InputEle
          page={page}
          type="password"
          name="password"
          value={password}
          setValue={setPassword}
        />

        {page === "sign-up" && (
          <>
            <CreatableSelect
              options={categoryOptions}
              className="form-control my-2 p-0 border-0"
              styles={{
                input: (inputStyles) => ({
                  ...inputStyles,
                  padding: "0.5rem",
                }),
                placeholder: (placeholderStyles) => ({
                  ...placeholderStyles,
                  fontSize: "1.25rem",
                }),
              }}
              placeholder="Category"
              onChange={(option) => setCategory(option.value)}
              // required={true}
            />

            <InputEle
              page={page}
              type="text"
              name="referral-code"
              value={referralCode}
              setValue={setReferralCode}
              notRequired={true}
              disabled={params["*"] !== ""}
            />
          </>
        )}

        {page === "sign-up" && (
          <div className="float-start mt-2" style={{ fontSize: "0.85rem" }}>
            By continuing, you agree to the{" "}
            <Button
              onClick={handleShow}
              variant="text"
              className="text-decoration-underline text-capitalize"
            >
              RxOne Customer Agreement
            </Button>{" "}
            and the <Button variant="text" className="text-decoration-underline text-capitalize" onClick={privacyPolicyhandleShow} >Privacy Policy</Button>. This
            site uses essential cookies.
            <div>
              <Modal show={show} onHide={handleClose} size={"xl"}>
                <Modal.Header closeButton style={{ borderBottom: "none", }} />
                <Modal.Body>
                  <TermsNconditions />
                </Modal.Body>
              </Modal>
              <Modal
                show={privacyPolicyshow}
                onHide={privacyPolicyhandleClose}
                size={"xl"}
              >
                <Modal.Header closeButton style={{ borderBottom: "none" }} />
                <Modal.Body>
                  <PrivacPolicy />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        )}

        {page === "login" && (
          <div className="mt-2">
            <span
              className="px-2"
              onClick={handleForgotPassword}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Forgot Password
            </span>
            <span
              className="px-2"
              onClick={handleResendConfEmail}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Resend Confirmation Link
            </span>
          </div>
        )}

        <button
          type="submit"
          className="register-and-login-btn float-end mt-3"
          // className="rounded-0 px-5 fw-bold float-end mt-3 register-and-login-btn"
          // style={{ backgroundColor: "#0070c0" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mx-3"
            />
          ) : page === "sign-up" ? (
            "Sign Up"
          ) : (
            "Login"
          )}
        </button>
      </Form>

      <PageModal
        type={modalType}
        show={showModal}
        onHide={() => setShowModal(false)}
      />

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </>
  );
}

export default FormEle;
