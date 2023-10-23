import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import AuthContext from "../context/auth-context";
import ModeContext from "../context/mode-context";
import HospitalContext from "../context/hospitals-context";
import DashboardCard from "../components/home/DashboardCard";
import SelectHospital from "../components/hospitals/SelectHospital";
import Filters from "../components/home/Filters";
import Visualizations from "../components/home/Visualizations";
import Notification from "../components/home/notification/Notification";
import NotificationModal from "../components/home/notification/NotificationModal";
import Toast from "../components/ui/Toast";
import { rxOneApi, rxOpdApi } from "../utils/api/api";
import { RX_ONE_ENDPOINTS, RX_OPD_ENDPOINTS } from "../utils/api/apiEndPoints";

import referralImg from "../assets/images/static/referral.jpg";

const startDateVal = new Date();
const endDateVal = new Date();

startDateVal.setDate(startDateVal.getDate() - 3);

const getDateString = date =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

function Home(props) {
  const { logout } = useContext(AuthContext);
  const { mode } = useContext(ModeContext);
  const { isLoading, hospitals, currentHospital } = useContext(HospitalContext);

  const [startDate, setStartDate] = useState(startDateVal);
  const [endDate, setEndDate] = useState(endDateVal);
  const [collectionChartData, setCollectionChartData] = useState([]);
  const [todayOnlineCollectionData, setTodayOnlineCollectionData] = useState(0);
  const [todayCashCollectionData, setTodayCashCollectionData] = useState(0);
  const [appointmentChartData, setAppointmentChartData] = useState([]);
  const [todayOnlineAppointments, setTodayOnlineAppointments] = useState(0);
  const [todayInPersonAppointments, setTodayInPersonAppointments] = useState(0);
  const [gettingNotifications, setGettingNotifications] = useState(true);
  const [isHomeDataLoading, setIsHomeDataLoading] = useState(true);
  const [userNotifications, setUserNotifications] = useState([]);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationModalData, setNotificationModalData] = useState(null);
  const [shouldLogout, setShouldLogout] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setGettingNotifications(true);

      const userToken = localStorage.getItem("usr_token");

      rxOneApi.setUserSecretAuthHeaders();
      try {
        const notificationRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.NOTIFICATION.GET_NOTIFICATION + "/" + userToken
        );

        if (notificationRes) {
          if (notificationRes.data?.message) {
            throw new Error("logout");
          }

          setUserNotifications(notificationRes.data.notifications);
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage("Invalid session. Please login again.");
        setShouldLogout(true);
      } finally {
        setGettingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsHomeDataLoading(true);

      if (!isLoading && hospitals.length === 0) {
        setNoDataMessage(
          "No facilities found. Please create a facility first."
        );
        setIsHomeDataLoading(false);
        return;
      }

      if (isLoading || !currentHospital) {
        return;
      }

      setIsHomeDataLoading(true);

      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const collectionRes = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_REPORT_COLLECTION +
            "/" +
            currentHospital.hos_id +
            "/" +
            getDateString(startDate) +
            "/" +
            getDateString(endDate)
        );

        const todayCollectionRes = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_REPORT_COLLECTION +
            "/" +
            currentHospital.hos_id +
            "/" +
            getDateString(new Date()) +
            "/" +
            getDateString(new Date())
        );

        const appointmentRes = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_REPORT_APPOINTMENTS +
            "/" +
            currentHospital.hos_id +
            "/" +
            getDateString(startDate) +
            "/" +
            getDateString(endDate)
        );

        const todayAppointmentRes = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_REPORT_APPOINTMENTS +
            "/" +
            currentHospital.hos_id +
            "/" +
            getDateString(new Date()) +
            "/" +
            getDateString(new Date())
        );

        if (todayCollectionRes.data.appointments_collection.length > 0) {
          let todayOnlineCollection = 0;
          let todayCashCollection = 0;
          for (const collection of todayCollectionRes.data
            .appointments_collection) {
            if (collection.payment_mode === "Online") {
              todayOnlineCollection += +collection.collection_amount;
            } else {
              todayCashCollection += +collection.collection_amount;
            }
          }

          setTodayOnlineCollectionData(todayOnlineCollection);
          setTodayCashCollectionData(todayCashCollection);
        } else {
          setTodayOnlineCollectionData(0);
          setTodayCashCollectionData(0);
        }
        // todayAppointmentRes.data.appointments_count

        if (todayAppointmentRes.data.appointments_count.length > 0) {
          let todayOnlineAppointmentsData = 0;
          let todayInPersonAppointmentsData = 0;

          for (const appointment of todayAppointmentRes.data
            .appointments_count) {
            if (appointment.appointment_type === "Online") {
              todayOnlineAppointmentsData += +appointment.total_appointments;
            } else {
              todayInPersonAppointmentsData += +appointment.total_appointments;
            }
          }

          setTodayOnlineAppointments(todayOnlineAppointmentsData);
          setTodayInPersonAppointments(todayInPersonAppointmentsData);
        } else {
          setTodayOnlineAppointments(0);
          setTodayInPersonAppointments(0);
        }

        if (
          collectionRes.data.appointments_collection.length > 0 ||
          appointmentRes.data.appointments_count.length > 0
        ) {
          setCollectionChartData(collectionRes.data.appointments_collection);
          setAppointmentChartData(appointmentRes.data.appointments_count);
          setNoDataMessage(null);
        } else {
          setNoDataMessage(
            "No data to display for current date range and hospital."
          );
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(
          error.message || "Invalid session. Please login again."
        );
        setNoDataMessage(error.message);
        setIsHomeDataLoading(false);
      } finally {
        setIsHomeDataLoading(false);
      }
    };

    fetchHomeData();
  }, [isLoading, mode, currentHospital, startDate, endDate, hospitals.length]);

  const handleNotificationBtnClick = async (type, noteId, title) => {
    if (type === "kyc") {
      navigate("/app/kyc");
    }

    if (type === "docadd") {
      navigate("/app/doctors/register");
    }

    if (type === "cashpay") {
      navigate("/app/opd/payments");
    }

    setShowNotificationModal(true);
    setNotificationModalData(type);
    setNotificationModalData({
      type,
      noteId,
      title,
    });
  };

  const handleDeleteNotification = async noteId => {
    try {
      const userToken = localStorage.getItem("usr_token");

      rxOneApi.setUserSecretAuthHeaders();
      const deleteNotificationRes = await rxOneApi.delete(
        RX_ONE_ENDPOINTS.NOTIFICATION.DELETE_NOTIFICATION +
          "/" +
          userToken +
          "/" +
          noteId
      );

      if (deleteNotificationRes) {
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      console.log("Error in deleting notification.", error?.message);
    }
  };

  return (
    <>
      {!isHomeDataLoading && !gettingNotifications && (
        <>
          {(userNotifications || []).map(n => (
            <Notification
              key={n.note_id}
              bgColor={n.bg_color_hex_code}
              btn={
                n.button_label
                  ? {
                      text: n.button_label,
                      handleClick: () =>
                        handleNotificationBtnClick(
                          n.button_action.replace("/", ""),
                          n.note_id,
                          n.title
                        ),
                    }
                  : null
              }
              handleCloseClick={() => handleDeleteNotification(n.note_id)}
            >
              {n.note}
            </Notification>
          ))}
        </>
      )}

      <div className="alert d-flex flex-column flex-md-row align-items-md-center shadow mt-3 mx-4 p-0">
        <img
          className="img-fluid referral-img"
          src={referralImg}
          alt="Referral"
        />

        <div className="referral-note px-3 px-md-0">
          <h1 className="h5 d-flex d-md-block align-items-center">
            Help a fellow medical practioner/provider grow using RxOne
          </h1>

          <p>
            Know someone who needs to set up Digital OPD? Receive 5000 Rx Points
            (~ ₹1,000) as Rewards - 100% FREE* per successful referral
          </p>
        </div>

        <Button
          className="text-capitalize my-2 mx-3 referral-btn"
          onClick={() => handleNotificationBtnClick("refer")}
        >
          Refer Now
        </Button>
      </div>

      <div className="shadow mt-3 mx-4 p-3">
        {/* <Col xs={12} md={6} className="my-3 px-2"> */}
        <SelectHospital type="home" />
        {/* </Col> */}
      </div>

      {!isHomeDataLoading && !gettingNotifications ? (
        <Container as="main" className="w-100">
          <Row className="my-3 justify-content-between">
            <Col as="section" xs={12} md={6}>
              <DashboardCard
                title="Total Appointments Today:"
                onlineValue={todayOnlineAppointments}
                rightLabel="(In-Person)"
                rightValue={todayInPersonAppointments}
              />
            </Col>

            <Col as="section" xs={12} md={6} className="">
              <DashboardCard
                title="Total Collection Today:"
                onlineValue={`₹${todayOnlineCollectionData}`}
                rightLabel="(Cash)"
                rightValue={`₹${todayCashCollectionData}`}
              />
            </Col>
          </Row>

          <Row className="shadow p-2 mx-1 align-self-center h-100">
            <Filters
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
            {!noDataMessage ? (
              <Visualizations
                collectionChartData={collectionChartData}
                appointmentChartData={appointmentChartData}
              />
            ) : (
              <p className="h-100 d-flex align-items-center justify-content-center fs-2 fw-bold py-5 my-5">
                {noDataMessage}
              </p>
            )}
          </Row>
        </Container>
      ) : (
        <div
          className="w-100 d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <Spinner
            as="span"
            animation="border"
            size="xl"
            role="status"
            aria-hidden="true"
          />
        </div>
      )}

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}

      {showNotificationModal && (
        <NotificationModal
          show={showNotificationModal}
          onHide={() => setShowNotificationModal(false)}
          type={notificationModalData.type}
          noteId={notificationModalData.noteId}
          title={notificationModalData.title}
        />
      )}
    </>
  );
}

export default Home;
