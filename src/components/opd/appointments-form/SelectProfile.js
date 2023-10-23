import { useContext, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import AppointmentsFormContext from "../../../context/appointments-form";
import ProfileCard from "./ProfileCard";
import PatientForm from "./PatientForm";
import Button from "../../ui/Button";
import Toast from "../../ui/Toast";

function SelectProfile(props) {
  const { setChangeStep, setJumpToStep } = props;

  const {
    profiles,
    setSelectedProfile,
    fetchPatientProfiles,
    newProfileAdded,
    setNewProfileAdded,
  } = useContext(AppointmentsFormContext);

  const [createPatientForm, setCreatePatientForm] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const formikProps = useFormikContext();

  useEffect(() => {
    const loadPatientProfiles = async () => {
      setLoadingProfiles(true);

      try {
        const res = await fetchPatientProfiles(
          formikProps.values.patientDetails.contactNo
        );

        if (!res) {
          throw new Error("Something went wrong. Please try again later.");
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);
      } finally {
        setLoadingProfiles(false);
        setNewProfileAdded(false);
      }
    };

    loadPatientProfiles();
  }, [newProfileAdded]);

  const handleSelectProfile = async profile => {
    setSelectedProfile(profile);
    setChangeStep(true);
    setJumpToStep(3);
  };

  const handleAddNewPatient = () => setCreatePatientForm(true);

  return (
    <>
      {!loadingProfiles ? (
        <Container className="w-100" style={{ marginTop: "-14px" }}>
          {profiles.map(profile => (
            <ProfileCard
              key={profile.profile_id}
              name={profile.name}
              gender={profile.gender}
              age={profile.age}
              email={profile.email}
              profileType={profile.profile_type}
              onClick={() => handleSelectProfile(profile)}
            />
          ))}

          <Button
            className=""
            style={{ width: "105%", margin: "0 -12px" }}
            onClick={handleAddNewPatient}
          >
            Add New
          </Button>
        </Container>
      ) : (
        <div className="w-100 text-center">
          <Spinner
            as="span"
            animation="border"
            size="md"
            role="status"
            aria-hidden="true"
            className="mx-auto"
          />
        </div>
      )}

      {createPatientForm && (
        <PatientForm
          addToExistingProfile={true}
          show={createPatientForm}
          onHide={() => setCreatePatientForm(false)}
          setChangeStep={setChangeStep}
          setJumpToStep={setJumpToStep}
          profileType="family"
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

export default SelectProfile;
