import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import PhotoCameraFrontOutlinedIcon from "@mui/icons-material/PhotoCameraFrontOutlined";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import PersonIcon from "@mui/icons-material/Person";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import Avatar from "@mui/material/Avatar";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

function AppointmentModal(props) {
  const { show, onHide, appointmentId } = props;

  const { mode } = useContext(ModeContext);
  const { currentHospital } = useContext(HospitalsContext);

  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
    tokenNo: "",
    status: "",
    type: "",
  });
  const [patient, setPatient] = useState({
    id: "",
    name: "",
    gender: "",
    age: "",
    mobile: "",
    email: "",
  });
  const [doctorName, setDoctorName] = useState("");
  const [showCancelBtn, setShowCancelBtn] = useState(false);
  const [loadingAppointmentDetails, setLoadingAppointmentDetails] =
    useState(true);
  const [doesPatientProfileExists, setDoesPatientProfileExists] =
    useState(false);
  const [appointmentLineages, setAppointmentLineages] = useState(null);
  const [shouldCloseModal, setShouldCloseModal] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (shouldCloseModal && !showToast) {
      onHide();
    }
  }, [shouldCloseModal, showToast]);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const userKeys = localStorage.getItem("usr_keys");
        const userModeKey = JSON.parse(userKeys)[mode];

        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        rxOpdApi.setAuthHeaders(key, secret);
        const appointmentDetailsRes = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.APPOINTMENT.FETCH_APPOINTMENT_DETAILS +
            "/" +
            currentHospital.hos_id +
            "/" +
            appointmentId
        );

        const appointmentLineageRes = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.APPOINTMENT.FETCH_APPOINTMENT_LINEAGE +
            "/" +
            currentHospital.hos_id +
            "/" +
            appointmentId
        );

        if (appointmentDetailsRes && appointmentLineageRes) {
          setAppointment({
            date: appointmentDetailsRes.data.appointment
              .appointment_date_formatted,
            time: appointmentDetailsRes.data.appointment
              .appointment_time_formatted,
            status: appointmentDetailsRes.data.appointment.app_status,
            tokenNo:
              appointmentDetailsRes.data.appointment.appointment_token_no,
            type: appointmentDetailsRes.data.appointment.app_type,
          });
          setPatient({
            id: appointmentDetailsRes.data.appointment.pt_profile_id,
            name: appointmentDetailsRes.data.appointment.patient_name,
            age: appointmentDetailsRes.data.appointment.patient_age,
            gender: appointmentDetailsRes.data.appointment.patient_gender,
            mobile: "",
            email: "",
          });
          setShowCancelBtn(
            appointmentDetailsRes.data.appointment.show_cancel_button
          );
          setDoctorName(appointmentDetailsRes.data.appointment.doc_name);
          setAppointmentLineages(appointmentLineageRes.data.records);
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(
          error?.message ||
            error?.error?.message ||
            "Something went wrong. Please try later"
        );
        setShouldCloseModal(true);
      } finally {
        setLoadingAppointmentDetails(false);
      }
    };

    fetchAppointmentDetails();
  }, [mode, currentHospital.hos_id, appointmentId]);

  const handleCancelAppointment = async () => {};

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="appointment-modal"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-md-0"></Modal.Header>

        <Modal.Body className="pt-0">
          {!loadingAppointmentDetails ? (
            <>
              <div className="w-100 d-flex align-items-center justify-content-between justify-content-md-around">
                <div className="d-flex flex-column justify-content-center text-center fw-bold">
                  <span
                    className="text-secondary"
                    style={{ fontSize: "1.1rem" }}
                  >
                    {appointment.date}
                  </span>

                  <span className="fs-5 text-black">{appointment.time}</span>
                </div>

                {appointment.tokenNo ? (
                  <div
                    className="rounded-pill bg-success text-white py-1 px-3 fs-5"
                    style={{ outline: "3px solid lightgreen" }}
                  >
                    {appointment.tokenNo} {/* Placeholder */}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              <div className="w-100 d-flex align-items-center justify-content-between justify-content-md-around mt-3">
                <div className="d-flex align-items-center">
                  <Avatar
                    variant="circular"
                    src={
                      process.env.REACT_APP_RX_OPD +
                      // (mode === "test" ? "test/" : "") +
                      RX_OPD_ENDPOINTS.HOSPITAL.APPOINTMENT.PATIENT_PROFILE +
                      "/" +
                      currentHospital.hos_id +
                      "/" +
                      patient.id
                    }
                    sx={{ width: 32, height: 32 }}
                    className="mx-3"
                    style={{ height: "32px", width: "32px" }}
                  />

                  <div className="d-flex flex-column ps-2">
                    <span className="fs-5">{patient.name}</span>

                    <span style={{ fontSize: "0.85rem" }}>
                      {patient.gender}, {patient.age}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column justify-content-center align-items-center text-success">
                  {/* <div
                    className="bg-success p-1"
                    style={{ width: "40px", height: "40px" }}
                  > */}
                  {/* <img
                      src={checkIcon}
                      // className="rounded"
                      alt={"type"}
                      style={{ width: "32px", height: "32px" }}
                    /> */}
                  <WatchLaterOutlinedIcon style={{ fontSize: "3.5rem" }} />
                  {/* </div> */}

                  <div>{appointment.status}</div>
                </div>
              </div>

              <div className="p-2 w-100 d-flex align-items-center justify-content-between justify-content-md-around mt-3 border border-3 rounded border-secondary">
                <div className="fs-4 fw-bold text-secondary">{doctorName}</div>

                <div className="d-flex align-items-center">
                  {appointment.type === "Walk-In" ? (
                    <MeetingRoomOutlinedIcon style={{ fontSize: "3.5rem" }} />
                  ) : appointment.type !== "Scheduled (In-Person)" ? (
                    <PhotoCameraFrontOutlinedIcon
                      style={{ fontSize: "3.5rem" }}
                    />
                  ) : (
                    <AddHomeOutlinedIcon style={{ fontSize: "3.5rem" }} />
                  )}

                  <div className="d-flex flex-column align-items-center justify-content-center text-black ps-1">
                    {/* {appointment.type === "Walk-In" ? (
                      "Walk-In"
                    ) : (
                      <> */}
                    {/* <div>Scheduled</div> */}
                    <div
                      className="text-center fw-bold"
                      style={{
                        fontSize: "0.80rem",
                        maxWidth: "70px",
                        // color: "#5b9bd5",
                      }}
                    >
                      {appointment.type}
                    </div>
                    {/* </> */}
                    {/* )} */}
                  </div>
                </div>
              </div>

              <div className="container appointment-lineage px-0 mx-0">
                <div className="row">
                  <div className="col">
                    <div
                      className="timeline-steps aos-init aos-animate"
                      data-aos="fade-up"
                    >
                      {appointmentLineages.map((appointmentLineage, idx) => (
                        <div key={idx} className="timeline-step">
                          <div
                            className="timeline-content"
                            data-toggle="popover"
                            data-trigger="hover"
                            data-placement="top"
                            title=""
                            data-content="And here's some amazing content. It's very engaging. Right?"
                            // data-original-title={"2003"}
                          >
                            <div className="appointment-lineage-time">
                              {appointmentLineage.app_status_on.split(",")[0]}
                              <br />
                              {appointmentLineage.app_status_on.split(",")[1]}
                            </div>
                            <div className="inner-circle"></div>
                            {/* <p className="h6 mt-3 mb-1 appointment-lineage-time">
                              
                            </p> */}
                            <p className="h6 text-muted">
                              {appointmentLineage.app_status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {showCancelBtn && (
                <Button
                  variant="danger"
                  className="w-100 mt-2"
                  onClick={handleCancelAppointment}
                  disabled={cancellingAppointment}
                >
                  {!cancellingAppointment ? (
                    "Cancel Appointment"
                  ) : (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="mx-auto my-5"
                    />
                  )}
                </Button>
              )}
            </>
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
              <Spinner
                as="span"
                animation="border"
                size="md"
                role="status"
                aria-hidden="true"
                className="mx-auto my-5"
              />
            </div>
          )}
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

export default AppointmentModal;
