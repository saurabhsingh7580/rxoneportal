import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";

import AuthContext from "../../context/auth-context";
import Toast from "../ui/Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";

function AccActivation() {
  const { logout } = useContext(AuthContext);

  const mounted = useRef(false);

  const [accComplete, setAccComplete] = useState(0);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [shouldLogout, setShouldLogout] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    mounted.current = true;

    const fetchUserKycStatus = async () => {
      const userToken = localStorage.getItem("usr_token");

      if (userToken) {
        try {
          rxOneApi.setUserSecretAuthHeaders();
          const res = await rxOneApi.get(
            RX_ONE_ENDPOINTS.USER.KYC_STATUS + "/" + userToken
          );

          let totalKycFieldsDone = 0;

          if (res) {
            for (const kycField in res.data) {
              if (res.data[kycField]) {
                totalKycFieldsDone++;
              }
            }

            mounted.current && setAccComplete(totalKycFieldsDone * 12.5);
          } else {
            throw new Error("SOMETHING WENT WRONG. PLEASE TRY LATER.");
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
        }
      }
    };

    fetchUserKycStatus();

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  const handleAccActivationClick = () => {
    navigate("/app/kyc");
  };

  return (
    <section
      className="d-flex flex-column justify-content-center align-items-center text-white py-2 w-100 acc-activation"
      onClick={handleAccActivationClick}
      style={{ backgroundColor: "#00b0f0" }}
    >
      <h2 className="h6">Account Activation {">"}</h2>

      <div className="d-flex w-100 justify-content-center align-items-center">
        <p className="my-0 mx-1" style={{ fontSize: "0.7rem" }}>
          {accComplete}% Complete
        </p>
        <ProgressBar
          variant="white"
          now={accComplete}
          className="w-50 rounded-0"
          style={{ height: "0.4rem", backgroundColor: "black" }}
        />
      </div>

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}
    </section>
  );
}

export default AccActivation;
