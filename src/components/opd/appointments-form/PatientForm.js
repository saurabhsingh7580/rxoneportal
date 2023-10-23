import { useFormikContext } from "formik";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";

import Form from "../../form/Form";
import PatientProfile from "./PatientProfile";

const initialValues = {
  patientProfile: {
    profileType: "",
    name: "",
    gender: "",
    email: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    // bloodGroup: "",
  },
};

const validationSchema = Yup.object().shape({
  patientProfile: Yup.object().shape({
    profileType: Yup.mixed().required("Profile type is required"),
    name: Yup.string().required("Name is required"),
    gender: Yup.mixed().required("Gender is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    dob: Yup.date().required("Date of Birth is required"),
    address: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
    pinCode: Yup.string(),
    // bloodGroup: Yup.mixed().required(" is required"),
  }),
});

function PatientForm(props) {
  const {
    addToExistingProfile,
    show,
    onHide,
    setChangeStep,
    setJumpToStep,
    profileType,
  } = props;

  const formikProps = useFormikContext();

  const [formNavItems, setFormNavItems] = useState([
    {
      label: "Patient Profile",
      identifier: "patientProfile",
      isActive: true,
      // element: <DoctorDetails />,
      element: PatientProfile,
      elementWrapperClassName:
        "d-flex flex-column justify-content-start w-100 container px-0 me-0",
      formHeading: "Create patient profile",
      elementProps: {
        style: { marginTop: "-8px" },
        contactNo: formikProps.values.patientDetails.contactNo,
        onHide,
        setChangeStep,
        setJumpToStep,
        addToExistingProfile,
      },
    },
  ]);

  if (profileType === "self") {
    initialValues.patientProfile.profileType = { label: "Self", value: "self" };
  } else {
    initialValues.patientProfile.profileType = {
      label: "Family",
      value: "family",
    };
  }

  return (
    <>
      <Modal
        centered
        show={show}
        onHide={onHide}
        backdropClassName="no-patient-modal-backdrop"
        className="no-patient-modal"
      >
        <Modal.Header closeButton className="fw-bold">
          <span onClick={onHide} style={{ cursor: "pointer" }}>
            {"< Back"}
          </span>
        </Modal.Header>

        <Modal.Body className="m-0 p-0">
          <Form
            type="Patient Form"
            formNavItems={formNavItems}
            setFormNavItems={setFormNavItems}
            initialValues={initialValues}
            validationSchema={validationSchema}
            formPadding="px-md-1"
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PatientForm;
