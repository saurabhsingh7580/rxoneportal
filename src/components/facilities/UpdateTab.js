import { useContext, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

import HospitalsContext from "../../context/hospitals-context";
import ModeContext from "../../context/mode-context";
import UpdateModal from "./UpdateModal";
import RefreshDataBtn from "../refresh-data/RefreshDataBtn";
import DataTable from "../ui/DataTable";
import Prompt from "../ui/Prompt";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const tableHeadRow = [
  "Registration No",
  "Accreditation By",
  "Facility Name",
  "Contact Email",
  "Facility Approval",
  "",
  " ",
];

function UpdateTab(props) {
  const { mode } = useContext(ModeContext);
  const {
    hospitals,
    refreshHospitals,
    isLoading,
    setIsLoading,
    removeHospitalById,
  } = useContext(HospitalsContext);
  const [isFacilityDeleting, setIsFacilityDeleting] = useState(false);
  const [deleteHospitalId, setDeleteHospitalId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateHospitalId, setUpdateHospitalId] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  const [showPrompt, setShowPrompt] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleUpdateFacility = async hospitalId => {
    setShowUpdateModal(true);
    setUpdateHospitalId(hospitalId);
  };

  const handleRemoveClick = hospitalId => {
    setDeleteHospitalId(hospitalId);
    setShowPrompt(true);
  };

  const handleRemoveFacility = async hospitalId => {
    const userKeys = localStorage.getItem("usr_keys");

    if (userKeys && !isLoading) {
      setIsFacilityDeleting(true);
      setDeleteHospitalId(hospitalId);

      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.delete(
          RX_OPD_ENDPOINTS.HOSPITAL.DELETE_HOSPITAL + "/" + hospitalId
        );

        if (res) {
          // alert(res.data.message);
          removeHospitalById(hospitalId);
          setShowPrompt(false);
          setShowToast(true);
          setToastType("success");
          setToastMessage(res.data.message);
        } else {
          throw new Error("Something went wrong. Please try later");
        }
      } catch (error) {
        // console.log("Error in deleting hospital record:", error);
        // alert("ERROR:\n" + error.message);
        setShowPrompt(false);
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);
      } finally {
        setIsFacilityDeleting(false);
      }
    } else {
      console.log("USER IS NOT LOGGED IN");
    }
  };

  return (
    <>
      <RefreshDataBtn
        type="hospitals"
        setData={refreshHospitals}
        tableDataLoading={isLoading || isFacilityDeleting}
        setTableDataLoading={setIsLoading}
        setErrorMessage={setErrorMessage}
      />

      <DataTable
        headRow={tableHeadRow}
        bodyRows={hospitals.map(hospital => ({
          regNo: hospital.hosp_registration_no,
          accreditationBy: hospital.hosp_accreditation_by,
          facName: hospital.hosp_name,
          email: hospital.email,
          status: (
            <button
              disabled
              className={`text-capitalize w-100 fw-bold border-2 btn btn-outline-${
                hospital.registration_approved === "True" ? "success" : "danger"
              }`}
            >
              {hospital.registration_approved === "True"
                ? "Approved"
                : "Pending"}
            </button>
          ),
          update: (
            <button
              className="table-btn table-update-btn"
              onClick={() => handleUpdateFacility(hospital.hos_id)}
            >
              Update Details
            </button>
          ),
          remove: (
            <button
              disabled={isFacilityDeleting}
              className="table-btn table-remove-btn"
              onClick={() => handleRemoveClick(hospital.hos_id)}
            >
              {/* {isFacilityDeleting && deleteHospitalId === hospital.hos_id ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="mx-3"
                />
              ) : ( */}
              Remove
              {/* )} */}
            </button>
          ),
          key: hospital.hos_id,
        }))}
        isLoading={isLoading}
      />

      {showUpdateModal && (
        <UpdateModal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          hospitalId={updateHospitalId}
          mode={mode}
        />
      )}

      {showPrompt && (
        <Prompt
          show={showPrompt}
          handleNevermind={setShowPrompt}
          handleGoAhead={() => handleRemoveFacility(deleteHospitalId)}
          isGoAheading={isFacilityDeleting}
        >
          Are you sure you would like to Remove Facility? It will remove all
          records associated with the facility.
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

export default UpdateTab;
