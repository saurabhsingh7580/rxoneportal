import { useContext, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import AppointmentModal from "./AppointmentModal";
import AppointmentsForm from "./AppointmentsForm";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const getYyyyMmDdDate = (date) =>
  `${date.getFullYear()}-${+date.getMonth() + 1}-${date.getDate()}`;

const getDateFromTime = (date, time, startOrEnd) => {
  const splittedTime = time.split(".");
  const newDate = new Date(date);

  newDate.setHours(splittedTime[0]);
  newDate.setMinutes(splittedTime[1]);
  newDate.setSeconds(0);

  return newDate;
};

const getAppointmentStyles = (status) => {
  switch (status) {
    case "Not Confirmed":
      return { backgroundColor: "white", borderColor: "red", textColor: "red" };

    case "Confirmed":
      return {
        backgroundColor: "blue",
        borderColor: "darkblue",
        textColor: "white",
      };

    case "Completed":
      return {
        backgroundColor: "green",
        borderColor: "darkgreen",
        textColor: "white",
      };

    case "Cancelled":
      return {
        backgroundColor: "white",
        borderColor: "grey",
        textColor: "grey",
      };

    default:
      return {
        backgroundColor: "white",
        borderColor: "black",
        textColor: "black",
      };
  }
};

function FullCalendarApp(props) {
  const { selectedDocId } = props;

  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading: areHospitalsLoading } =
    useContext(HospitalsContext);

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAppointmentsForm, setShowAppointmentsForm] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const calendarRef = useRef(null);

  const handleAppointmentClick = async (appointmentData) => {
    const { id, start, end } = appointmentData.event;
    console.log({ appointmentData, id, start, end });
    setAppointmentId(id);
    setShowAppointmentModal(true);
  };

  const fetchAppointments = async (fetchInfo, successCb, failureCb) => {
    console.log({ fetchInfo });

    try {
      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);
      const appointmentsRes = await rxOpdApi.get(
        RX_OPD_ENDPOINTS.HOSPITAL.APPOINTMENT.LIST_DOCS_APPOINTMENTS +
          "/" +
          currentHospital.hos_id +
          "/" +
          selectedDocId +
          "/" +
          getYyyyMmDdDate(fetchInfo.start) +
          "/" +
          getYyyyMmDdDate(fetchInfo.end)
      );

      console.log({
        appointmentsResData: appointmentsRes,
      });

      if (appointmentsRes && appointmentsRes?.data?.records?.length > 0) {
        const fetchedAppointments = appointmentsRes.data.records.map((a) => ({
          id: a.appointment_id,
          title:
            a.patient_name + ", " + a.patient_age + ", " + a.patient_gender,
          start: getDateFromTime(
            a.appointment_date_formatted,
            a.appointment_start_time,
            "start"
          ),
          end: getDateFromTime(
            a.appointment_date_formatted,
            a.appointment_end_time,
            "end"
          ),
          ...getAppointmentStyles(a.appointment_card_status),
          // status: a.appointment_card_status,
        }));

        console.log({ fetchedAppointments });

        successCb(fetchedAppointments);
      } else {
        successCb([]);
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);

      failureCb(error.message);
    }
  };

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "title",
          center: "book today",
          end: "dayGridMonth,timeGridWeek,timeGridDay prev,next",
        }}
        customButtons={{
          book: {
            text: "book",
            click: () => setShowAppointmentsForm(true),
          },
        }}
        events={fetchAppointments}
        eventMinHeight={20}
        displayEventTime={false}
        dateClick={(e) => {
          console.log(e.dateStr);
        }}
        allDaySlot={false}
        dayHeaderClassNames="no-scrollbar"
        eventClick={handleAppointmentClick}
        themeSystem="bootstrap5"
        height={600}
        nowIndicator={true}
        navLinks={true}
      />

      {showAppointmentModal && (
        <AppointmentModal
          show={showAppointmentModal}
          onHide={() => setShowAppointmentModal(false)}
          appointmentId={appointmentId}
        />
      )}

      {showAppointmentsForm && (
        <AppointmentsForm
          show={showAppointmentsForm}
          onHide={() => setShowAppointmentsForm(false)}
        />
      )}
    </>
  );
}

export default FullCalendarApp;
