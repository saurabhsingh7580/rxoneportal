import { useContext, useEffect, useState } from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BootstrapForm from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import WbTwilightOutlinedIcon from "@mui/icons-material/WbTwilightOutlined";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import AddBusinessSharpIcon from "@mui/icons-material/AddBusinessSharp";

import ModeContext from "../../../context/mode-context";
import HospitalsContext from "../../../context/hospitals-context";
import AppointmentsFormContext from "../../../context/appointments-form";
import DoctorCard from "./DoctorCard";
import InputErrorMessage from "../../kyc/InputErrorMessage";
import TimeSlot from "./TimeSlot";
import Toast from "../../ui/Toast";
import Button from "../../ui/Button";
import { rxOpdApi } from "../../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../../utils/api/apiEndPoints";

const appointmentType = [
  { label: "Online (Video)", value: "online" },
  { label: "In-Person", value: "in-person" },
];

const today = new Date();

function SelectDoctor(props) {
  const { setChangeStep, setJumpToStep } = props;

  const { mode } = useContext(ModeContext);
  const { currentHospital } = useContext(HospitalsContext);
  const {
    selectedProfile,
    setSelectedDoc,
    setSelectedDate,
    setSelectedSlotVal,
    setSelectedAppointmentType,
    selectedAppointmentType,
    isWalkIn,
    setIsWalkIn,
    setBookingData,
    setOrderData,
  } = useContext(AppointmentsFormContext);

  const [fetchingDocs, setFetchingDocs] = useState(true);
  const [fetchingAvailableSlots, setFetchingAvailableSlots] = useState(false);
  const [bookingAppointment, setBookingAppointment] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(null);
  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [noDocsMsg, setNoDocsMsg] = useState(null);
  const [availableDocs, setAvailableDocs] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [shallProceed, setShallProceed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const formikProps = useFormikContext();

  useEffect(() => {
    const valDate = formikProps.values.selectDoctor.date;
    const currentDate = new Date();

    const valDd = valDate.getDate();
    const valMm = valDate.getMonth();
    const valYy = valDate.getFullYear();

    const currDd = currentDate.getDate();
    const currMm = currentDate.getMonth();
    const currYy = currentDate.getFullYear();

    if (valDd === currDd && valMm === currMm && valYy === currYy) {
      setIsWalkIn(true);
    } else {
      setIsWalkIn(false);
    }
  }, [formikProps.values.selectDoctor.date, setIsWalkIn]);

  useEffect(() => {
    const fetchAvailableDoctors = async () => {
      setFetchingDocs(true);
      setAvailableDocs(null);
      setNoDocsMsg(null);
      setSelectedDocId(null);
      setAvailableSlots(null);

      try {
        const userKeys = localStorage.getItem("usr_keys");
        const userModeKey = JSON.parse(userKeys)[mode];

        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        const localDate = formikProps.values.selectDoctor.date;
        const month = +localDate.getMonth() + 1;
        const dd = +localDate.getDate();
        const formattedDate =
          localDate.getFullYear() +
          "-" +
          (month < 10 ? "0" + month : month) +
          "-" +
          (dd < 10 ? "0" + dd : dd);

        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.OPD.LIST_AVAILABLE_DOCTORS +
            "/" +
            currentHospital.hos_id +
            "/" +
            formikProps.values.selectDoctor.appointmentType +
            "/" +
            formattedDate
        );

        if (res) {
          if (res.data.message) {
            setNoDocsMsg(res.data.message);
          } else {
            if (res.data.available_doctors.length > 0) {
              setAvailableDocs(res.data.available_doctors);
            } else {
              setNoDocsMsg("No doctors are available");
            }
          }
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);
      } finally {
        setFetchingDocs(false);
      }
    };

    fetchAvailableDoctors();
  }, [
    mode,
    formikProps.values.selectDoctor.appointmentType,
    formikProps.values.selectDoctor.date,
    currentHospital.hos_id,
  ]);

  useEffect(() => {
    const fetchDocAvailabaleSlots = async () => {
      setFetchingAvailableSlots(true);
      setAvailableSlots(null);
      setMorningSlots([]);
      setAfternoonSlots([]);
      setEveningSlots([]);
      setSelectedSlot(null);

      try {
        const userKeys = localStorage.getItem("usr_keys");
        const userModeKey = JSON.parse(userKeys)[mode];

        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        const localDate = formikProps.values.selectDoctor.date;
        const month = +localDate.getMonth() + 1;
        const dd = +localDate.getDate();
        const formattedDate =
          localDate.getFullYear() +
          "-" +
          (month < 10 ? "0" + month : month) +
          "-" +
          (dd < 10 ? "0" + dd : dd);

        rxOpdApi.setAuthHeaders(key, secret);
        const availableSlotsRes = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.OPD.LIST_AVAILABLE_SLOTS +
            "/" +
            currentHospital.hos_id +
            "/" +
            selectedDocId +
            "/" +
            formikProps.values.selectDoctor.appointmentType +
            "/" +
            formattedDate
        );

        if (availableSlotsRes) {
          setAvailableSlots(availableSlotsRes.data.time_slots);

          const allSlots = availableSlotsRes.data.time_slots;

          for (const slot of allSlots) {
            const hh = +slot.slot.substring(0, 2);
            const mm = +slot.slot.substring(3);

            if (hh < 12)
              setMorningSlots((p) => {
                p.push(slot);
                return p;
              });
            else if (hh <= 17) {
              if (hh === 17 && mm >= 30) {
                setEveningSlots((p) => {
                  p.push(slot);
                  return p;
                });
              } else {
                setAfternoonSlots((p) => {
                  p.push(slot);
                  return p;
                });
              }
            } else
              setEveningSlots((p) => {
                p.push(slot);
                return p;
              });
          }
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);
      } finally {
        setFetchingAvailableSlots(false);
      }
    };

    if (!selectedDocId || fetchingDocs) return;

    !isWalkIn && fetchDocAvailabaleSlots();
  }, [selectedDocId, mode, fetchingDocs]);

  useEffect(() => {
    if (shallProceed && !showToast) {
      setChangeStep(true);
      setJumpToStep(4);
    }
  }, [shallProceed, showToast]);

  useEffect(() => {
    console.log({ availableSlots });
  }, [isWalkIn]);

  const handleTimeSlotClick = (slot, isAvailable) => {
    if (!isAvailable) return;

    setSelectedSlotVal(slot);
  };

  const handleNext = async () => {
    setBookingAppointment(true);

    try {
      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];
      const today = `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`;
      const selectedDate1 = `${formikProps.values.selectDoctor.date.getFullYear()}-${
        formikProps.values.selectDoctor.date.getMonth() + 1
      }-${formikProps.values.selectDoctor.date.getDate()}`;
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      const localDate = formikProps.values.selectDoctor.date;
      const month = +localDate.getMonth() + 1;
      const dd = +localDate.getDate();
      const formattedDate =
        localDate.getFullYear() +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (dd < 10 ? "0" + dd : dd);
      const body = {
        is_inperson:
          formikProps.values.selectDoctor.appointmentType === "in-person"
            ? "True"
            : "False",
        appointment_date: formattedDate,
        time_alloted: !isWalkIn ? selectedSlot.slot.replace(":", ".") : "",
        slot_duration: !isWalkIn ? selectedSlot.slot_duration : "",
        end_time: !isWalkIn ? selectedSlot.end_time.replace(":", ".") : "",
        is_walkin_appointment:
          formikProps.values.selectDoctor.appointmentType === "online" &&
          selectedDate1 === today
            ? "False"
            : isWalkIn
            ? "True"
            : "False",
      };

      rxOpdApi.setAuthHeaders(key, secret);
      const initiateBookingRes = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.OPD.INITIATE_APPOINTMENT_BOOKING +
          "/" +
          currentHospital.hos_id +
          "/" +
          selectedDocId +
          "/" +
          selectedProfile.profile_id,
        body
      );

      if (initiateBookingRes) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(initiateBookingRes.data.message);
        setShallProceed(true);
        setBookingData(initiateBookingRes.data);
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setBookingAppointment(false);
    }
  };

  return (
    <>
      <Container className="w-100" style={{ marginTop: "-12px" }}>
        {!fetchingDocs ? (
          <>
            <Row className="align-items-center mb-2">
              {/* <Col xs={4}></Col> */}
              <span className="w-auto pe-1">Booking for </span>
              {/* <Col xs={8}> */}
              <span className="fw-bold w-auto px-0">
                {selectedProfile.name}
              </span>
              {/* </Col> */}
            </Row>

            <Row className="align-items-center my-2">
              <Col xs={12} md={4}>
                Choose Type
              </Col>

              <Col xs={12} md={8}>
                <div className="px-0 w-100 d-flex justify-content-evenly mt-2 mt-md-0 justify-content-md-between align-items-center">
                  <div className="d-flex align-items-center">
                    <VideoCameraFrontIcon />

                    <button
                      type="button"
                      className={`time-slot-btn p-2 px-md-3 ms-2 ${
                        formikProps.values.selectDoctor.appointmentType ===
                        "online"
                          ? "active-time-slot"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedAppointmentType("online");

                        formikProps.setFieldValue(
                          "selectDoctor.appointmentType",
                          "online",
                          true
                        );
                      }}
                    >
                      Online
                    </button>
                  </div>

                  <div className="d-flex align-items-center ms-2">
                    <AddBusinessSharpIcon />
                    <button
                      type="button"
                      className={`time-slot-btn p-2 px-md-3 ms-2 ${
                        formikProps.values.selectDoctor.appointmentType ===
                        "in-person"
                          ? "active-time-slot"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedAppointmentType("in-person");

                        formikProps.setFieldValue(
                          "selectDoctor.appointmentType",
                          "in-person",
                          true
                        );
                      }}
                    >
                      In-Person
                    </button>
                  </div>
                </div>
              </Col>

              <ErrorMessage
                component={InputErrorMessage}
                name="selectDoctor.appointmentType"
              />
            </Row>

            <Row className="align-items-center">
              <Col xs={4}>Select Date</Col>

              <Col xs={8}>
                <Field name="selectDoctor.date">
                  {({ field, form }) => (
                    <DatePicker
                      {...field}
                      // id="dob"
                      wrapperClassName="px-0 py-2 py-sm-0 mb-1"
                      placeholderText="Select Date"
                      minDate={new Date()}
                      selected={field.value}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(val) => {
                        setSelectedDate(val);

                        form.setFieldValue("selectDoctor.date", val);
                      }}
                    />
                  )}
                </Field>
              </Col>
            </Row>

            {formikProps.values.selectDoctor.date.toDateString() ===
              today.toDateString() &&
              selectedAppointmentType === "in-person" && (
                <Row className="align-items-center">
                  <Col xs={4}>Walk-in Appointment?</Col>

                  <Col xs={8}>
                    <BootstrapForm.Check
                      type="switch"
                      className="d-inline walk-in-switch"
                      checked={isWalkIn}
                      value={isWalkIn}
                      onChange={() => setIsWalkIn((prev) => !prev)}
                    />
                  </Col>
                </Row>
              )}

            {noDocsMsg && (
              <Row className="my-3 mx-0 fs-5 text-center w-100">
                <Col xs={12}>{noDocsMsg}</Col>
              </Row>
            )}

            {availableDocs && (
              <>
                <h2 className="m-0 mt-3 mb-2 h6">Available Doctors</h2>

                {availableDocs.map((doc) => (
                  <DoctorCard
                    key={doc.doc_id}
                    docId={doc.doc_id}
                    name={(doc.firstname + " " + doc.lastname).trim()}
                    qualification={doc.qualification}
                    speciality={doc.speciality}
                    currency={doc.currency}
                    consultCharge={doc.consult_charge}
                    isSelected={selectedDocId === doc.doc_id}
                    onClick={() => {
                      setSelectedDocId(doc.doc_id);
                      setSelectedDoc(doc);
                    }}
                  />
                ))}
              </>
            )}

            {!fetchingAvailableSlots ? (
              isWalkIn ? (
                !selectedDocId ? (
                  <p className="w-100 text-center fw-bold">
                    Select a Doctor to proceed
                  </p>
                ) : (
                  <div className="w-100 d-flex justify-content-end my-2">
                    <Button
                      className="w-100"
                      disabled={bookingAppointment}
                      onClick={handleNext}
                    >
                      {bookingAppointment ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mx-auto"
                        />
                      ) : (
                        "Next"
                      )}
                    </Button>
                  </div>
                )
              ) : availableSlots ? (
                <>
                  <h2 className="m-0 mt-3 mb-2 h6">Available Slots</h2>

                  <Row>
                    <Col xs={12} className="time-period-heading">
                      <WbTwilightOutlinedIcon className="me-2" /> Morning
                    </Col>

                    {morningSlots.map((availableSlot, index) => (
                      <TimeSlot
                        key={index}
                        slot={availableSlot.slot}
                        disabled={!availableSlot.is_available}
                        onClick={() => {
                          handleTimeSlotClick(
                            availableSlot.slot,
                            availableSlot.is_available
                          );
                          setSelectedSlot(availableSlot);
                        }}
                        isSelected={availableSlot.slot === selectedSlot?.slot}
                      />
                    ))}
                  </Row>

                  <Row>
                    <Col xs={12} className="time-period-heading">
                      <WbSunnyIcon className="me-2" /> Afternoon
                    </Col>

                    {afternoonSlots.map((availableSlot, index) => (
                      <TimeSlot
                        key={index}
                        slot={availableSlot.slot}
                        disabled={!availableSlot.is_available}
                        onClick={() => {
                          handleTimeSlotClick(
                            availableSlot.slot,
                            availableSlot.is_available
                          );
                          setSelectedSlot(availableSlot);
                        }}
                        isSelected={availableSlot.slot === selectedSlot?.slot}
                      />
                    ))}
                  </Row>

                  <Row>
                    <Col xs={12} className="time-period-heading">
                      <ModeNightIcon className="me-2" /> Evening
                    </Col>

                    {eveningSlots.map((availableSlot, index) => (
                      <TimeSlot
                        key={index}
                        slot={availableSlot.slot}
                        disabled={!availableSlot.is_available}
                        onClick={() => {
                          handleTimeSlotClick(
                            availableSlot.slot,
                            availableSlot.is_available
                          );
                          setSelectedSlot(availableSlot);
                        }}
                        isSelected={availableSlot.slot === selectedSlot?.slot}
                      />
                    ))}
                  </Row>

                  <div className="w-100 d-flex justify-content-end my-2">
                    <Button
                      className="w-100"
                      disabled={!selectedSlot || bookingAppointment}
                      onClick={handleNext}
                    >
                      {bookingAppointment ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mx-auto"
                        />
                      ) : (
                        "Next"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                !noDocsMsg && (
                  <p className="w-100 text-center fw-bold">
                    {selectedDocId
                      ? "No Slots Available"
                      : "Select a Doctor to get time slots"}
                  </p>
                )
              )
            ) : (
              <div className="w-100 text-center">
                <Spinner
                  as="span"
                  animation="border"
                  size="md"
                  role="status"
                  aria-hidden="true"
                  className="mx-auto"
                />
              </div>
            )}

            {/* {!fetchingAvailableSlots ? (
              availableSlots ? (
                <>
                  <h2 className="m-0 mt-3 mb-2 h6">Available Slots</h2>

                  <Row>
                    <Col xs={12} className="time-period-heading">
                      <WbTwilightOutlinedIcon className="me-2" /> Morning
                    </Col>

                    {morningSlots.map((availableSlot, index) => (
                      <TimeSlot
                        key={index}
                        slot={availableSlot.slot}
                        disabled={!availableSlot.is_available}
                        onClick={() => {
                          handleTimeSlotClick(
                            availableSlot.slot,
                            availableSlot.is_available
                          );
                          setSelectedSlot(availableSlot);
                        }}
                        isSelected={availableSlot.slot === selectedSlot?.slot}
                      />
                    ))}
                  </Row>

                  <Row>
                    <Col xs={12} className="time-period-heading">
                      <WbSunnyIcon className="me-2" /> Afternoon
                    </Col>

                    {afternoonSlots.map((availableSlot, index) => (
                      <TimeSlot
                        key={index}
                        slot={availableSlot.slot}
                        disabled={!availableSlot.is_available}
                        onClick={() => {
                          handleTimeSlotClick(
                            availableSlot.slot,
                            availableSlot.is_available
                          );
                          setSelectedSlot(availableSlot);
                        }}
                        isSelected={availableSlot.slot === selectedSlot?.slot}
                      />
                    ))}
                  </Row>

                  <Row>
                    <Col xs={12} className="time-period-heading">
                      <ModeNightIcon className="me-2" /> Evening
                    </Col>

                    {eveningSlots.map((availableSlot, index) => (
                      <TimeSlot
                        key={index}
                        slot={availableSlot.slot}
                        disabled={!availableSlot.is_available}
                        onClick={() => {
                          handleTimeSlotClick(
                            availableSlot.slot,
                            availableSlot.is_available
                          );
                          setSelectedSlot(availableSlot);
                        }}
                        isSelected={availableSlot.slot === selectedSlot?.slot}
                      />
                    ))}
                  </Row>

                  <div className="w-100 d-flex justify-content-end my-2">
                    <Button
                      className="w-100"
                      disabled={!selectedSlot || bookingAppointment}
                      onClick={handleNext}
                    >
                      {bookingAppointment ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mx-auto"
                        />
                      ) : (
                        "Next"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                !noDocsMsg && (
                  <p className="w-100 text-center fw-bold">
                    {selectedDocId
                      ? "No Slots Available"
                      : "Select a Doctor to get time slots"}
                  </p>
                )
              )
            ) : (
              <div className="w-100 text-center">
                <Spinner
                  as="span"
                  animation="border"
                  size="md"
                  role="status"
                  aria-hidden="true"
                  className="mx-auto"
                />
              </div>
            )} */}
          </>
        ) : (
          <div className="w-100 text-center">
            <Spinner
              as="span"
              animation="border"
              size="md"
              role="status"
              aria-hidden="true"
              className="mx-auto"
            />
          </div>
        )}
      </Container>

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

export default SelectDoctor;
