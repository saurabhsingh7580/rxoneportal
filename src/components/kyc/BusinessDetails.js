import { Field, useFormikContext } from "formik";
import Select from "react-select";

import FieldInfo from "../form/FieldInfo";
import FormControl from "../form/FormControl";

const businessTypeOptions = [
  { label: "Individual", value: "individual" },
  { label: "Registered Medical Facility", value: "medical_facility" },
  { label: "Registered Pharmacy", value: "pharmacy" },
  { label: "Registered Test Lab", value: "test_lab" },
];

function BusinessDetails(props) {
  const { areDocsSubmitted, setBusinessType } = props;

  const formikKycContext = useFormikContext();

  const businessType = formikKycContext.values.business.business_type.value;

  return (
    <>
      <div className="my-1 row" style={{ position: "relative" }}>
        <label className="accreditationBodyLabel px-0 pe-md-3 col-11 col-md-4 d-flex text-end justify-content-start justify-content-md-end align-items-center">
          Business Type
        </label>

        <FieldInfo
          info="Select applicable business type"
          classes="d-inline-block d-md-none text-end align-items-end m-0 p-0 h-100 w-auto"
        />

        <Field name="business.business_type" className="col-12 col-md-8">
          {({ field, form }) => (
            <Select
              {...field}
              isDisabled={areDocsSubmitted}
              options={businessTypeOptions}
              name="business.business_type"
              className="col-12 col-md-8 px-0 h-50"
              onChange={option => {
                form.setFieldValue("business.business_type", option, true);

                form.setErrors({});
                form.setTouched({}, false);

                if (JSON.stringify(field.value) !== JSON.stringify(option)) {
                  setBusinessType(option);
                }
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
          info="Select applicable business type"
          classes="d-none d-md-flex align-items-center m-0 p-0 h-100"
          styles={{ position: "absolute", right: "-50px", width: "auto" }}
        />
      </div>

      <FormControl
        info={`Enter ${
          businessType === "individual" ? "" : "Business or "
        }Facility (Hospital/Clinic/Pharmacy/Lab) Name`}
        label={`${
          businessType === "individual" ? "" : "Business/"
        }Facility Name`}
        type="text"
        name="business.name"
        disabled={areDocsSubmitted}
      />

      <FormControl
        info="Enter Business/Facility/Owner PAN No"
        label={`${
          businessType === "individual" ? "Owner" : "Business"
        } PAN No.`}
        type="text"
        name="business.businessPanNo"
        disabled={areDocsSubmitted}
      />

      {businessType !== "individual" && (
        <>
          <FormControl
            info="Enter CIN No. (If registered business)"
            label="CIN"
            type="text"
            name="business.cin"
            disabled={areDocsSubmitted}
            className="cin"
          />

          {/* <FormControl
            info="Enter applicable business type like Individual, Pvt. Ltd, LLP etc."
            label="Facility Type"
            type="text"
            name="business.type"
            disabled={areDocsSubmitted}
          /> */}

          <FormControl
            info="Enter name of Authorized Signatory or Business Owner"
            label="Authorizes Signatory"
            type="text"
            name="business.authorizedSignatory"
            disabled={areDocsSubmitted}
          />

          <FormControl
            info="Enter PAN no. of Authorized Signatory or Business Owner"
            label="Signatory PAN No."
            type="text"
            name="business.signatoryPanNo"
            disabled={areDocsSubmitted}
          />
        </>
      )}

      <FormControl
        info="Enter name of Authorized Signatory or Business Owner"
        label="Owner Name"
        type="text"
        name="business.ownerName"
        disabled={areDocsSubmitted}
      />

      <FormControl
        info="Enter Complete Business or Facility Address"
        label={`${
          businessType === "individual" ? "Contact" : "Business"
        } Address`}
        type="text"
        name="business.businessAddress"
        disabled={areDocsSubmitted}
      />

      <FormControl
        info="Enter Pin code for Business or Facility Address"
        label="Pin Code"
        type="text"
        name="business.pinCode"
        disabled={areDocsSubmitted}
      />
    </>
  );
}

export default BusinessDetails;
