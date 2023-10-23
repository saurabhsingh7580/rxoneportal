import { useContext, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../context/mode-context";
import FormControl from "../form/FormControl";
import InputErrorMessage from "../kyc/InputErrorMessage";
import Button from "../ui/Button";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const accreditationBodyOptions = [
  { label: "National Medical Council (NMC)", value: "NMC" },
  { label: "Andhra Pradesh Medical Council (APMC)", value: "APMC" },
  { label: "Arunachal Pradesh Medical Council (ARUNAPMC)", value: "ARUNAPMC" },
  { label: "Assam Medical Council (ASSAMC)", value: "ASSAMC" },
  { label: "Bihar Medical Council (BMC)", value: "BMC" },
  { label: "Chattisgarh Medical Council (CGMC)", value: "CGMC" },
  { label: "Delhi Medical Council (DMC)", value: "DMC" },
  { label: "Goa Medical Council (GOAMC)", value: "GOAMC" },
  { label: "Gujarat Medical Council (GMC)", value: "GMC" },
  { label: "Haryana Medical Council (HMC)", value: "HMC" },
  { label: "Himanchal Pradesh Medical Council (HPSMC)", value: "HPSMC" },
  { label: "Jammu & Kashmir Medical Council (JKMC)", value: "JKMC" },
  { label: "Jharkhand Medical Council (JMC)", value: "JMC" },
  { label: "Karnataka Medical Council (KMC)", value: "KMC" },
  { label: "Madhya Pradesh Medical Council (MPMC)", value: "MPMC" },
  { label: "Maharashtra Medical Council (MAMC)", value: "MAMC" },
  { label: "Manipur Medical Council (MMC)", value: "MMC" },
  { label: "Mizoram Medical Council (MSMC)", value: "MSMC" },
  { label: "Nagaland Medical Council (NAGAMC)", value: "NAGAMC" },
  { label: "Orissa Council of Medical Registration (OCMR)", value: "OCMR" },
  { label: "Punjab Medical Council (PMC)", value: "PMC" },
  { label: "Rajasthan Medical Council (RMC)", value: "RMC" },
  { label: "Sikkim Medical Council (SMC)", value: "SMC" },
  { label: "Tamil Nadu Medical Council (TNMC)", value: "TNMC" },
  { label: "Telangana State Medical Council (TSMC)", value: "TSMC" },
  {
    label: "Travancore Cochin Medical Council, Trivandrum (TCMC)",
    value: "TCMC",
  },
  { label: "Tripura State Medical Council (TSMC)", value: "TSMC" },
  { label: "Uttarakhand Medical Council (UKMC)", value: "UKMC" },
  { label: "Uttar Pradesh Medical Council (UPMC)", value: "UPMC" },
  { label: "West Bengal Medical Council (WBMC)", value: "WBMC" },
];

const initialValues = {
  accreditationBody: "",
  rmpRegCertificate: "",
  docProfilePic: "",
};

const validationSchema = Yup.object().shape({
  accreditationBody: Yup.object().required("Accrediation Body is required."),
  rmpRegCertificate: Yup.mixed().required(
    "RMP Registration Certificate is required."
  ),
  docProfilePic: Yup.mixed().required("Doctor's Profile Pic is required."),
});

function RegistrationDocsModal(props) {
  const { hospitalId, doctorId, show, onHide } = props;

  const { mode } = useContext(ModeContext);
  const [accreditationBodyVal, setAccreditationBodyVal] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handleFormSubmit = async values => {
    const userKeys = localStorage.getItem("usr_keys");

    if (userKeys) {
      setIsFormSubmitting(true);

      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        const doctorRegistrationDocsFormData = new FormData();
        doctorRegistrationDocsFormData.append(
          "registration_certificate",
          values.rmpRegCertificate
        );
        doctorRegistrationDocsFormData.append(
          "profile_pic",
          values.docProfilePic
        );

        rxOpdApi.setMultipartHeaders();
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.post(
          `${
            RX_OPD_ENDPOINTS.HOSPITAL.UPLOAD_DOCTOR_DOCS
          }/${hospitalId}/${doctorId}/${values.accreditationBody.value.toUpperCase()}`,
          doctorRegistrationDocsFormData
        );

        if (res) {
          alert(res.data.message + "\n\nSMS Status: " + res.data.sms_status);
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        alert("ERROR:\n" + error.message);
        console.log(
          "Error in doctor registration docs upload.\nERROR:",
          error.message
        );
      } finally {
        setIsFormSubmitting(false);
      }
    } else {
      console.log("USER IS NOT LOGGED IN");
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
      contentClassName="align-items-center justify-content-around text-muted px-5 w-75"
    >
      <Modal.Header className="border-0 fs-5">
        Upload required documents to complete Doctor's registration.
      </Modal.Header>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {formikProps => (
          <Modal.Body
            as={Form}
            className="d-flex flex-column align-items-end modal-form"
          >
            <label className="accreditationBodyLabel fs-5 mb-1 text-left w-100">
              Accreditation Body
            </label>

            <Field name="accreditationBody">
              {({ field, form }) => (
                <CreatableSelect
                  {...field}
                  options={accreditationBodyOptions}
                  className="w-100"
                  name="accreditationBody"
                  onChange={option => {
                    form.setFieldValue("accreditationBody", option, true);
                    setAccreditationBodyVal(option.value);
                  }}
                  styles={{
                    control: controlStyles => ({
                      ...controlStyles,
                      height: "2.5rem",
                      border: "2px solid #b3c6e7",
                      borderRadius: "0",
                    }),
                  }}
                />
              )}
            </Field>

            {!accreditationBodyVal && (
              <ErrorMessage
                component={InputErrorMessage}
                name="accreditationBody"
              />
            )}

            <FormControl
              label="RMP Registration Certificate"
              type="file"
              name="rmpRegCertificate"
              className="d-flex flex-column fs-5"
            />

            <FormControl
              label="Doctor's Profile Pic"
              type="file"
              name="docProfilePic"
              className="d-flex flex-column fs-5"
            />

            <Button
              disabled={isFormSubmitting}
              type="submit"
              className="mt-3 border-0"
              style={{ backgroundColor: "red", minWidth: "12%" }}
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
        )}
      </Formik>
    </Modal>
  );
}

export default RegistrationDocsModal;
