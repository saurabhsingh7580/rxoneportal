import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import AuthContext from "../../context/auth-context";
import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import Toast from "../ui/Toast";
import { rxOneApi, rxOpdApi } from "../../utils/api/api";
import {
  RX_ONE_ENDPOINTS,
  RX_OPD_ENDPOINTS,
} from "../../utils/api/apiEndPoints";

function RefreshDataBtn(props) {
  const {
    type,
    setData,
    tableDataLoading,
    setTableDataLoading,
    setErrorMessage,
    startDate,
    endDate,
    isRxOne,
  } = props;

  const { logout } = useContext(AuthContext);
  const { mode } = useContext(ModeContext);
  const { currentHospital } = useContext(HospitalsContext);

  const [updateTime, setUpdateTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  useEffect(() => {
    if (searchParams.get("refresh")) {
      handleRefresh();
    }
  }, []);

  const handleRefresh = async () => {
    if (!currentHospital && type !== "hospitals" && type !== "settlements") {
      return;
    }

    setIsLoading(true);
    setTableDataLoading(true);

    const userKeys = localStorage.getItem("usr_keys");
    const userModeKey = JSON.parse(userKeys)[mode];
    const key = userModeKey[`${mode}_key`];
    const secret = userModeKey[`${mode}_secret`];

    try {
      let endPoint;
      let dataIdentifier;

      switch (type) {
        case "doctors":
          endPoint =
            RX_OPD_ENDPOINTS.HOSPITAL.ALL_DOCTORS +
            "/" +
            currentHospital.hos_id;
          dataIdentifier = "registered_doctors";
          break;

        case "hospitals":
          endPoint = RX_OPD_ENDPOINTS.HOSPITAL.ALL_HOSPITALS;
          dataIdentifier = "Registered Institutes";
          break;

        case "appointments":
          endPoint =
            RX_OPD_ENDPOINTS.HOSPITAL.APPOINTMENTS +
            "/" +
            currentHospital.hos_id +
            "/" +
            `${startDate.getFullYear()}-${
              startDate.getMonth() + 1
            }-${startDate.getDate()}` +
            "/" +
            `${endDate.getFullYear()}-${
              endDate.getMonth() + 1
            }-${endDate.getDate()}`;
          dataIdentifier = "appointments";
          break;

        case "invoices":
          endPoint =
            RX_OPD_ENDPOINTS.HOSPITAL.OPD.LIST_INVOICES +
            "/" +
            currentHospital.hos_id +
            "/" +
            `${startDate.getFullYear()}-${
              startDate.getMonth() + 1
            }-${startDate.getDate()}` +
            "/" +
            `${endDate.getFullYear()}-${
              endDate.getMonth() + 1
            }-${endDate.getDate()}`;
          dataIdentifier = "invoices";
          break;

        case "payments":
          endPoint =
            RX_OPD_ENDPOINTS.HOSPITAL.OPD.LIST_UNPAID_CASH_ORDERS +
            "/" +
            currentHospital.hos_id;
          dataIdentifier = "cash_orders";
          break;

        case "settlements":
          const userToken = localStorage.getItem("usr_token");
          endPoint =
            `${
              RX_ONE_ENDPOINTS.SETTLEMENTS.LIST_SETTLEMENTS
            }/${userToken}/${mode}/${startDate.getFullYear()}-${
              startDate.getMonth() + 1
            }-${startDate.getDate()}` +
            "/" +
            `${endDate.getFullYear()}-${
              endDate.getMonth() + 1
            }-${endDate.getDate()}`;
          dataIdentifier = "settlements";
          break;

        default:
          break;
      }

      let res;

      if (isRxOne) {
        rxOneApi.setUserSecretAuthHeaders();
        res = await rxOneApi.get(endPoint);
      } else {
        rxOpdApi.setAuthHeaders(key, secret);
        res = await rxOpdApi.get(endPoint);
      }

      if (res) {
        setData(res.data[dataIdentifier] || []);
        setUpdateTime(new Date());
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      if (error?.status === 401) {
        if (!document.querySelector(".toast-modal")) {
          setShowToast(true);
          setToastType("error");
          setToastMessage("Invalid session. Please login again.");
          setShouldLogout(true);
        }
      }

      setData([]);
      setErrorMessage(error?.message);
    } finally {
      setIsLoading(false);
      setTableDataLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-end align-items-center px-4">
      {!isLoading ? (
        !tableDataLoading && (
          <>
            <span className="mx-1" style={{ color: "#2f5496" }}>
              Updated On: {("0" + updateTime.getHours()).slice(-2)}:
              {("0" + updateTime.getMinutes()).slice(-2)}
            </span>
            <AutorenewIcon
              role="button"
              fontSize="large"
              style={{ color: "#2f5496" }}
              onClick={handleRefresh}
            />
          </>
        )
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

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
          // autohide={true}
          // autohideDelay={3000}
        >
          {toastMessage}
        </Toast>
      )}
    </div>
  );
}

export default RefreshDataBtn;
