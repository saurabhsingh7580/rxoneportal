import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Image, Navbar, Spinner } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuIcon from "@mui/icons-material/Menu";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import AuthContext from "../../context/auth-context";
import SidebarDisplayContext from "../../context/sidebar-display";
import PaymentsContext from "../../context/payments-context";
import RxPointsContext from "../../context/rx-points-context";
import NotificationModal from "../home/notification/NotificationModal";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

import userNavImg from "../../assets/images/logos/user-nav-logo.png";

function UserNav() {
  const { toggleDisplayClass, displayClass } = useContext(
    SidebarDisplayContext
  );
  const { mode } = useContext(ModeContext);
  const { hospitals, currentHospital, changeCurrentHospital, isLoading } =
    useContext(HospitalsContext);
  const { userEmail, logout } = useContext(AuthContext);
  const { setPaysCount } = useContext(PaymentsContext);
  const { arePointsLoading, rewardPoints } = useContext(RxPointsContext);

  const [paymentsCount, setPaymentsCount] = useState(0);
  const [arePaysLoading, setArePaysLoading] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationModalType, setNotificationModalType] = useState(null);
  const [notificationModalTitle, setNotificationModalTitle] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!showToast && shouldLogout) {
      logout();
    }
  }, [showToast, shouldLogout]);

  const fetchPaymentsData = async () => {
    setArePaysLoading(true);

    const userModeKey = JSON.parse(localStorage.getItem("usr_keys"))[mode];
    const key = userModeKey[`${mode}_key`];
    const secret = userModeKey[`${mode}_secret`];

    try {
      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.get(
        RX_OPD_ENDPOINTS.HOSPITAL.OPD.LIST_UNPAID_CASH_ORDERS +
          "/" +
          currentHospital.hos_id
      );

      if (res) {
        // setPays(res.data.cash_orders);
        setPaymentsCount(res.data.cash_orders.length);
        setPaysCount(res.data.cash_orders.length);
      } else {
        // setPays([]);
        throw new Error(
          "Something went wrong while fetching payments data. Please try later."
        );
      }

      setArePaysLoading(false);
    } catch (error) {
      console.log("UNPAID CASH ERROR", error);
      if (error.status === 401) {
        setShowToast(true);
        setToastType("error");
        setToastMessage("Invalid session. Please login again.");
        setShouldLogout(true);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && currentHospital) {
      fetchPaymentsData();
    }

    // if (!isLoading && !currentHospital) {
    //   setArePaysLoading(false);
    // }
  }, [currentHospital, isLoading]);

  useEffect(() => {
    if (!isLoading && !arePaysLoading) {
      const paysFetchingInterval = setInterval(fetchPaymentsData, 5000);

      return () => clearInterval(paysFetchingInterval);
    }
  }, [isLoading, arePaysLoading]);

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <Navbar expand="sm" className="shadow">
      <Container
        fluid
        className="justify-content-around justify-content-md-between"
      >
        <div className="d-block d-sm-none" onClick={toggleDisplayClass}>
          <MenuIcon />
        </div>

        <div></div>

        <Nav className="flex-row align-items-center">
          <div>
            <Image
              src={userNavImg}
              alt="Rx One Logo"
              fluid
              // calc(1.375rem + 1.5vw
              style={{ height: "32px", cursor: "pointer" }}
              onClick={() => navigate("/app/rewards/points-history")}
            />
          </div>

          {!arePointsLoading ? (
            <span
              className="ms-1 fw-bold"
              style={{ color: "#097f8b", cursor: "pointer" }}
              onClick={() => navigate("/app/rewards/points-history")}
            >
              Points:{" "}
              {rewardPoints
                ? rewardPoints.toString().length > 3
                  ? rewardPoints
                      .substring(0, rewardPoints.length - 3)
                      .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
                    "," +
                    rewardPoints.substring(rewardPoints.length - 3)
                  : rewardPoints.toString()
                : ""}
            </span>
          ) : (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mx-3"
            />
          )}

          <div
            className="position-relative p-0 mx-4"
            onClick={() => navigate("/app/opd/payments")}
            style={{ cursor: "pointer" }}
          >
            <NotificationsNoneOutlinedIcon
              htmlColor="#deb755"
              className="fs-1"
            />

            {paymentsCount > 0 && (
              <span
                id="pays-count-badge"
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {paymentsCount}
              </span>
            )}
          </div>

          <NavDropdown
            align="end"
            title={<AccountCircleOutlinedIcon className="fs-1" />}
            className="user-nav-dropdown"
          >
            <NavDropdown.Item disabled>
              <NavDropdown.ItemText className="text-muted">
                {userEmail}
              </NavDropdown.ItemText>
            </NavDropdown.Item>

            <NavDropdown.Divider />

            <NavDropdown.Item
              onClick={() => {
                setShowNotificationModal(true);
                setNotificationModalType("quickstart");
                setNotificationModalTitle("Welcome to RxOne!");
              }}
            >
              <NavDropdown.ItemText>Quick Start</NavDropdown.ItemText>
            </NavDropdown.Item>

            <NavDropdown.Item
              onClick={() => {
                setShowNotificationModal(true);
                setNotificationModalType("changepass");
                setNotificationModalTitle("Change Password!");
              }}
            >
              <NavDropdown.ItemText>Change Password</NavDropdown.ItemText>
            </NavDropdown.Item>

            <NavDropdown.Item onClick={handleLogoutClick}>
              <NavDropdown.ItemText>Logout</NavDropdown.ItemText>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>

      {showNotificationModal && (
        <NotificationModal
          show={showNotificationModal}
          onHide={() => setShowNotificationModal(false)}
          type={notificationModalType}
          title={notificationModalTitle}
        />
      )}
    </Navbar>
  );
}

export default React.memo(UserNav);
