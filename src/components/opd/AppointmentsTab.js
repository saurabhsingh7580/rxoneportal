import { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import CheckIcon from "@mui/icons-material/Check";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import AddBusinessSharpIcon from "@mui/icons-material/AddBusinessSharp";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CreditScoreIcon from "@mui/icons-material/CreditScore";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import SelectHospital from "../hospitals/SelectHospital";
import DateRange from "../date-range/DateRange";
import RefreshDataBtn from "../refresh-data/RefreshDataBtn";
import DataTable from "../ui/DataTable";
import Button from "../ui/Button";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";
import AppointmentsForm from "./AppointmentsForm";

const tableHeadRow = [
  "Appointment Date",
  "Allotted Time",
  "Doctor Name",
  "Patient Name",
  "Appointment Status",
  "Consultation Type",
  "Payment Type",
  "Payment Status",
];

const endDateVal = new Date();
const startDateVal = new Date();
startDateVal.setDate(endDateVal.getDate() - 2);

const getYyyyMmDdDate = date => {
  const month = date.getMonth() + 1;
  const d = date.getDate();

  const mm = month.toString().length === 1 ? `0${month}` : `${month}`;
  const dd = d.toString().length === 1 ? `0${d}` : `${d}`;

  return `${date.getFullYear()}-${mm}-${dd}`;
};

function AppointmentsTab() {
  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading: areHospitalsLoading } =
    useContext(HospitalsContext);
  const [startDate, setStartDate] = useState(startDateVal);
  const [endDate, setEndDate] = useState(endDateVal);
  const [appointments, setAppointments] = useState([]);
  const [noAppointmentsMessage, setNoAppointmentsMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAppointmentsForm, setShowAppointmentsForm] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (currentHospital) {
        setIsLoading(true);

        const userModeKey = JSON.parse(localStorage.getItem("usr_keys"))[mode];
        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        try {
          // appointments/hos_id/start_date/end_date
          // start_date & end_date: "yyyy-mm-dd"
          rxOpdApi.setAuthHeaders(key, secret);
          const res = await rxOpdApi.get(
            RX_OPD_ENDPOINTS.HOSPITAL.APPOINTMENTS +
              "/" +
              currentHospital.hos_id +
              "/" +
              getYyyyMmDdDate(startDate) +
              "/" +
              getYyyyMmDdDate(endDate)
          );

          if (res.data.appointments) {
            setAppointments(res.data.appointments);
          } else {
            setAppointments([]);
            setNoAppointmentsMessage(res.data.message);
          }
        } catch (error) {
          console.log(`ERROR: ${error}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAppointments([]);
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [mode, currentHospital, startDate, endDate]);

  return (
    <>
      {/* position-relative */}
      {/* <div className="d-flex  align-items-center mt-4"> */}
      <div className="row justify-content-around align-items-center px-2 mt-2">
        <Col xs={12} lg={5}>
          <SelectHospital type="appointment" />
        </Col>

        <Col xs={12} lg={7}>
          <Button
            className="rounded-pill mt-2 mt-lg-0"
            onClick={() => setShowAppointmentsForm(true)}
            disabled={areHospitalsLoading || !currentHospital}
          >
            Book Appointment
          </Button>
        </Col>
      </div>

      <div className="row align-items-center mt-lg-3 px-2">
        <Col xs={12} className="d-flex mt-3 mt-lg-0 align-items-center">
          <DateRange
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Col>
      </div>

      <RefreshDataBtn
        type="appointments"
        setData={setAppointments}
        tableDataLoading={isLoading}
        setTableDataLoading={setIsLoading}
        setErrorMessage={setNoAppointmentsMessage}
        startDate={startDate}
        endDate={endDate}
      />

      <DataTable
        headRow={tableHeadRow}
        bodyRows={appointments?.map(appointment => ({
          appointment_date: appointment.appointment_date,
          allotedTime: appointment.time_alloted,
          docName: appointment.doctor,
          patientName: (
            <>
              {appointment.patient}
              <p>
                <small>{appointment.patient_phone}</small>
              </p>
              <p>
                <small>{appointment.patient_email}</small>
              </p>
            </>
          ),
          status: (
            <>
              <button
                disabled
                className={`text-capitalize w-100 h-100 fw-bold border-2 btn btn-outline-${
                  appointment.appointment_status === "Confirmed"
                    ? "success"
                    : "danger"
                }`}
              >
                {appointment.appointment_status === "Confirmed" ? (
                  <CheckIcon className="mx-1 fw-bolder" />
                ) : (
                  <AssignmentLateIcon className="mx-1 fw-bolder" />
                )}
                {appointment.appointment_status}
              </button>
            </>
          ),
          consultationType: (
            <button
              disabled
              className={`text-capitalize w-100 h-100 fw-bold border-2 btn btn-${
                appointment.appointment_type !== "in-person"
                  ? "info"
                  : "tigerlily"
              }`}
            >
              {appointment.appointment_type !== "in-person" ? (
                <VideoCameraFrontIcon className="mx-1 fw-bolder" />
              ) : (
                <AddBusinessSharpIcon className="mx-1 fw-bolder" />
              )}
              {appointment.appointment_type.replace("_", "-")}
            </button>
          ),
          paymentType: (
            <button
              disabled
              className={`text-capitalize w-100 h-100 fw-bold border-2 btn btn-${
                appointment.payment_type !== "cash" ? "info" : "tigerlily"
              }`}
            >
              {appointment.payment_type === "cash" ? (
                <PaymentsOutlinedIcon className="mx-1 fw-bolder" />
              ) : (
                <CreditCardIcon className="mx-1 fw-bolder" />
              )}
              {appointment.payment_type}
            </button>
          ),
          paymentStatus: (
            <button
              disabled
              className={`text-capitalize w-100 h-100 fw-bold border-2 btn btn-outline-${
                appointment.payment_status === "paid" ? "success" : "danger"
              }`}
            >
              {appointment.payment_status === "paid" ? (
                <CreditScoreIcon className="mx-1 fw-bolder" />
              ) : (
                <AssignmentLateIcon className="mx-1 fw-bolder" />
              )}
              {appointment.payment_status}
            </button>
          ),
          key: appointment.appointment_id,
        }))}
        noDataMessage={noAppointmentsMessage}
        isLoading={isLoading}
      />

      {showAppointmentsForm && (
        <AppointmentsForm
          show={showAppointmentsForm}
          onHide={() => setShowAppointmentsForm(false)}
        />
      )}
    </>
  );
}

export default AppointmentsTab;
