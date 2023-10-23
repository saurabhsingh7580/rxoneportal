import { useContext, useEffect, useState } from "react";
import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";
import DatePicker from "react-datepicker";
import * as Yup from "yup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import BootstrapForm from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../context/mode-context";
import DoctorSchedule from "./DoctorSchedule";
import InputErrorMessage from "../kyc/InputErrorMessage";
import ScheduleModalLabel from "./ScheduleModalLabel";
import ScheduleModalInput from "./ScheduleModalInput";
import ScheduleModalSelect from "./ScheduleModalSelect";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const recurringValidationSchema = Yup.object().shape({
  update: Yup.object().shape({
    appointmentType: Yup.string().required("Appointment Type is required"),
    weekdays: Yup.array()
      .min(1, "Select at least one of the weekdays")
      .required("Weekdays is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    slotDuration: Yup.string().required("Slot Duration is required"),
    scheduleEndDate: Yup.date().required("End Date is required"),
  }),
});

const dayValidationSchema = Yup.object().shape({
  update: Yup.object().shape({
    appointmentType: Yup.string().required("Appointment Type is required"),
    scheduleDate: Yup.date().required("Schedule Date is required"),
    // declareOff:Yup.array().required(),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    slotDuration: Yup.string().required("Slot Duration is required"),
  }),
});

function UpdateScheduleModal(props) {
  const { hospitalId, doctorId, setShowRegistrationDocsModal, show, onHide } =
    props;

  const { mode } = useContext(ModeContext);

  const [updateRecurringSchedule, setUpdateRecurringSchedule] = useState(true);
  const [formValues, setFormValues] = useState(null);
  const [formValidationSchema, setFormValidationSchema] = useState(null);
  const [fetchingSchedule, setFetchingSchedule] = useState(true);
  const [appointType, setAppointType] = useState("online");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchDocSchedule = async () => {
      setFetchingSchedule(true);

      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        let endPoint = "";
        let dateString = "";

        if (updateRecurringSchedule) {
          endPoint = RX_OPD_ENDPOINTS.HOSPITAL.FETCH_DOCTOR_RECURRING_SCHEDULE;
        } else {
          const today = new Date();

          endPoint = RX_OPD_ENDPOINTS.HOSPITAL.FETCH_DOCTOR_DAY_SCHEDULE;
          dateString =
            today.getFullYear() +
            "-" +
            today.getMonth() +
            "-" +
            today.getDate();
        }

        rxOpdApi.setAuthHeaders(key, secret);
        const scheduleRes = await rxOpdApi.get(
          `${endPoint}/${hospitalId}/${doctorId}/${appointType}${
            updateRecurringSchedule ? "" : "/" + dateString
          }`
        );

        if (scheduleRes) {
          if (updateRecurringSchedule) {
            if (Object.keys(scheduleRes.data).length === 0) {
              setShowToast(true);
              setToastType("info");
              setToastMessage("No schedule found!");
              setFormValues({
                update: {
                  appointmentType: appointType,
                  weekdays: "",
                  startTime: "09.00",
                  endTime: "18.00",
                  slotDuration: "10",
                  scheduleEndDate: "",
                },
              });
            } else {
              setFormValues({
                update: {
                  appointmentType: scheduleRes.data.appointment_type,
                  weekdays: scheduleRes.data.weekdays.map(day =>
                    day.toString()
                  ),
                  startTime: scheduleRes.data.start_time,
                  endTime: scheduleRes.data.end_time,
                  slotDuration: scheduleRes.data.slot_duration,
                  scheduleEndDate: new Date(
                    scheduleRes.data.schedule_till_date
                  ),
                },
              });
            }

            setFormValidationSchema(recurringValidationSchema);
          } else {
            const defaultScheduleDate = new Date();

            // set timezone globally - IST
            defaultScheduleDate.setDate(defaultScheduleDate.getDate() + 1);
            if (scheduleRes.data.message) {
              setShowToast(true);
              setToastType("info");
              setToastMessage(scheduleRes.data.message);
              setFormValues({
                update: {
                  appointmentType: appointType,
                  scheduleDate: defaultScheduleDate,
                  declareOff: "",
                  startTime: "09.00",
                  endTime: "18.00",
                  slotDuration: "10",
                },
              });
            } else {
            }

            setFormValidationSchema(dayValidationSchema);
          }
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);
      } finally {
        setFetchingSchedule(false);
      }
    };

    fetchDocSchedule();
  }, [updateRecurringSchedule, appointType, doctorId, hospitalId, mode]);

  const handleAppointmentChange = async appType => {
    setAppointType(appType);
  };

  const handleSubmit = async values => {
    const vals = { ...values.update };

    setIsSubmitting(true);

    const userKeys = localStorage.getItem("usr_keys");
    const userModeKey = JSON.parse(userKeys)[mode];
    const key = userModeKey[`${mode}_key`];
    const secret = userModeKey[`${mode}_secret`];

    try {
      let endPoint;
      let body;
      let dateString;

      if (updateRecurringSchedule) {
        endPoint = RX_OPD_ENDPOINTS.HOSPITAL.CREATE_DOCTOR_RECURRING_SCHEDULE;
        body = {
          appointment_type: vals.appointmentType,
          days_list: vals.weekdays.map(day => +day).sort((a, b) => a - b),
          start_time: vals.startTime,
          end_time: vals.endTime,
          slot_duration: vals.slotDuration,
          schedule_end_date:
            vals.scheduleEndDate.getFullYear() +
            "-" +
            (vals.scheduleEndDate.getMonth() + 1) +
            "-" +
            vals.scheduleEndDate.getDate(),
        };
      } else {
        endPoint = RX_OPD_ENDPOINTS.HOSPITAL.CREATE_DOCTOR_DAY_SCHEDULE;
        body = {
          is_available: !vals.declareOff?.includes("1"),
          start_time: vals.startTime,
          end_time: vals.endTime,
          slot_duration: vals.slotDuration,
        };
        dateString =
          vals.scheduleDate.getFullYear() +
          "-" +
          vals.scheduleDate.getMonth() +
          "-" +
          vals.scheduleDate.getDate();
      }

      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.put(
        `${endPoint}/${hospitalId}/${doctorId}${
          updateRecurringSchedule ? "" : "/" + appointType + "/" + dateString
        }`,
        body
      );

      if (res) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(res.data?.message);
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
    // setIsLoading(true);

    // setToastType("error");
    //   setShowToast(true);
    //   setToastMessage(error.message);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="custom-modal"
        centered
        dialogClassName="vw-100"
        contentClassName="m-0 p-3"
      >
        <Modal.Header
          closeButton
          className="justify-content-center text-center w-100 update-schedule-modal"
        >
          {/* <div> */}
          <h1 className="h5 text-muted text-center">
            Update Recurring Schedule
          </h1>

          <BootstrapForm.Check
            type="switch"
            className="d-inline ms-2"
            checked={updateRecurringSchedule}
            value={updateRecurringSchedule}
            onChange={() => setUpdateRecurringSchedule(prev => !prev)}
          />
          {/* </div> */}
        </Modal.Header>
        <Modal.Body>
          {!fetchingSchedule ? (
            <>
              <Formik
                initialValues={formValues}
                validationSchema={formValidationSchema}
                onSubmit={handleSubmit}
              >
                {formikProps => (
                  <FormikForm>
                    <Container>
                      <Row>
                        <label className="col-12 col-sm-5 d-inline-flex align-items-center justify-content-start justify-content-sm-end fw-bold py-1 schedule-modal-odd-row">
                          Appointment Type:
                        </label>

                        <BootstrapForm.Group className="col-12 col-sm-7 d-flex align-items-center">
                          <Field name="update.appointmentType">
                            {({ field, meta }) => (
                              <>
                                <input
                                  {...field}
                                  type="radio"
                                  name="update.appointmentType"
                                  value="online"
                                  checked={meta.value === "online"}
                                  onChange={() =>
                                    handleAppointmentChange("online")
                                  }
                                />

                                <label className="ms-2 me-4">
                                  Tele-Consultation
                                </label>

                                <input
                                  {...field}
                                  type="radio"
                                  name="update.appointmentType"
                                  value="in-person"
                                  checked={meta.value === "in-person"}
                                  onChange={() =>
                                    handleAppointmentChange("in-person")
                                  }
                                />

                                <label className="ms-2">At Clinic</label>
                              </>
                            )}
                          </Field>
                        </BootstrapForm.Group>

                        <ErrorMessage
                          component={InputErrorMessage}
                          name="update.appointmentType"
                        />
                      </Row>
                    </Container>

                    <DoctorSchedule
                      type="update"
                      isItDaySche={!updateRecurringSchedule}
                    />

                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        disabled={isSubmitting}
                        className="mx-3"
                        onClick={onHide}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid primary",
                          color: "black",
                        }}
                      >
                        Cancel
                      </Button>

                      <Button disabled={isSubmitting} type="submit">
                        {!isSubmitting ? (
                          "Save"
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
                      </Button>
                    </div>
                  </FormikForm>
                )}
              </Formik>
            </>
          ) : (
            <div className="text-center fw-bold w-100">
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
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

export default UpdateScheduleModal;
