import { ErrorMessage, Field } from "formik";
import DatePicker from "react-datepicker";
import { Container, Row, Spinner } from "react-bootstrap";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import ScheduleModalLabel from "./ScheduleModalLabel";
import ScheduleModalInput from "./ScheduleModalInput";
import ScheduleModalSelect from "./ScheduleModalSelect";
import InputErrorMessage from "../kyc/InputErrorMessage";
import Button from "../ui/Button";
import FieldInfo from "../form/FieldInfo";

const radioInputs = [
  { label: "Tele-Consultation", value: "online" },
  { label: "At Clinic", value: "in-person" },
];

const weekdaysCheckboxInputs = [
  { label: "Monday", value: 0 },
  { label: "Tuesday", value: 1 },
  { label: "Wednesday", value: 2 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 4 },
  { label: "Saturday", value: 5 },
  { label: "Sunday", value: 6 },
];

const declareOffCheckboxInputs = [{ label: "", value: 1 }];

function DoctorSchedule(props) {
  const { type, isItDaySche } = props;

  return (
    <Container>
      {!isItDaySche && (
        <Row className="py-2" style={{ position: "relative" }}>
          <ScheduleModalLabel>Weekdays:</ScheduleModalLabel>

          <FieldInfo
            info="Select days of the week for which you would like to create schedule"
            classes="d-inline d-md-none align-items-center m-0 p-0 me-3 ms-md-4 w-auto"
            styles={{
              position: "absolute",
              right: "-35px",
              width: "auto",
              // backgroundColor: "#d0deef",
            }}
          />

          <div className="col-12 col-sm-7 px-0">
            <Field name={`${type}.weekdays`}>
              {({ field, meta }) => (
                <ScheduleModalInput
                  type="checkbox"
                  name={`${type}.weekdays`}
                  field={field}
                  meta={meta}
                  inputs={weekdaysCheckboxInputs}
                />
              )}
            </Field>

            <ErrorMessage
              component={InputErrorMessage}
              name={`${type}.weekdays`}
            />
          </div>

          <FieldInfo
            info="Select days of the week for which you would like to create schedule"
            classes="d-none d-md-flex align-items-center m-0 p-0 h-100"
            styles={{ position: "absolute", right: "-30px", width: "auto" }}
          />
        </Row>
      )}

      {isItDaySche && (
        <>
          <Row className="py-2">
            <ScheduleModalLabel>Select Date:</ScheduleModalLabel>

            <Field name="update.scheduleDate">
              {({ field, form }) => (
                <DatePicker
                  {...field}
                  id="scheduleDate"
                  wrapperClassName="col-12 col-sm-7 px-0 px-sm-2 py-2 py-sm-0"
                  placeholderText="Select Date"
                  selected={field.value}
                  onChange={val =>
                    form.setFieldValue("update.scheduleDate", val)
                  }
                />
              )}
            </Field>

            <ErrorMessage
              component={InputErrorMessage}
              name="update.scheduleDate"
            />

            <FieldInfo
              classes="d-none d-md-flex align-items-center m-0 p-0 h-100"
              // style={{ position: "absolute", right: "-35px", width: "auto" }}
            />
          </Row>

          <Row>
            <ScheduleModalLabel>Declare:</ScheduleModalLabel>

            <div className="col-12 col-sm-7 px-0 m-auto">
              <Field name="update.declareOff">
                {({ field, meta }) => (
                  <ScheduleModalInput
                    type="checkbox"
                    name="update.declareOff"
                    field={field}
                    meta={meta}
                    inputs={declareOffCheckboxInputs}
                  />
                )}
              </Field>

              <ErrorMessage
                component={InputErrorMessage}
                name="update.declareOff"
              />
            </div>

            <FieldInfo
              classes="d-none d-md-flex align-items-center m-0 p-0 h-100"
              // style={{ position: "absolute", right: "-35px", width: "auto" }}
            />
          </Row>
        </>
      )}

      <Row className=" py-2" style={{ position: "relative" }}>
        <label className="col-6 col-sm-5 d-flex align-items-center justify-content-start justify-content-sm-end  fw-bold py-1 schedule-modal-odd-row">
          Slot Duration (in Mins):
        </label>

        <div className="col-6 col-sm-7 px-2 d-flex align-items-center">
          <Field
            as="select"
            name={`${type}.slotDuration`}
            className="w-auto border-1 px-1 border-0"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </Field>

          {/* d-none d-md-flex */}
          <FieldInfo
            info="Select Slot duration (Consultation time)"
            classes="d-flex align-items-center m-0 p-0 ms-3 ms-md-4 h-75"
            // style={{ position: "absolute", right: "-35px", width: "auto" }}
          />
        </div>

        <ErrorMessage
          component={InputErrorMessage}
          name={`${type}.slotDuration`}
        />
      </Row>

      <Row className="py-2">
        {/* <ScheduleModalLabel>Start Time:</ScheduleModalLabel> */}
        <label className="col-6 col-sm-5 d-flex align-items-center justify-content-start justify-content-sm-end  fw-bold py-1 schedule-modal-odd-row">
          Start Time:
        </label>

        <ScheduleModalSelect type={type} name={`${type}.startTime`} />

        {/* <input
          type="time"
          name={`${type}.startTime`}
          min="00:00"
          max="23:59"
          step="300"
        /> */}

        <FieldInfo
          info="Select Start Time for Day's Schedule"
          classes="d-flex align-items-center m-0 p-0 ms-3 ms-md-4 h-75 w-auto"
          // style={{ position: "absolute", right: "-35px", width: "auto" }}
        />

        <ErrorMessage
          component={InputErrorMessage}
          name={`${type}.startTime`}
        />
      </Row>

      <Row className="py-2">
        <label className="col-6 col-sm-5 d-flex align-items-center justify-content-start justify-content-sm-end  fw-bold py-1 schedule-modal-odd-row">
          End Time:
        </label>

        <ScheduleModalSelect type={type} name={`${type}.endTime`} />

        <FieldInfo
          info="Select End Time for Day's Schedule"
          classes="d-flex align-items-center m-0 p-0 ms-3 ms-md-4 h-75 w-auto"
          // style={{ position: "absolute", right: "-35px", width: "auto" }}
        />

        <ErrorMessage component={InputErrorMessage} name={`${type}.endTime`} />
      </Row>

      {!isItDaySche && (
        <Row
          className="py-2 align-items-md-center"
          style={{ position: "relative" }}
        >
          <ScheduleModalLabel>Schedule Till (End Date):</ScheduleModalLabel>

          <FieldInfo
            info="Input the date for till when you would like to create the recurring schedule"
            classes="d-inline d-md-none align-items-center m-0 p-0 me-3 ms-md-4 w-auto"
            styles={{
              position: "absolute",
              right: "-35px",
              width: "auto",
              // backgroundColor: "#d0deef",
            }}
          />

          <Field name={`${type}.scheduleEndDate`}>
            {({ field, form }) => (
              <DatePicker
                {...field}
                id="scheduleEndDate"
                wrapperClassName="col-12 col-sm-6 px-0 px-sm-2 py-2 py-sm-0"
                placeholderText="Schedule End Date"
                selected={field.value}
                onChange={val =>
                  form.setFieldValue(`${type}.scheduleEndDate`, val)
                }
              />
            )}
          </Field>

          <FieldInfo
            info="Input the date for till when you would like to create the recurring schedule"
            classes="d-none d-md-flex align-items-center m-0 p-0 ms-0 ms-lg-4 h-75 w-auto"
            // style={{ position: "absolute", right: "-35px", width: "auto" }}
          />

          <ErrorMessage
            component={InputErrorMessage}
            name={`${type}.scheduleEndDate`}
          />
        </Row>
      )}
    </Container>
  );
}

export default DoctorSchedule;
