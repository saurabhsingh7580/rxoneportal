import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import Form from "../form/Form";
import FacilityDetails from "./FacilityDetails";
import RegistrationDocs from "./RegistrationDocs";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const validationSchema = Yup.object().shape({
  facilityDetails: Yup.object().shape({
    hospitalName: Yup.string().required("Facility Name is required"),
    shortName: Yup.string()
      .trim()
      .matches(/^\S*$/, "Short Name cannot contain whitespaces")
      .required("Facility Short Name is required"),
    accreditationBy: Yup.object().required("Accreditation Body is required"),
    registrationNo: Yup.string().required("Registration No. is required"),
    bedsCount: Yup.string(),
    contactEmail: Yup.string()
      .required("Contact Email is required")
      .email("Invalid email format"),
    contactNo1: Yup.string()
      .required("Contact Number (1) is required")
      .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
      .label("Contact Number (1)"),
    contactNo2: Yup.string()
      .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
      .label("Contact Number (2)"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
  }),

  uploadDocs: Yup.object().shape({
    registrationCertificate: Yup.mixed().required(
      "Registration Certificate is required"
    ),
    hospitalLogo: Yup.mixed().required("Hospital Logo is required"),
  }),
});

function RegisterFacility(props) {
  const { mode } = useContext(ModeContext);

  const [formValues, setFormValues] = useState(null);
  const [isShortNameValid, setIsShortNameValid] = useState(false);
  const [formNavItems, setFormNavItems] = useState([
    {
      label: "Facility Details",
      identifier: "facilityDetails",
      isActive: true,
      // element: <FacilityDetails />,
      element: FacilityDetails,
      elementProps: {
        setIsShortNameValid: setIsShortNameValid,
      },
      elementWrapperClassName: "min-w-50",
      formHeading:
        "Please provide the details of the Facility (Hospital/Clinic) to be registered.",
    },
    {
      label: "Upload Proofs & Submit",
      identifier: "uploadDocs",
      isActive: false,
      // element: <RegistrationDocs />,
      element: RegistrationDocs,
      elementWrapperClassName: "min-w-50",
      formHeading:
        "Please upload the Facility (or Doctor's) Registration Certificate and Logo (Brand).",
    },
  ]);
  const [hospitalId, setHospitalId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isEditModeOn, setIsEditModeOn] = useState();
  const [errorOccurred, setErrorOccurred] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("edit")) {
      const toBeEditedHospId = searchParams.get("hosp_id");

      const fetchHospitalData = async () => {
        const userKeys = localStorage.getItem("usr_keys");
        const userModeKey = JSON.parse(userKeys)[mode];

        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        try {
          rxOpdApi.setAuthHeaders(key, secret);
          const res = await rxOpdApi.get(
            RX_OPD_ENDPOINTS.HOSPITAL.FETCH_A_HOSPITAL + "/" + toBeEditedHospId
          );

          if (res) {
            const toBeEditedHospData = res.data;

            setFormValues({
              facilityDetails: {
                hospitalName: toBeEditedHospData.hosp_name,
                shortName: toBeEditedHospData.short_name,
                accreditationBy: {
                  label: toBeEditedHospData.hosp_accreditation_by,
                  value: toBeEditedHospData.hosp_accreditation_by,
                },
                registrationNo: toBeEditedHospData.hosp_registration_no,
                bedsCount: toBeEditedHospData.beds_count,
                contactEmail: toBeEditedHospData.email,
                contactNo1: toBeEditedHospData.phone1.replace("+91", ""),
                contactNo2: toBeEditedHospData.phone2
                  ? toBeEditedHospData.phone2.replace("+91", "")
                  : "",
                address: toBeEditedHospData.address,
                city: toBeEditedHospData.city,
                country: toBeEditedHospData.country
                  ? toBeEditedHospData.country
                  : "India",
              },

              uploadDocs: {
                registrationCertificate: "",
                hospitalLogo: "",
              },
            });
            setHospitalId(toBeEditedHospId);
            setIsEditModeOn(true);
          } else {
            throw new Error("Something went wrong. Please try later.");
          }
        } catch (error) {
          setShowToast(true);
          setToastType("error");
          setToastMessage(error.message);
          setErrorOccurred(true);
        } finally {
          setIsLoading(false);
        }
      };

      fetchHospitalData();
    } else {
      setFormValues({
        facilityDetails: {
          hospitalName: "",
          shortName: "",
          accreditationBy: "",
          registrationNo: "",
          bedsCount: "0",
          contactEmail: "",
          contactNo1: "",
          contactNo2: "",
          address: "",
          city: "",
          country: "",
        },

        uploadDocs: {
          registrationCertificate: "",
          hospitalLogo: "",
        },
      });
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!showToast && errorOccurred) {
      navigate("/app/facilities/OPD", { replace: true });
    }
  }, [showToast, errorOccurred]);

  const handleSaveBtnClick = async (
    values,
    currentItemNumber,
    setFieldError
  ) => {
    if (!isShortNameValid) {
      setFieldError(
        "facilityDetails.shortName",
        "Entered Short Name is already in use. Please use another one."
      );

      const dataMessageSmall = document.querySelector(".resMessageSmall");
      dataMessageSmall?.remove();

      return {
        success: false,
        message:
          "Entered Short Name is already in use. Please use another one.",
      };
    }

    const userKeys = localStorage.getItem("usr_keys");
    const userModeKey = JSON.parse(userKeys)[mode];

    const key = userModeKey[`${mode}_key`];
    const secret = userModeKey[`${mode}_secret`];

    try {
      const body = {
        hosp_name: values.hospitalName,
        short_name: values.shortName,
        hosp_accreditation_by: values.accreditationBy.value.toUpperCase(),
        hosp_registration_no: values.registrationNo,
        email: values.contactEmail,
        country: values.country,
        city: values.city,
        beds_count: values.bedsCount !== "" ? values.bedsCount : "0",
        phone1: "+91" + values.contactNo1,
        phone2: values.contactNo2 ? "+91" + values.contactNo2 : "",
        address: values.address,
      };

      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.REGISTER_HOSPITAL,
        body
      );

      if (res) {
        setHospitalId(res.data.hos_id);

        return { success: true, message: res.data.message };
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleSubmit = async (values) => {
    const userKeys = localStorage.getItem("usr_keys");
    const userModeKey = JSON.parse(userKeys)[mode];

    const key = userModeKey[`${mode}_key`];
    const secret = userModeKey[`${mode}_secret`];

    try {
      const hospitalRegDocsFormData = new FormData();
      hospitalRegDocsFormData.append(
        "hospital_logo",
        values.uploadDocs.hospitalLogo
      );
      hospitalRegDocsFormData.append(
        "registration_certificate",
        values.uploadDocs.registrationCertificate
      );

      rxOpdApi.setAuthHeaders(key, secret);
      rxOpdApi.setMultipartHeaders();
      const res = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.UPLOAD_HOSPITAL_DOCS + "/" + hospitalId,
        hospitalRegDocsFormData,
        true
      );

      if (res) {
        return { success: true, message: res.data.message };
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <>
      <Form
        type="Register Facility"
        initialValues={formValues}
        validationSchema={validationSchema}
        formNavItems={formNavItems}
        setFormNavItems={setFormNavItems}
        onSaveBtnClick={handleSaveBtnClick}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        areDocsSubmitted={isEditModeOn}
        redirectUrl="/app/facilities/OPD"
      />

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

export default RegisterFacility;
