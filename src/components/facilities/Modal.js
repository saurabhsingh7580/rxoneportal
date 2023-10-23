import { Form, Formik } from "formik";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";

import FormControl from "../form/FormControl";
import Button from "../ui/Button";
import { useState } from "react";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const initialValues = {
  registrationCertificate: "",
  hospitalLogo: "",
};

const validationSchema = Yup.object().shape({
  registrationCertificate: Yup.mixed().required(
    "Registration Certificate is required"
  ),
  hospitalLogo: Yup.mixed().required("Hospital Logo is required"),
});

function CustomModal(props) {
  const { hospitalId, show, onHide } = props;

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleFormSubmit = async values => {
    setIsFormSubmitting(true);

    try {
      const hospitalRegDocsFormData = new FormData();
      hospitalRegDocsFormData.append("hospital_logo", values.hospitalLogo);
      hospitalRegDocsFormData.append(
        "registration_certificate",
        values.registrationCertificate
      );
      //"Facility registration submitted, you can add doctors under this facility once Hospital/Clinic registration is approved."
      rxOpdApi.setMultipartHeaders();
      const res = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.UPLOAD_REGISTRATION_DOCS + "/" + hospitalId,
        hospitalRegDocsFormData,
        true
      );

      if (res) {
        alert(res.data.message);
      } else {
        throw new Error("Something went wrong. Please try later");
      }
    } catch (error) {
      console.log("Handle this error:\nError:", error);
    } finally {
      setIsFormSubmitting(false);
      onHide();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="custom-modal"
      centered
      dialogClassName="d-flex justify-content-center px-5"
      contentClassName="align-items-center justify-content-around text-muted w-75 px-5"
    >
      <Modal.Header className="border-0 fs-5">
        Please upload the Facility Registration Certificate and Logo (Brand)
      </Modal.Header>
      {/* d-flex flex-column align-items-center */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        <Modal.Body
          as={Form}
          className="d-flex flex-column align-items-end modal-form"
        >
          <FormControl
            label="Registration Certificate"
            type="file"
            name="registrationCertificate"
            className="d-flex flex-column fs-5"
          />

          <br />

          <FormControl
            label="Hospital Logo"
            type="file"
            name="hospitalLogo"
            className="d-flex flex-column fs-5"
          />

          <br />

          <Button
            type="submit"
            className="modal-submit-btn"
            disabled={isFormSubmitting}
            style={{
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              minWidth: "40%",
            }}
          >
            {isFormSubmitting ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mx-3"
              />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Body>
      </Formik>
    </Modal>
  );
}

export default CustomModal;
