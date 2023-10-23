import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import FullCalendar, { CalendarApi } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import CalendarTimeRow from "./CalendarTimeRow";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";
import FullCalendarApp from "./FullCalendarApp";

const events = [
  {
    start: new Date().setHours(0, 0),
    end: new Date().setHours(0, 0),
    id: 1,
    text: "Meeting",
  },
];

const getYyyyMmDdDate = date =>
  `${date.getFullYear()}-${+date.getMonth() + 1}-${date.getDate()}`;

const getHhMmMeridiemTime = hh24 => {
  let time = "";

  if (hh24 < 10 && hh24 > 0) {
    time = "0" + hh24;
  } else if (hh24 < 22 && hh24 > 12) {
    time = "0" + +(hh24 - 12);
  } else if (hh24 >= 22) {
    time = hh24 - 12;
  } else {
    time = hh24;
  }

  if (hh24 === 0) time = "12";

  if (hh24 < 12) {
    time += ":00 AM";
  } else {
    time += ":00 PM";
  }

  return time;
};

const getDateFromTime = (date, time, startOrEnd) => {
  const separator = startOrEnd === "start" ? "." : ":";
  const splittedTime = time.split(separator);
  const newDate = new Date(date);

  newDate.setHours(splittedTime[0]);
  newDate.setMinutes(splittedTime[1]);
  newDate.setSeconds(0);

  return newDate;
};

// const getAppointmentTextColor = status => {
//   switch (status) {
//     case "Not Confirmed":
//       return "#dc3545";

//     case "Cancelled":
//       return "#6c757d";

//     default:
//       return "#ffffff";
//   }
// };

const getAppointmentStyles = status => {
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

function Calendar(props) {
  const { selectedDocId } = props;

  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading: areHospitalsLoading } =
    useContext(HospitalsContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allAppointments, setAllAppointments] = useState(null);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     setLoadingAppointments(true);

  //     try {
  //       const userKeys = localStorage.getItem("usr_keys");
  //       const userModeKey = JSON.parse(userKeys)[mode];

  //       const key = userModeKey[`${mode}_key`];
  //       const secret = userModeKey[`${mode}_secret`];

  //       rxOpdApi.setAuthHeaders(key, secret);
  //       const appointmentsRes = await rxOpdApi.get(
  //         RX_OPD_ENDPOINTS.HOSPITAL.APPOINTMENT.LIST_DOCS_APPOINTMENTS +
  //           "/" +
  //           currentHospital.hos_id +
  //           "/" +
  //           selectedDocId +
  //           "/" +
  //           getYyyyMmDdDate(selectedDate) +
  //           "/" +
  //           getYyyyMmDdDate(selectedDate)
  //       );

  //       console.log({
  //         appointmentsResData: appointmentsRes,
  //         selectedDate,
  //       });

  //       if (appointmentsRes && appointmentsRes?.data?.records?.length > 0) {
  //         setAllAppointments(
  //           appointmentsRes.data.records.map(a => ({
  //             id: a.appointment_id,
  //             title:
  //               a.patient_name + ", " + a.patient_age + ", " + a.patient_gender,
  //             start: getDateFromTime(
  //               selectedDate,
  //               a.appointment_start_time,
  //               "start"
  //             ),
  //             end: getDateFromTime(selectedDate, a.appointment_end_time, "end"),
  //             ...getAppointmentStyles(a.appointment_card_status),
  //             status: a.appointment_card_status,
  //           }))
  //         );
  //       } else {
  //         setAllAppointments(null);
  //       }
  //     } catch (error) {
  //       setShowToast(true);
  //       setToastType("error");
  //       setToastMessage(error.message);
  //     } finally {
  //       setLoadingAppointments(false);
  //     }
  //   };

  //   console.log({ currentHospital, selectedDocId });

  //   // currentHospital && selectedDocId &&
  //   fetchAppointments();
  // }, [mode, currentHospital, selectedDocId, selectedDate]);

  const handleArrowBtnClick = type =>
    setSelectedDate(date => {
      const localDate = new Date(date);
      const dd = localDate.getDate();

      localDate.setDate(dd + (type === "prev" ? -1 : 1));

      return localDate;
    });

  // console.log({ allAppointments });

  return (
    <>
      {/* <Col
        xs={12}
        className="d-inline-flex justify-content-center align-items-center bg-light my-3 mx-0"
      >
        <button
          className="border-0 bg-transparent"
          onClick={() => handleArrowBtnClick("prev")}
        >
          <ArrowBackIosIcon />
        </button>

        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          placeholderText="Select Date"
          wrapperClassName="mx-2 w-auto"
          className="w-100"
          dateFormat="MMMM dd, yyyy"
          popperClassName="cal-event-date-popper"

          // calendarContainer="w-25"
        />

        <button
          className="border-0 bg-transparent"
          onClick={() => handleArrowBtnClick("next")}
        >
          <ArrowForwardIosIcon />
        </button>
      </Col> */}

      <main className="px-0 w-100">
        <Container
          className="mb-4 px-0"
          // style={{ height: "300px", overflowY: "scroll" }}
        >
          <FullCalendarApp
            date={selectedDate}
            events={allAppointments}
            selectedDocId={selectedDocId}
          />
        </Container>
      </main>

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

export default Calendar;
