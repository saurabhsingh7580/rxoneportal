import { useContext, useEffect, useState } from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Spinner from "react-bootstrap/Spinner";

import HospitalsContext from "../../../context/hospitals-context";
import ModeContext from "../../../context/mode-context";
import AppointmentsFormContext from "../../../context/appointments-form";
import FormControl from "../../form/FormControl";
import InputErrorMessage from "../../kyc/InputErrorMessage";
import Button from "../../ui/Button";
import Toast from "../../ui/Toast";
import { rxOpdApi } from "../../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../../utils/api/apiEndPoints";

const profileTypes = [
  { label: "Self", value: "self" },
  { label: "Family", value: "family" },
];

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

// const bloodGroupOptions=[
//   {label:"",value:""},
//   {label:"",value:""},
//   {label:"",value:""},
//   {label:"",value:""},
//   {label:"",value:""},
//   {label:"",value:""},
//   {label:"",value:""},
//   {label:"",value:""},
// ]

function PatientProfile(props) {
  const {
    addToExistingProfile,
    contactNo,
    onHide,
    setChangeStep,
    setJumpToStep,
  } = props;

  const { mode } = useContext(ModeContext);
  const { currentHospital } = useContext(HospitalsContext);
  const { setNewProfileAdded } = useContext(AppointmentsFormContext);

  const [isRegistering, setIsRegistering] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [profileCreated, setProfileCreated] = useState(false);

  useEffect(() => {
    if (!showToast && profileCreated) {
      onHide();
      setChangeStep(true);
      setJumpToStep(2);
    }
  }, [showToast, profileCreated, onHide]);

  const fields = [
    "profileType",
    "name",
    "gender",
    "email",
    "dob",
    "address",
    "city",
    "state",
    "country",
    "pinCode",
  ];
  const errors = [];

  const formikProps = useFormikContext();

  const checkValidation = async field => {
    const error = await formikProps.setFieldTouched(`patientProfile.${field}`);

    if (Object.keys(error).length > 0) errors.push(error);
  };

  const handleRegister = async () => {
    setIsRegistering(true);

    try {
      for (const field of fields) {
        await checkValidation(field);
      }

      if (errors.length > 0) return;

      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      const values = formikProps.values.patientProfile;
      const birth_date =
        values.dob.getFullYear() +
        "-" +
        (+values.dob.getMonth() + 1) +
        "-" +
        values.dob.getDate();

      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.post(
        (!addToExistingProfile
          ? RX_OPD_ENDPOINTS.HOSPITAL.OPD.CREATE_PATIENT_PROFILE
          : RX_OPD_ENDPOINTS.HOSPITAL.OPD.ADD_TO_EXSISTING_PROFILE) +
          "/" +
          currentHospital.hos_id +
          "/+91" +
          contactNo,
        {
          email: values.email,
          name: values.name,
          gender: values.gender.value,
          birth_date: birth_date,
          address: values.address ? values.address : "",
          city: values.city ? values.city : "",
          state: values.state ? values.state : "",
          pincode: values.pinCode ? values.pinCode : "",
          country: values.country ? values.country : "",
        }
      );

      if (res) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(res.data.message);
        setProfileCreated(true);

        // if (addToExistingProfile) {
        setNewProfileAdded(true);
        // }
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <div className="my-1 row align-items-center w-100 mx-0">
        <div className="patient-profile-ele px-0 w-100">
          <label className="accreditationBodyLabel px-0 pe-md-3 col-11 col-md-12 w-100">
            {/* d-flex text-end justify-content-start justify-content-md-end align-items-center"> */}
            {/* {`${
            businessType === "individual"
              ? "Owner ID Card Type"
              : "Signatory ID Card"
          }`} */}
            Profile Type
          </label>

          {/* <input className="w-100" /> */}

          <Field name="patientProfile.profileType" className="col-12 col-md-12">
            {({ field, form }) => (
              <Select
                {...field}
                // isDisabled={isMainDataSaved || areDocsSubmitted}
                options={profileTypes}
                name="patientProfile.profileType"
                className="col-12 col-md-12 px-0"
                onChange={option => {
                  form.setFieldValue(
                    "patientProfile.profileType",
                    option,
                    true
                  );
                }}
                styles={{
                  control: controlStyles => ({
                    ...controlStyles,
                    border: "2px solid #b3c6e7",
                    borderRadius: "0",
                    padding: "0",
                    margin: "0",
                  }),
                  // menuList: menustyles => ({
                  //   ...menustyles,
                  //   height: "100px",
                  // }),
                }}
              />
            )}
          </Field>
        </div>
      </div>

      <ErrorMessage
        component={InputErrorMessage}
        name="patientProfile.profileType"
      />

      <FormControl
        label="Name"
        type="text"
        name="patientProfile.name"
        labelColClass="col-12 justify-content-start mb-0"
        fieldColClass="col-12 w-100"
        className="mx-0"
        // disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        label="Email"
        type="email"
        name="patientProfile.email"
        labelColClass="col-12 justify-content-start mb-0"
        fieldColClass="col-12 w-100"
        className="mx-0"
        // disabled={isMainDataSaved || areDocsSubmitted}
      />

      <div className="my-1 row align-items-center w-100 mx-0">
        <div className="px-0">
          <label className="accreditationBodyLabel px-0 pe-md-3 col-11 col-md-12 w-100">
            {/* d-flex text-end justify-content-start justify-content-md-end align-items-center"> */}
            {/* {`${
            businessType === "individual"
              ? "Owner ID Card Type"
              : "Signatory ID Card"
          }`} */}
            Gender
          </label>

          {/* <input className="w-100" /> */}

          <Field name="patientProfile.gender" className="col-12 col-md-12">
            {({ field, form }) => (
              <Select
                {...field}
                // isDisabled={isMainDataSaved || areDocsSubmitted}
                options={genderOptions}
                name="patientProfile.gender"
                className="col-12 col-md-12 px-0"
                onChange={option => {
                  form.setFieldValue("patientProfile.gender", option, true);
                }}
                styles={{
                  control: controlStyles => ({
                    ...controlStyles,
                    border: "2px solid #b3c6e7",
                    borderRadius: "0",
                    padding: "0",
                    margin: "0",
                  }),
                  // menuList: menustyles => ({
                  //   ...menustyles,
                  //   height: "100px",
                  // }),
                }}
              />
            )}
          </Field>
        </div>
      </div>

      <ErrorMessage
        component={InputErrorMessage}
        name="patientProfile.gender"
      />

      <label className="ms--12 mt-1 mx-0">Date of Birth</label>

      <Field name="patientProfile.dob">
        {({ field, form }) => (
          <DatePicker
            {...field}
            id="dob"
            wrapperClassName="col-12 px-0 py-2 py-sm-0 mb-1 mx-0"
            className="mx-0"
            placeholderText="Select Date"
            selected={field.value}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            onChange={val => form.setFieldValue("patientProfile.dob", val)}
          />
        )}
      </Field>

      <ErrorMessage component={InputErrorMessage} name="patientProfile.dob" />

      <FormControl
        label="Address"
        type="text"
        name="patientProfile.address"
        labelColClass="col-12 justify-content-start mb-0 not-req"
        fieldColClass="col-12 w-100"
        className="mx-0"
        // disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        label="City"
        type="text"
        name="patientProfile.city"
        labelColClass="col-12 justify-content-start mb-0 not-req"
        fieldColClass="col-12 w-100"
        className="mx-0"
        // disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        label="State"
        type="text"
        name="patientProfile.state"
        labelColClass="col-12 justify-content-start mb-0 not-req"
        fieldColClass="col-12 w-100"
        className="mx-0"
        // disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        label="Pin Code"
        type="text"
        name="patientProfile.pinCode"
        labelColClass="col-12 justify-content-start mb-0 not-req"
        fieldColClass="col-12 w-100"
        className="mx-0"
        // disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        label="Country"
        type="text"
        name="patientProfile.country"
        labelColClass="col-12 justify-content-start mb-0 not-req"
        fieldColClass="col-12 w-100"
        className="mx-0"
        // disabled={isMainDataSaved || areDocsSubmitted}
      />

      <Button
        style={{ margin: "12px 0", width: "100%" }}
        onClick={handleRegister}
        disabled={isRegistering}
      >
        {isRegistering ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mx-3"
          />
        ) : (
          "Register"
        )}
      </Button>

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

export default PatientProfile;
