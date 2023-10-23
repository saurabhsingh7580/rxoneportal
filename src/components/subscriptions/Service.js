import { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import AuthContext from "../../context/auth-context";
import ModeContext from "../../context/mode-context";
import Toast from "../ui/Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";

const essentialService = {
  header: {
    icon: AttachMoneyIcon,
    heading: "Essential",
    p1: "Rx Branded - Generic",
    p2: "15% (Per  Patient Appointment*)",
  },
  body: {
    list: [
      "Personal branded - Patient and Doctor Web Apps",
      "Zero Setup Fee & No Installation Required",
      "No Cost for Marketplace and Admin Apps",
      "Scale to One or Many Facilities with Same Brand at No Additional Cost",
      "NABH Health ID Integration",
      "Virtual Receptionist/Front Desk (Shared)**",
    ],
    button: {
      text: "Un-Subscribe",
      handleClick: () => {},
    },
  },
};

const premiumService = {
  header: {
    icon: AddCircleOutlineIcon,
    heading: "Premium",
    p1: "Custom features, Premium Services",
    p2: "Contact Sales: +91-7703934446",
  },
  body: {
    list: [
      "Personal branded – Patient and Doctor Android & IOS Mobile Apps",
      "Pharmacy Module through Pharmacy Partner Program",
      "Lab Module  through Testing Lab Partner program",
      "Custom Marketing Campaign",
      "Custom Patient Charts for Better Diagnosis",
      "Virtual Receptionist/Front Desk (Dedicated)**",
    ],
    button: {
      text: "Get a Quote",
      handleClick: () => {},
    },
  },
};

function Service(props) {
  const { type } = props;

  const { logout } = useContext(AuthContext);
  const { mode } = useContext(ModeContext);

  const [gettingQuote, setGettingQuote] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  const service = type === "essential" ? essentialService : premiumService;

  const Icon = service.header.icon;

  service.body.button.handleClick = async () => {
    setGettingQuote(true);

    const userToken = localStorage.getItem("usr_token");

    try {
      rxOneApi.setUserSecretAuthHeaders();
      const res = await rxOneApi.post(
        RX_ONE_ENDPOINTS.SUBSCRIPTIONS.GET_A_QUOTE +
          "/" +
          mode +
          "/" +
          userToken
      );

      if (res) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(res.data.message);
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
      setGettingQuote(false);
    }
  };

  return (
    <>
      <div className="col-lg-6 h-100">
        <div className="card mb-5 mb-lg-0 h-100">
          <div className="card-body service-list h-100">
            <div className="d-flex justify-content-center align-items-center">
              <Icon className="mx-3" style={{ fontSize: "4rem" }} />

              <div className="mx-3">
                <h1 className="card-title text-muted text-capitalize fs-2">
                  {service.header.heading}
                </h1>

                <h6 className="card-price">
                  <p>{service.header.p1}</p>

                  <p>{service.header.p2}</p>
                  {/* <span className="period">/month</span> */}
                </h6>
              </div>
            </div>

            <hr />

            {type !== "essential" && (
              <div className="ms-2 mb-2 fw-bold">
                Everything in Essential, plus:
              </div>
            )}

            <ul>
              {service.body.list.map((listItem, idx) => (
                <li key={idx} className="fs-6">
                  {listItem}
                </li>
              ))}
            </ul>

            {type !== "essential" ? (
              <div className="d-flex justify-content-center">
                <button
                  disabled={gettingQuote}
                  className="btn btn-primary text-uppercase"
                  onClick={service.body.button.handleClick}
                >
                  {gettingQuote ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="mx-3"
                    />
                  ) : (
                    service.body.button.text
                  )}
                </button>
              </div>
            ) : (
              <div
                className="alert alert-primary fw-bold text-center mt-4"
                role="alert"
              >
                Auto Subscribed on Registration
              </div>
            )}
          </div>
        </div>
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
    </>
  );
}

export default Service;
