import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import AuthContext from "../../context/auth-context";
import ModeContext from "../../context/mode-context";
import RxPointsContext from "../../context/rx-points-context";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";

function RewardDetailsModal(props) {
  const { areRewardDetailsLoading, rewardId, rewardDetails, show, onHide } =
    props;

  const { logout } = useContext(AuthContext);
  const { mode } = useContext(ModeContext);
  const { arePointsLoading, rewardPoints, updatePoints } =
    useContext(RxPointsContext);

  const [submittingAvailReward, setSubmittingAvailReward] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  const handleAvailRewardBtnClick = async () => {
    if (
      +rewardPoints < +rewardDetails.required_claim_points &&
      !arePointsLoading
    ) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(
        "Sorry, not enough rewards points balance, to redeem the selected reward."
      );

      return;
    }

    setSubmittingAvailReward(true);

    const userToken = localStorage.getItem("usr_token");

    try {
      rxOneApi.setUserSecretAuthHeaders();
      const availRewardRes = await rxOneApi.post(
        RX_ONE_ENDPOINTS.REWARDS.REDEEM.POST_AVAIL_REWARD +
          "/" +
          mode +
          "/" +
          userToken +
          "/" +
          rewardId
      );

      if (availRewardRes) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(availRewardRes.data?.message);

        onHide();
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      if (error?.status === 401) {
        if (!document.querySelector(".toast-modal")) {
          setShowToast(true);
          setToastType("error");
          setToastMessage("Invalid session. Please login again.");
          setShouldLogout(true);
        }
      } else {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error?.error?.message || error?.message);
      }
    } finally {
      updatePoints();
      setSubmittingAvailReward(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        size="lg"
        contentClassName="px-3 py-2 reward-details-modal"
        dialogClassName="justify-content-center"
      >
        {!areRewardDetailsLoading && rewardDetails ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="text-muted">
                <h1 className="h2 fw-bold">{rewardDetails.title}</h1>
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-muted">
              <p className="fs-6 mt-0 mb-0">
                <InsertInvitationIcon className="text-black fs-4 mx-2" />
                Valid Till:{" "}
                <span className="fw-bold">{rewardDetails.valid_till}</span>
              </p>

              <p className="fs-6 mt-0 mb-4">
                <ShoppingCartOutlinedIcon className="text-black fs-4 mx-2" />
                Allowed Quantity:{" "}
                <span className="fw-bold">
                  {rewardDetails.allowed_quantity}
                </span>
              </p>

              <h2 className="h4">How to Redeem</h2>

              <ol className="text-black mb-4">
                {rewardDetails.redemption_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>

              <h2 className="h4">Terms and Conditions</h2>

              <ol className="text-black">
                {rewardDetails.terms_conditions.map((condition, idx) => (
                  <li key={idx}>{condition}</li>
                ))}
              </ol>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                disabled={
                  submittingAvailReward ||
                  (+rewardPoints < +rewardDetails.required_claim_points &&
                    !arePointsLoading)
                }
                className="rounded-3 bg-danger border-0"
                onClick={handleAvailRewardBtnClick}
              >
                {!submittingAvailReward ? (
                  `Avail for ${rewardDetails.required_claim_points} Points`
                ) : (
                  <Spinner
                    size="sm"
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                    className="mx-3"
                  />
                )}
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <div className="p-5 text-center w-100">
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
              className="mx-3"
            />
          </div>
        )}
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

export default RewardDetailsModal;
