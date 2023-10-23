import { useContext, useState } from "react";
import { useFormikContext } from "formik";
import Spinner from "react-bootstrap/Spinner";

import AppointmentsFormContext from "../../../context/appointments-form";
import NoPatientProfile from "./NoPatientProfile";
import PatientForm from "./PatientForm";
import FormControl from "../../form/FormControl";
import Button from "../../ui/Button";
import Toast from "../../ui/Toast";

function PatientDetails(props) {
  const { setChangeStep, setJumpToStep } = props;

  const { setProfiles, fetchPatientProfiles } = useContext(
    AppointmentsFormContext
  );

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loadingPatientDetails, setLoadingPatientDetails] = useState(false);
  const [showNoPatientsModal, setShowNoPatientsModal] = useState(false);
  const [noPatientProfileMsg, setNoPatientProfileMsg] = useState(null);
  const [createPatientForm, setCreatePatientForm] = useState(false);

  const formikProps = useFormikContext();

  const handleFetchDetails = async () => {
    try {
      const errors = await formikProps.setFieldTouched(
        "patientDetails.contactNo"
      );

      if (
        "patientDetails" in errors &&
        Object.keys(errors.patientDetails).length !== 0
      ) {
        return;
      }

      setLoadingPatientDetails(true);

      const contactNo = formikProps.values.patientDetails.contactNo;

      const data = await fetchPatientProfiles(contactNo);

      if (!data) {
        throw new Error("Something went wrong. Please try again later.");
      }

      if (data.message) {
        setShowNoPatientsModal(true);
        setNoPatientProfileMsg(data.message);
        setLoadingPatientDetails(false);
      } else {
        setProfiles(data.profiles);
        setChangeStep(true);
        setJumpToStep(2);
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
      setLoadingPatientDetails(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <FormControl
          // info="Enter Phone No. to be used for Doctor portal login"
          label="Contact No."
          type="tel"
          name="patientDetails.contactNo"
          labelColClass="col-12 col-md-4"
          className="mx-0"
          // disabled={isMainDataSaved || areDocsSubmitted}
        />

        <Button
          className="mt-4 w-100"
          onClick={handleFetchDetails}
          disabled={loadingPatientDetails}
        >
          {loadingPatientDetails ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mx-3"
            />
          ) : (
            "Fetch Details"
          )}
        </Button>
      </div>

      {showNoPatientsModal && (
        <NoPatientProfile
          show={showNoPatientsModal}
          onHide={() => setShowNoPatientsModal(false)}
          message={noPatientProfileMsg}
          onProceed={() => {
            setShowNoPatientsModal(false);
            setCreatePatientForm(true);
          }}
        />
      )}

      {createPatientForm && (
        <PatientForm
          addToExistingProfile={false}
          show={createPatientForm}
          onHide={() => setCreatePatientForm(false)}
          setChangeStep={setChangeStep}
          setJumpToStep={setJumpToStep}
          profileType="self"
        />
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

export default PatientDetails;
