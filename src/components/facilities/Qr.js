import { useContext, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import ModeContext from "../../context/mode-context";
import QrModal from "./QrModal";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

function Qr(props) {
  const { type, hospitalId, isDataLoading, setIsDataLoading } = props;

  const { mode } = useContext(ModeContext);

  const [showQrModal, setShowQrModal] = useState(false);
  const [patientQrLink, setPatientQrLink] = useState(null);
  const [doctorQrLink, setDoctorQrLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleQrCall = async () => {
    if (isDataLoading) return;

    setIsDataLoading(true);
    setIsLoading(true);

    try {
      const userKeys = localStorage.getItem("usr_keys");

      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);
      const createPatientPortalQrRes = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.CREATE_PATIENT_PORTAL_QR + "/" + hospitalId
      );
      const createDoctorPortalQrRes = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.CREATE_DOCTOR_PORTAL_QR + "/" + hospitalId
      );

      if (
        createPatientPortalQrRes.data.message ||
        createDoctorPortalQrRes.data.message
      ) {
        // setShowToast(true);
        // setToastType("info");
        // setToastMessage(
        //   createPatientPortalQrRes.data.message ||
        //     createDoctorPortalQrRes.data.message
        // );
      }

      if (createPatientPortalQrRes && createDoctorPortalQrRes) {
        setShowQrModal(true);
        setDoctorQrLink(
          createDoctorPortalQrRes.data.portal_url ||
            createDoctorPortalQrRes.data.doctor_portal_short_url
        );
        setPatientQrLink(
          createPatientPortalQrRes.data.portal_url ||
            createPatientPortalQrRes.data.patient_portal_short_url
        );
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setIsDataLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isLoading ? (
        <>
          <QrCodeScannerIcon
            onClick={handleQrCall}
            style={{
              width: "100%",
              fontSize: "2.25rem",
              margin: "0 auto",
              // color: "#0d6efd",
            }}
          />

          {showQrModal && !showToast && (
            <QrModal
              type={type}
              qrLink={type === "patient" ? patientQrLink : doctorQrLink}
              hospitalId={hospitalId}
              show={showQrModal}
              onHide={() => setShowQrModal(false)}
            />
          )}
        </>
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

export default Qr;
