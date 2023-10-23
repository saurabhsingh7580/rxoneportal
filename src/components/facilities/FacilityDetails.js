import { useContext, useRef, useState } from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";
import CreatableSelect from "react-select/creatable";

import ModeContext from "../../context/mode-context";
import FormControl from "../form/FormControl";
import InputErrorMessage from "../kyc/InputErrorMessage";
import accreditationBodyOptions from "../../utils/accreditation-body-options";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";
import FieldInfo from "../form/FieldInfo";

function FacilityDetails(props) {
  const { type, isMainDataSaved, setIsShortNameValid, areDocsSubmitted } =
    props;

  const { mode } = useContext(ModeContext);

  const [accreditationBodyVal, setAccreditationBodyVal] = useState(null);

  const ref = useRef();

  const formikProps = useFormikContext();

  const handleShortNameBlur = async event => {
    const dataMessageSmall = document.querySelector(".resMessageSmall");
    dataMessageSmall?.remove();

    formikProps.setFieldTouched("facilityDetails.shortName");

    const shortName = event.target.value;

    if (shortName.trim() === "") return;
    if (shortName.trim().includes(" ")) return;

    try {
      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.get(
        RX_OPD_ENDPOINTS.HOSPITAL.CHECK_FACILITY_SHORT_NAME + "/" + shortName
      );

      if (res.status === 200) {
        const resMessageSmall = document.createElement("small");
        resMessageSmall.innerHTML = res.data.message;
        resMessageSmall.className =
          "d-block text-nowrap text-success text-end h-100 form-text resMessageSmall";
        ref.current.insertAdjacentElement("afterend", resMessageSmall);

        setIsShortNameValid(true);
      } else {
        // formikProps.setFieldError(
        //   "facilityDetails.shortName",
        //   "Entered Short Name is already in use. Please use another one."
        // );

        throw new Error(
          "Entered Short Name is already in use. Please use another one."
        );
      }
    } catch (error) {
      const resMessageSmall = document.createElement("small");
      resMessageSmall.innerHTML = error.message;
      resMessageSmall.className =
        "d-block text-nowrap text-danger text-end h-100 form-text resMessageSmall";
      ref.current.insertAdjacentElement("afterend", resMessageSmall);

      setIsShortNameValid(false);
    }
  };

  return (
    <>
      <FormControl
        info="Provide Facility or Brand name to be displayed on Care Portal & Doctor Portal"
        label="Facility Name"
        type="text"
        name="facilityDetails.hospitalName"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      {/* For accrediation, add select dropdown */}
      {type !== "update" && (
        <>
          <FormControl
            info="Provide  a  Short Name for Facility, Single word, without any comma or space"
            label="Facility Short Name"
            type="text"
            name="facilityDetails.shortName"
            disabled={isMainDataSaved || areDocsSubmitted}
            onBlur={handleShortNameBlur}
            reff={ref}
          />

          {/* <FormControl info=""
            label="Accreditation By"
            type="text"
            name="facilityDetails.accreditationBy"
            disabled={isMainDataSaved || areDocsSubmitted}
          /> */}
          <div className="row" style={{ position: "relative" }}>
            <label className="accreditationBodyLabel px-0 pe-md-3 col-10 col-md-4 d-flex justify-content-start justify-content-md-end align-items-center">
              Accreditation Body
            </label>

            <FieldInfo
              info="In case of Individual Doctor Clinic, provide the Accreditation Authority name which issued Doctor’s Registration"
              classes="d-inline-block d-md-none text-end align-items-end m-0 p-0 h-100 w-auto"
            />

            <Field
              name="facilityDetails.accreditationBy"
              className="col-12 col-md-8"
            >
              {({ field, form }) => (
                <CreatableSelect
                  {...field}
                  isDisabled={isMainDataSaved || areDocsSubmitted}
                  options={accreditationBodyOptions}
                  // className="w-100"
                  name="facilityDetails.accreditationBy"
                  className="col-12 col-md-8 px-0 h-50"
                  onChange={option => {
                    form.setFieldValue(
                      "facilityDetails.accreditationBy",
                      option,
                      true
                    );
                    setAccreditationBodyVal(option.value);
                  }}
                  styles={{
                    control: controlStyles => ({
                      ...controlStyles,
                      // alignItems: "center",
                      // height: "3rem",
                      padding: "0px",
                      // width: "100%",
                      border: "2px solid #b3c6e7",
                      borderRadius: "0",
                    }),
                  }}
                />
              )}
            </Field>

            <FieldInfo
              info="In case of Individual Doctor Clinic, provide the Accreditation Authority name which issued Doctor’s Registration"
              classes="d-none d-md-flex align-items-center m-0 p-0 h-100"
              styles={{ position: "absolute", right: "-50px", width: "auto" }}
            />
          </div>

          {/* {!accreditationBodyVal && ( */}
          <ErrorMessage
            component={InputErrorMessage}
            name="facilityDetails.accreditationBy"
          />
          {/* )} */}

          <FormControl
            info="In case of Individual Doctor Clinic, provide the Doctor’s Registration No."
            label="Registration No"
            type="text"
            name="facilityDetails.registrationNo"
            disabled={isMainDataSaved || areDocsSubmitted}
          />
        </>
      )}

      <FormControl
        info="(Optional) In case of hospital provide the beds count"
        label="Beds Count"
        type="text"
        name="facilityDetails.bedsCount"
        className="beds-count"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Email ID of the Facility Contact, this mail ID will be used for all communications"
        label="Contact Email"
        type="email"
        name="facilityDetails.contactEmail"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Phone no. of the Facility Contact, this Phone No. will be used for all important communications through SMS"
        label="Contact No. (1)"
        type="tel"
        name="facilityDetails.contactNo1"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      {type !== "update" && (
        <FormControl
          info="Second Phone no. of the Facility"
          label="Contact No. (2)"
          type="tel"
          name="facilityDetails.contactNo2"
          disabled={isMainDataSaved || areDocsSubmitted}
          className="facility-contact-2"
        />
      )}

      <FormControl
        info="Complete address of the Facility"
        label="Address"
        type="text"
        name="facilityDetails.address"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="City where Facility is located."
        label="City"
        type="text"
        name="facilityDetails.city"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      {type !== "update" && (
        <FormControl
          info="Country where Facility is located."
          label="Country"
          type="text"
          name="facilityDetails.country"
          disabled={isMainDataSaved || areDocsSubmitted}
        />
      )}
    </>
  );
}

export default FacilityDetails;
