import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { Col, Container, Row } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";

import AuthContext from "../../../context/auth-context";
import Toast from "../../ui/Toast";
import { rxOneApi } from "../../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../../utils/api/apiEndPoints";

import referImg from "../../../assets/images/static/refer-earn.svg";

function NotificationModal(props) {
  const { show, onHide, type, title, noteId } = props;

  const { logout } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingReferralLink, setFetchingReferralLink] = useState(true);
  const [referralLink, setReferralLink] = useState("");
  const [tooltipText, setTooltipText] = useState("");
  const [referralEmails, setReferralEmails] = useState("");
  const [isReferralEmailsEmpty, setIsReferralEmailsEmpty] = useState(false);
  const [isReferralEmailsSubmitting, setIsReferralEmailsSubmitting] =
    useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    const fetchReferralLink = async () => {
      setFetchingReferralLink(true);

      try {
        const userToken = localStorage.getItem("usr_token");

        rxOneApi.setUserSecretAuthHeaders();
        const res = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.REFERRAL_LINK + "/" + userToken
        );

        if (res) {
          setReferralLink(res.data.referral_url);
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");

        if (error?.status === 401) {
          setToastMessage("Invalid session. Please login again.");
          setShouldLogout(true);
        } else {
          setToastMessage(error?.error?.message || error?.message);
        }
      } finally {
        setFetchingReferralLink(false);
      }
    };

    if (type === "refer") {
      fetchReferralLink();
    }
  }, [type]);

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  const handleChangePasswordSubmit = async event => {
    event.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(
        "All fields are required. Fill out all the fields before proceeding."
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError(true);

      return;
    } else {
      setChangePasswordError(false);
    }

    setIsSubmitting(true);

    try {
      const userToken = localStorage.getItem("usr_token");

      rxOneApi.setUserSecretAuthHeaders();
      const res = await rxOneApi.post(
        RX_ONE_ENDPOINTS.USER.CHANGE_PASSWORD + "/" + userToken,
        { old_password: oldPassword, new_password: newPassword },
        true
      );

      if (res) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(res.data.message);
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");

      if (error?.status === 401) {
        setToastMessage("Invalid session. Please login again.");
        setShouldLogout(true);
      } else {
        setToastMessage(error?.error?.message || error?.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setTooltipText(""), 2000);

    return () => clearTimeout(timeout);
  }, [tooltipText]);

  const handleReferralEmailsSubmit = async event => {
    event.preventDefault();

    if (referralEmails.trim().length === 0) {
      setIsReferralEmailsEmpty(true);

      return;
    } else {
      setIsReferralEmailsEmpty(false);
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const emails = referralEmails.split(";").map(email => email.trim());

    const invalidEmails = [];

    emails.forEach(email => {
      const isEmailValid = emailRegex.test(email);
      if (!isEmailValid) {
        invalidEmails.push(email);
      }
    });

    if (invalidEmails.length > 0) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(
        `Following email(s) are invalid:
        ${invalidEmails.join(", ")}`
      );

      return;
    }

    setIsReferralEmailsSubmitting(true);

    try {
      const userToken = localStorage.getItem("usr_token");

      rxOneApi.setUserSecretAuthHeaders();
      const referralEmailsRes = await rxOneApi.post(
        RX_ONE_ENDPOINTS.USER.SEND_REFERRAL_EMAILS + "/" + userToken,
        { mail_to: emails.join(";") }
      );

      if (referralEmailsRes) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(referralEmailsRes.data.message.replaceAll(";", "; "));
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");

      if (error?.status === 401) {
        setToastMessage("Invalid session. Please login again.");
        setShouldLogout(true);
      } else {
        setToastMessage(error?.error?.message || error?.message);
      }
    } finally {
      setIsReferralEmailsSubmitting(false);
    }
  };

  let modalSize;
  let body;

  switch (type) {
    case "quickstart":
      modalSize = "xl";

      body = (
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/s79Zbuo7tfI?autoplay=1`}
          ></iframe>
        </div>
      );
      break;

    case "changepass":
      body = (
        <form
          className="custom-form w-100"
          onSubmit={handleChangePasswordSubmit}
        >
          <label htmlFor="old-password" className="d-block mb-2">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={event => setOldPassword(event.target.value.trim())}
            name="old-password"
            className="w-100 mb-3"
            required
          />

          <label htmlFor="new-password" className="d-block mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={event => setNewPassword(event.target.value.trim())}
            name="new-password"
            className="w-100 mb-3"
            required
          />

          <label htmlFor="confirm-password" className="d-block mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value.trim())}
            name="confirm-password"
            className="w-100 mb-3"
            required
          />

          {changePasswordError && (
            <p className="text-danger float-start">
              New Password and Confirm Password must match.
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="d-block">
            {isSubmitting ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mx-3"
              />
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      );
      break;

    case "refer":
      modalSize = "xl";
      body = (
        <Container className="h-100">
          <Row className="h-100">
            <Col
              xs={{ span: 12, order: "last" }}
              md={{ span: 6, order: "first" }}
              className="h-100 text-white"
              style={{ backgroundColor: "#4d9aa6" }}
            >
              <div className="my-3">
                <p className="text-center fw-bold h3 mb-0">Receive Unlimited</p>
                <p className="text-center fw-bold h3">Rewards - 100% Free</p>
              </div>

              <img
                src={referImg}
                alt="RxOne Refer"
                className="img-fluid my-3"
              />

              <p className="fw-bold my-0 py-0">How it works:</p>

              <ul>
                <li className="my-2">
                  Receive 5,000{" "}
                  <strong>
                    <em>Rx Points</em>
                  </strong>{" "}
                  in Rewards-100% free* for each successful referral (No maximum
                  limit on rewards that can be collected!)
                </li>

                <li className="my-2">
                  Referral is considered successful only if the referred
                  Facility (Clinic/Hospital) accepts online payments for minimum
                  2 OPD appointments
                </li>

                <li className="my-2">
                  Accumulated{" "}
                  <strong>
                    <em>Rx Points</em>
                  </strong>{" "}
                  can be redeemed for exciting Rewards. Rewards Catalogue
                </li>
              </ul>
            </Col>

            <Col
              xs={{ span: 12, order: "first" }}
              md={{ span: 6, order: "last" }}
            >
              {!fetchingReferralLink ? (
                <>
                  <p className="text-end mt-2">
                    <CloseIcon style={{ cursor: "pointer" }} onClick={onHide} />
                  </p>

                  <div className="my-3 my-md-5">
                    <p className="text-center fw-bold h2">
                      Invite a friend to RxOne
                    </p>
                  </div>

                  <p className="text-center my-2 py-2">
                    Share your referral link anywhere:
                  </p>

                  <div className="d-flex justify-content-center pb-0 pb-md-5">
                    <input
                      readOnly
                      className="mx-2 pb-2"
                      style={{
                        border: "none",
                        borderBottom: "2px solid blue",
                        width: "70%",
                      }}
                      value={referralLink}
                      onChange={event => setReferralLink(event.target.value)}
                    />

                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(referralLink);
                        setTooltipText("Link Copied!");
                      }}
                    >
                      Copy
                    </Button>
                  </div>

                  {tooltipText && (
                    <p
                      className="mx-3 mt-2 float-end badge bg-success fw-normal"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {tooltipText}
                    </p>
                  )}

                  <p className="text-center mt-5 pt-0 pt-md-5">
                    Or refer your friend via email
                  </p>

                  <form
                    className="custom-form px-3 mb-5"
                    onSubmit={handleReferralEmailsSubmit}
                  >
                    <input
                      className="w-100"
                      placeholder="Send to (Semi-Colon Separated)"
                      value={referralEmails}
                      onChange={event =>
                        setReferralEmails(event.target.value.trim())
                      }
                    />

                    {isReferralEmailsEmpty && (
                      <p className="float-start text-danger">
                        Enter at least one email to send referral invite.
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-100 mt-3"
                      disabled={isReferralEmailsSubmitting}
                    >
                      {isReferralEmailsSubmitting ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mx-3"
                        />
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    className="mx-3"
                  />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      );
      break;

    default:
      modalSize = "lg";
      break;
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size={modalSize}
        dialogClassName={`notification-modal ${type}-modal`}
        aria-labelledby="notification-modal"
        centered
        fullscreen={type === "refer"}
        className="notification-modal-wrapper"
      >
        {type !== "refer" && (
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              {title}
            </Modal.Title>
          </Modal.Header>
        )}

        <Modal.Body
          className={`${
            type !== "refer"
              ? "pt-3 pb-5 px-2 px-md-5 d-flex justify-content-center w-100"
              : "p-0"
          }`}
        >
          {body}
        </Modal.Body>
      </Modal>

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}
    </>
  );
}

export default NotificationModal;
