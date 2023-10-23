import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Spinner from "react-bootstrap/Spinner";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TaskIcon from "@mui/icons-material/Task";

import AuthContext from "../../context/auth-context";
import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import RefreshDataBtn from "../refresh-data/RefreshDataBtn";
import DataTable from "../ui/DataTable";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import Calendar from "./Calendar";
import Qr from "./Qr";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";

function FacilitiesTab(props) {
  const { logout } = useContext(AuthContext);
  const { mode } = useContext(ModeContext);
  const { hospitals, refreshHospitals, isLoading, setIsLoading, isFacFalse } =
    useContext(HospitalsContext);

  const navigate = useNavigate();

  const [tableHeadRow, setTableHeadRow] = useState([
    "Registration No",
    "Accreditation By",
    "Facility Name",
    "Contact Email",
    "Registration",
    "Facility Approval",
    // "Holiday Calendar",
    "Care Portal QR",
    "Doctor Portal QR",
  ]);
  const [errorMessage, setErrorMessage] = useState();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [shouldLogout, setShouldLogout] = useState(false);
  const [disableAddFacility, setDisableAddFacility] = useState(
    hospitals.length === 0 && !isLoading
  );

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  useEffect(() => {
    const fetchKycStatus = async () => {
      setLoadingKyc(true);

      try {
        const userToken = localStorage.getItem("usr_token");

        rxOneApi.setUserSecretAuthHeaders(userToken);
        const kycRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.KYC_STATUS + "/" + userToken
        );

        if (kycRes) {
          setDisableAddFacility(!kycRes.data.document_verified);
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
        } else {
          setShowToast(true);
          setToastType("error");
          setToastMessage(error?.error?.message || error?.message);
        }
      } finally {
        setLoadingKyc(false);
      }
    };

    if (!isDataLoading && hospitals.length === 0) {
      fetchKycStatus();
    }
  }, [hospitals, isLoading]);

  const removeRegistrationCol = () => {
    if (isLoading) {
      return tableHeadRow;
    }

    return tableHeadRow;
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isFacFalse) {
      setTableHeadRow([
        "Registration No",
        "Accreditation By",
        "Facility Name",
        "Contact Email",
        "Facility Approval",
        // "Holiday Calendar",
        "Care Portal QR",
        "Doctor Portal QR",
      ]);
    } else {
      setTableHeadRow([
        "Registration No",
        "Accreditation By",
        "Facility Name",
        "Contact Email",
        "Registration",
        "Facility Approval",
        // "Holiday Calendar",
        "Care Portal QR",
        "Doctor Portal QR",
      ]);
    }
  }, [hospitals, isLoading]);

  const handleContinueEdit = hospitalId => {
    navigate("/app/facilities/register?edit=true&hosp_id=" + hospitalId, {
      replace: true,
    });
  };

  return !loadingKyc ? (
    <>
      {disableAddFacility && mode === "live" && (
        <p className="mt-3 mx-4">
          You can add new Facility once your KYC is approved.
        </p>
      )}

      <Button
        className="float-start mt-2 mx-3 rounded-pill"
        disabled={disableAddFacility && mode === "live"}
      >
        <Nav as="nav" className="my-0">
          <Nav.Link
            as={NavLink}
            to="/app/facilities/register"
            className="p-0 text-white"
          >
            Add Facility
          </Nav.Link>
        </Nav>
      </Button>

      <RefreshDataBtn
        type="hospitals"
        setData={refreshHospitals}
        tableDataLoading={isLoading}
        setTableDataLoading={setIsLoading}
        setErrorMessage={setErrorMessage}
      />

      <DataTable
        headRow={tableHeadRow}
        bodyRows={hospitals.map(hospital => {
          const dataRows = {
            regNo: hospital.hosp_registration_no,
            accreditationBy: hospital.hosp_accreditation_by,
            facName: hospital.hosp_name,
            email: hospital.email,
            registrationBtn: hospital.registration_approved === "False" && (
              <button
                className="table-btn table-update-btn fs-6"
                onClick={() => handleContinueEdit(hospital.hos_id)}
              >
                Continue Edit
              </button>
            ),
            status: (
              <button
                disabled
                className={`text-capitalize w-100 fw-bold border-2 btn btn-outline-${
                  hospital.registration_approved === "True"
                    ? "success"
                    : "danger"
                }`}
              >
                {hospital.registration_approved !== "True" ? (
                  <PendingActionsIcon className="mx-1 fw-bolder" />
                ) : (
                  <TaskIcon className="mx-1 fw-bolder" />
                )}
                {hospital.registration_approved === "True"
                  ? "Approved"
                  : "Pending"}
              </button>
            ),
            // calendar: (
            //   <Calendar
            //     hospitalId={hospital.hos_id}
            //     isDataLoading={isDataLoading}
            //     setIsDataLoading={setIsDataLoading}
            //   />
            // ),
            patientQr: (
              <Qr
                hospitalId={hospital.hos_id}
                isDataLoading={isDataLoading}
                setIsDataLoading={setIsDataLoading}
                type="patient"
              />
            ),
            doctorQr: (
              <Qr
                hospitalId={hospital.hos_id}
                isDataLoading={isDataLoading}
                setIsDataLoading={setIsDataLoading}
                type="doctor"
              />
            ),
            key: hospital.hos_id,
          };

          if (!isFacFalse) {
            delete dataRows.registrationBtn;
          }

          return dataRows;
        })}
        isLoading={isLoading}
      />

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
  ) : (
    <div className="my-5 py-5 d-flex align-items-center justify-content-center">
      <Spinner as="span" animation="border" role="status" aria-hidden="true" />
    </div>
  );
}

export default FacilitiesTab;
