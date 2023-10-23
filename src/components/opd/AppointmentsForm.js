import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";

import HospitalsContext from "../../context/hospitals-context";
import { AppointmentsFormProvider } from "../../context/appointments-form";
import Form from "../form/Form";
import PatientDetails from "./appointments-form/PatientDetails";
import SelectProfile from "./appointments-form/SelectProfile";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";
import SelectDoctor from "./appointments-form/SelectDoctor";
import Payment from "./appointments-form/Payment";

const initialValues = {
  patientDetails: {
    contactNo: "",
  },
  selectDoctor: {
    appointmentType: "in-person",
    date: new Date(),
  },
};

const validationSchema = Yup.object().shape({
  patientDetails: Yup.object().shape({
    contactNo: Yup.string()
      .required("Contact No. is required")
      .length(10, "Invalid phone number"),
  }),
  selectDoctor: Yup.object().shape({
    appointmentType: Yup.string().required("Appointment Type is required"),
    date: Yup.date().required("Date is required"),
  }),
});

function AppointmentsForm(props) {
  const { show, onHide } = props;
  const { currentHospital } = useContext(HospitalsContext);

  const [changeStep, setChangeStep] = useState(false);
  const [jumpToStep, setJumpToStep] = useState(null);
  const [formNavItems, setFormNavItems] = useState([
    {
      label: "Patient's Details",
      identifier: "patientDetails",
      isActive: true,
      // element: <DoctorDetails />,
      element: PatientDetails,
      elementWrapperClassName: "",
      formHeading: "Confirm Patient registration details to proceed",
      elementProps: {
        style: { paddingTop: "-8px" },
        setChangeStep,
        setJumpToStep,
      },
      eleFormClass: "px-md-5",
    },
    {
      label: "Patient's Details",
      identifier: "selectProfile",
      isActive: false,
      element: SelectProfile,
      // element: PatientDetails,
      elementWrapperClassName: "w-100",
      eleFormClass: "px-md-0",
      formHeading: "Select from available profiles for booking",
      elementProps: {
        setChangeStep,
        setJumpToStep,
      },
    },
    {
      label: "Doc's Details",
      identifier: "selectDoctor",
      isActive: false,
      element: SelectDoctor,
      // element: PatientDetails,
      elementWrapperClassName: "w-100",
      formHeading: "Select from the list of available doctors",
      elementProps: { setChangeStep, setJumpToStep },
    },
    {
      label: "Payment",
      identifier: "payment",
      isActive: false,
      element: Payment,
      // element: PatientDetails,
      elementWrapperClassName: "w-100",
      formHeading: "Payment",
      elementProps: { onHide },
    },
  ]);

  return (
    <Modal centered show={show} onHide={onHide}>
      {/* <Modal.Header closeButton>
        <Modal.Title>Book Appointment</Modal.Title>
      </Modal.Header> */}

      <Modal.Body className="m-0 p-0">
        <AppointmentsFormProvider>
          <Form
            type="Book Appointment"
            formNavItems={formNavItems}
            setFormNavItems={setFormNavItems}
            initialValues={initialValues}
            validationSchema={validationSchema}
            changeStep={changeStep}
            setChangeStep={setChangeStep}
            jumpToStep={jumpToStep}
            formPadding="random-string"
            onHide={onHide}
          />
        </AppointmentsFormProvider>
      </Modal.Body>
    </Modal>
  );
}

export default AppointmentsForm;
