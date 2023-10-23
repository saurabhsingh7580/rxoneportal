import { useContext, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import ModeContext from "../../context/mode-context";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

function Calendar(props) {
  const { hospitalId, isDataLoading, setIsDataLoading } = props;

  const { mode } = useContext(ModeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleCalendarCall = async () => {
    if (isDataLoading) return;

    setIsLoading(true);
    setIsDataLoading(true);

    try {
      const userKeys = localStorage.getItem("usr_keys");

      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.get(
        RX_OPD_ENDPOINTS.HOSPITAL.LIST_HOSPITAL_CALENDAR + "/" + hospitalId
      );

      if (res) {
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setIsLoading(false);
      setIsDataLoading(false);
    }
  };

  return (
    <>
      {!isLoading ? (
        <CalendarMonthIcon
          onClick={handleCalendarCall}
          style={{
            width: "100%",
            fontSize: "2.25rem",
            margin: "0 auto",
            color: "#0d6efd",
          }}
        />
      ) : (
        <div className="w-100 text-center">
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        </div>
      )}

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </>
  );
}

export default Calendar;
