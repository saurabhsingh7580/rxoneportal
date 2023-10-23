import { useContext, useState } from "react";
import { ErrorMessage, Form, Formik, Field } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../context/mode-context";
import ScheduleModalLabel from "./ScheduleModalLabel";
import ScheduleModalInput from "./ScheduleModalInput";
import ScheduleModalSelect from "./ScheduleModalSelect";
import InputErrorMessage from "../kyc/InputErrorMessage";
import Button from "../ui/Button";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const initialValues = {
  // appointmentType: "",
  weekdays: "",
  startTime: "09.00",
  endTime: "18.00",
  slotDuration: "10",
  scheduleEndDate: "",
};

const radioInputs = [
  { label: "Tele-Consultation", value: "online" },
  { label: "At Clinic", value: "in-person" },
];

const checkboxInputs = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

const validationSchema = Yup.object().shape({
  // appointmentType: Yup.string().required("Appointment Type is required"),
  weekdays: Yup.array()
    .min(1, "Select at least one of the weekdays")
    .required("Weekdays is required"),
  startTime: Yup.string().required("Start Time is required"),
  endTime: Yup.string().required("End Time is required"),
  slotDuration: Yup.string().required("Slot Duration is required"),
  scheduleEndDate: Yup.date().required("End Date is required"),
});

function ScheduleModal(props) {
  const {
    type,
    hospitalId,
    doctorId,
    setShowRegistrationDocsModal,
    show,
    onHide,
  } = props;

  const { mode } = useContext(ModeContext);
  const [appointmentType, setAppointmentType] = useState("online");
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handleFormSubmit = async values => {
    const userKeys = localStorage.getItem("usr_keys");

    if (userKeys) {
      setIsFormSubmitting(true);

      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      const endPoint =
        type === "add"
          ? RX_OPD_ENDPOINTS.HOSPITAL.CREATE_DOCTOR_SCHEDULE
          : RX_OPD_ENDPOINTS.HOSPITAL.UPDATE_DOCTOR_SCHEDULE;
      const body =
        type === "add"
          ? {
              appointment_type: appointmentType,
              days_list: values.weekdays.map(val => +val),
              start_time: values.startTime,
              end_time: values.endTime,
              slot_duration: values.slotDuration,
              schedule_end_date: `${values.scheduleEndDate.getFullYear()}-${
                values.scheduleEndDate.getMonth() + 1
              }-${values.scheduleEndDate.getDate()}`,
            }
          : {};

      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.put(
          RX_OPD_ENDPOINTS.HOSPITAL.CREATE_DOCTOR_SCHEDULE +
            "/" +
            hospitalId +
            "/" +
            doctorId +
            `${type === "edit" ? appointmentType + "schedule date" : ""}`,
          body
        );

        if (res) {
          alert(res.data.message);

          if (appointmentType === "online") {
            setAppointmentType("in-person");
            setIsFormSubmitting(false);
          } else {
            setShowRegistrationDocsModal(true);
            onHide();
          }
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        console.log("Error in saving doctor schedule\nERROR:", error);
        alert("Error in saving doctor schedule\nERROR: " + error.message);
        setIsFormSubmitting(false);
      }
    } else {
      console.log("USER IS NOT LOGGED IN");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="custom-modal"
      centered
      dialogClassName="vw-100"
      contentClassName="m-0 p-3"
    >
      <h1 className="h5 text-muted">
        Create recurring calendar/schedule for Doctor
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {formikProps => (
          <Container as={Form}>
            <Row className="schedule-modal-odd-row py-2 fs-4 justify-content-center text-capitalize fw-bold">
              {appointmentType}
              {/* <ScheduleModalLabel>Appointment Type:</ScheduleModalLabel> */}

              {/* <div className="col-8 col-sm-7 d-flex align-items-center px-0">
                <Field name="appointmentType">
                  {({ field, meta }) => (
                    <ScheduleModalInput
                      type="radio"
                      name="appointmentType"
                      field={field}
                      meta={meta}
                      inputs={radioInputs}
                    />
                  )}
                </Field>

                <ErrorMessage
                  component={InputErrorMessage}
                  name="appointmentType"
                />
              </div> */}
            </Row>

            <Row className="py-2">
              <ScheduleModalLabel>Weekdays:</ScheduleModalLabel>

              <div className="col-8 col-sm-7 px-0">
                <Field name="weekdays">
                  {({ field, meta }) => (
                    <ScheduleModalInput
                      type="checkbox"
                      name="weekdays"
                      field={field}
                      meta={meta}
                      inputs={checkboxInputs}
                    />
                  )}
                </Field>

                <ErrorMessage component={InputErrorMessage} name="weekdays" />
              </div>
            </Row>

            <Row className="schedule-modal-odd-row py-2">
              <ScheduleModalLabel>Start Time:</ScheduleModalLabel>

              <ScheduleModalSelect name="startTime" />

              <ErrorMessage component={InputErrorMessage} name="startTime" />

              <label className="w-auto ms-4">End Time:</label>

              <ScheduleModalSelect name="endTime" />

              <ErrorMessage component={InputErrorMessage} name="endTime" />
            </Row>

            <Row className="py-2">
              <ScheduleModalLabel>Slot Duration (in Mins):</ScheduleModalLabel>

              <div className="col-8 col-sm-7 px-0">
                <Field
                  as="select"
                  name="slotDuration"
                  className="w-auto border-1 px-1"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </Field>
              </div>
            </Row>

            <Row className="schedule-modal-odd-row py-2">
              <ScheduleModalLabel>Schedule Till (End Date):</ScheduleModalLabel>

              <Field name="scheduleEndDate">
                {({ field, form }) => (
                  <DatePicker
                    {...field}
                    id="scheduleEndDate"
                    wrapperClassName="col-8 col-sm-7 px-0"
                    placeholderText="Schedule End Date"
                    selected={field.value}
                    onChange={val => form.setFieldValue("scheduleEndDate", val)}
                  />
                )}
              </Field>

              <ErrorMessage
                component={InputErrorMessage}
                name="scheduleEndDate"
              />
            </Row>

            <Row className="px-0 justify-content-end pt-3">
              <Button
                type="submit"
                disabled={isFormSubmitting}
                className="mx-3 w-auto border-0"
                style={{
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                {isFormSubmitting ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Save & Next"
                )}
              </Button>
            </Row>
          </Container>
        )}
      </Formik>
    </Modal>
  );
}

export default ScheduleModal;
