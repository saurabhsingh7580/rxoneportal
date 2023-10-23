import { useContext, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../context/mode-context";
import FormControl from "../form/FormControl";
import Modal from "./Modal";
import Button from "../ui/Button";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";
import HospitalsContext from "../../context/hospitals-context";

const registerFormValues = {
  hospitalName: "",
  accreditationBy: "",
  registrationNo: "",
  bedsCount: "",
  contactEmail: "",
  contactNo1: "",
  contactNo2: "",
  address: "",
  city: "",
  country: "",
};

const registerFormValidationSchema = Yup.object().shape({
  hospitalName: Yup.string().required("Hospital Name is required"),
  accreditationBy: Yup.string().required("Accreditation by is required"),
  registrationNo: Yup.string().required("Registration No. is required"),
  bedsCount: Yup.string().required("Beds Count is required"),
  contactEmail: Yup.string()
    .required("Contact Email is required")
    .email("Invalid email format"),
  contactNo1: Yup.string()
    .required("Contact Number (1) is required")
    .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
    .label("Contact Number (1)"),
  contactNo2: Yup.string()
    .required("Contact Number (2) is required")
    .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
    .label("Contact Number (2)"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
});

const updateFormValues = {
  hospitalName: "",
  accreditationBy: "",
  bedsCount: "",
  contactEmail: "",
  contactNo1: "",
  contactNo2: "",
  address: "",
  city: "",
  country: "",
};

const updateFormValidationSchema = Yup.object().shape({
  hospitalName: Yup.string(),
  accreditationBy: Yup.string(),
  registrationNo: Yup.string(),
  bedsCount: Yup.string(),
  contactEmail: Yup.string().email("Invalid email format"),
  contactNo1: Yup.string()
    .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
    .label("Contact Number (1)"),
  contactNo2: Yup.string()
    .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
    .label("Contact Number (2)"),
  address: Yup.string(),
  city: Yup.string(),
  country: Yup.string(),
});

function FacilitiesForm(props) {
  const { type } = props;
  const { mode } = useContext(ModeContext);
  const { currentHospital } = useContext(HospitalsContext);
  const [registeredHospitalId, setRegisteredHospitalId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormSaving, setIsFormSaving] = useState(false);

  useEffect(() => {
    if (type === "update") {
      const fetchFacilitiesData = async => {};

      fetchFacilitiesData();
    }
  }, [type]);

  const handleFormSubmit = async (values, actions) => {
    setIsFormSaving(true);

    const userKeys = localStorage.getItem("usr_keys");

    if (userKeys) {
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      // console.log("formSubmit", { hosp: currentHospital.hosp_registration_no });

      let body = {};

      if (type === "register") {
        body = {
          hosp_name: values.hospitalName,
          hosp_accreditation_by: values.accreditationBy,
          hosp_registration_no: values.registrationNo,
          email: values.contactEmail,
          country: values.country,
          city: values.city,
          beds_count: values.bedsCount,
          phone1: "+91" + values.contactNo1,
          phone2: "+91" + values.contactNo2,
          address: values.address,
        };
      } else {
        if (values.hospitalName) body.hosp_name = values.hospitalName;
        if (values.accreditationBy)
          body.hosp_accreditation_by = values.accreditationBy;
        if (values.contactEmail) body.email = values.contactEmail;
        if (values.country) body.country = values.country;
        if (values.city) body.city = values.city;
        if (values.bedsCount) body.beds_count = values.bedsCount;
        if (values.contactNo1) body.phone1 = "+91" + values.contactNo1;
        if (values.contactNo2) body.phone2 = "+91" + values.contactNo2;
        if (values.address) body.address = values.address;

        body.hosp_registration_no = currentHospital.hosp_registration_no;
      }

      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const res =
          type === "register"
            ? await rxOpdApi.post(
                RX_OPD_ENDPOINTS.HOSPITAL.REGISTER_HOSPITAL,
                body
              )
            : await rxOpdApi.put(
                RX_OPD_ENDPOINTS.HOSPITAL.UPDATE_HOSPITAL,
                body
              );

        if (res) {
          if (type === "register") {
            setRegisteredHospitalId(res.data.hos_id);
            setIsModalOpen(true);
          }
          alert(res.data.message);
        } else {
          console.log(
            "Cannot register the hospital at the moment (SHOW RELEVANT MESSAGE)"
          );
          alert(res.error.message);
        }
      } catch (error) {
        console.log("Handle this error.\nError:", error);
        alert(error.message);
      } finally {
        setIsFormSaving(false);
      }
    }
  };

  return (
    <Formik
      initialValues={
        type === "register" ? registerFormValues : updateFormValues
      }
      validationSchema={
        type === "register"
          ? registerFormValidationSchema
          : updateFormValidationSchema
      }
      onSubmit={handleFormSubmit}
    >
      {formikProps => (
        <Container
          as={Form}
          className={`custom-form ${
            type === "register"
              ? "facilities-register-form"
              : "facilities-update-form"
          }`}
        >
          <Row>
            <FormControl
              label="Hospital Name"
              type="text"
              name="hospitalName"
              className="col-12 col-sm-6 col-lg-3"
              required={true}
            />

            <FormControl
              label="Accreditation By"
              type="text"
              name="accreditationBy"
              className="col-12 col-sm-6 col-lg-3"
            />

            {type === "register" ? (
              <FormControl
                label="Registration No"
                type="text"
                name="registrationNo"
                className="col-12 col-sm-6 col-lg-3"
              />
            ) : null}

            <FormControl
              label="Beds Count"
              type="text"
              name="bedsCount"
              className="col-12 col-sm-6 col-lg-3 beds-count"
            />

            {type === "update" ? <Col xs={12} sm={6} lg={3}></Col> : null}
            {/* </Row> */}

            {/* <Row> */}
            <FormControl
              label="Contact Email"
              type="email"
              name="contactEmail"
              className="col-12 col-sm-6 col-lg-3"
            />

            <FormControl
              label="Contact No. (1)"
              type="text"
              name="contactNo1"
              className="col-12 col-sm-6 col-lg-3"
            />

            <FormControl
              label="Contact No. (2)"
              type="text"
              name="contactNo2"
              className="col-12 col-sm-6 col-lg-3 contact-no-2"
            />

            <Col xs={12} sm={6} lg={3}></Col>
            {/* </Row> */}

            {/* <Row> */}
            <FormControl
              label="Address"
              type="text"
              name="address"
              className="col-12 col-sm-6 col-lg-3"
            />

            <FormControl
              label="City"
              type="text"
              name="city"
              className="col-12 col-sm-6 col-lg-3"
            />

            <FormControl
              label="Country"
              type="text"
              name="country"
              className="col-12 col-sm-6 col-lg-3"
            />
          </Row>

          <Row className="justify-content-end mt-5">
            <Col xs={3}>
              <Button
                type="submit"
                disabled={isFormSaving}
                style={{
                  backgroundColor: "#ff0000",
                  color: "white",
                  border: "none",
                  minWidth: "60%",
                }}
              >
                {isFormSaving ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="mx-3"
                  />
                ) : (
                  "SAVE"
                )}
              </Button>
            </Col>
          </Row>

          {type === "register" ? (
            <Modal
              hospitalId={registeredHospitalId}
              show={isModalOpen}
              onHide={() => setIsModalOpen(false)}
            />
          ) : null}
        </Container>
      )}
    </Formik>
  );
}

export default FacilitiesForm;
