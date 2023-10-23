import { useContext, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import RefreshDataBtn from "../refresh-data/RefreshDataBtn";
import DataTable from "../ui/DataTable";
import Prompt from "../ui/Prompt";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const tableHeadRow = [
  "Doctor Name",
  "Speciality",
  "RMP No.",
  "Consultation Charges",
  "Registration Status",
  " ",
];

function RemoveTab(props) {
  const {
    registeredDoctors,
    setRegisteredDoctors,
    areDoctorsLoading,
    setAreDoctorsLoading,
    noDataMessage,
    setDeletedDoctorId,
  } = props;
  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading } = useContext(HospitalsContext);
  const [deletingDoctorId, setDeletingDoctorId] = useState(null);
  const [isDoctorBeingDeleted, setIsDoctorBeingDeleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(noDataMessage);
  const [showPrompt, setShowPrompt] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleRemoveClick = doctorId => {
    setDeletingDoctorId(doctorId);
    setShowPrompt(true);
  };

  const handleRemoveDoctor = async doctorId => {
    const userKeys = localStorage.getItem("usr_keys");

    if (userKeys) {
      setIsDoctorBeingDeleted(true);
      setDeletingDoctorId(doctorId);

      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.delete(
          RX_OPD_ENDPOINTS.HOSPITAL.DELETE_DOCTOR +
            "/" +
            currentHospital.hos_id +
            "/" +
            doctorId
        );

        if (res) {
          setDeletedDoctorId(doctorId);
          setShowToast(true);
          setToastType("success");
          setToastMessage(res.data.message);
        } else {
          throw new Error("Something went wrong. Please try later");
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);
      } finally {
        setShowPrompt(false);
        setIsDoctorBeingDeleted(false);
      }
    }
  };

  return (
    <>
      <RefreshDataBtn
        type="doctors"
        setData={setRegisteredDoctors}
        tableDataLoading={areDoctorsLoading}
        setTableDataLoading={setAreDoctorsLoading}
        setErrorMessage={setErrorMessage}
      />

      <DataTable
        headRow={tableHeadRow}
        bodyRows={registeredDoctors.map(doctor => ({
          docName: doctor.doctor_name,
          speciality: doctor.speciality,
          rmpNo: doctor.rmp_num,
          consultCharges: doctor.currency + " " + doctor.consult_charges,
          registrationStatus: (
            <button
              disabled
              className={`text-capitalize w-100 fw-bold border-2 btn btn-outline-${
                doctor.registration_status === "Confirmed"
                  ? "success"
                  : "danger"
              }`}
            >
              {doctor.registration_status}
            </button>
          ),
          removeBtn: (
            <button
              disabled={isDoctorBeingDeleted}
              className="table-btn table-remove-btn"
              onClick={() => handleRemoveClick(doctor.doc_id)}
            >
              Remove
            </button>
          ),
          key: doctor.doc_id,
        }))}
        noDataMessage={errorMessage}
        isLoading={areDoctorsLoading}
      />

      {showPrompt && (
        <Prompt
          show={showPrompt}
          handleNevermind={setShowPrompt}
          handleGoAhead={() => handleRemoveDoctor(deletingDoctorId)}
          isGoAheading={isDoctorBeingDeleted}
        >
          Are you sure you would like to Remove Doctor? It will remove all
          records associated with the doctor.
        </Prompt>
      )}

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

export default RemoveTab;
