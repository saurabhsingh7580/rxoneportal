import { useState } from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";
import CreatableSelect from "react-select/creatable";
import { Container } from "react-bootstrap";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import FormControl from "../form/FormControl";
import InputErrorMessage from "../kyc/InputErrorMessage";
import accreditationBodyOptions from "../../utils/accreditation-body-options";
import FieldInfo from "../form/FieldInfo";

function RegistrationDocs(props) {
  const [accreditationBodyVal, setAccreditationBodyVal] = useState(null);

  const formikProps = useFormikContext();

  return (
    <Container>
      <div className="row" style={{ position: "relative" }}>
        <label className="accreditationBodyLabel px-0 pe-md-3 col-10 col-md-4 d-flex justify-content-start text-end justify-content-md-end align-items-center">
          Accreditation Body
        </label>

        <FieldInfo
          info="Select the Accreditation Body for Doctor's Registration. If you can not find the Accreditation Body, you can type the abbreviation."
          classes="d-inline-block d-md-none text-end align-items-end m-0 p-0 h-100 w-auto"
        />

        <Field name="uploadDocs.accreditationBody" className="col-12 col-md-8">
          {({ field, form }) => (
            <CreatableSelect
              {...field}
              options={accreditationBodyOptions}
              // className="w-100"
              name="uploadDocs.accreditationBody"
              className="col-12 col-md-8 px-0 h-50"
              onChange={option => {
                form.setFieldValue(
                  "uploadDocs.accreditationBody",
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
          info="Select the Accreditation Body for Doctor's Registration. If you can not find the Accreditation Body, you can type the abbreviation."
          classes="d-none d-md-flex align-items-center m-0 p-0 h-100"
          styles={{ position: "absolute", right: "-50px", width: "auto" }}
        />
      </div>

      {!accreditationBodyVal && (
        <ErrorMessage
          component={InputErrorMessage}
          name="uploadDocs.accreditationBody"
        />
      )}

      <FormControl
        info="Upload Doctor's registration certificate"
        label="RMP Registration Certificate"
        type="file"
        name="uploadDocs.rmpRegCertificate"

        // className="d-flex flex-column fs-5"
      />

      <FormControl
        info="Upload clear profile picture of Doctor. This will be used for Doctor's appointment booking."
        label="Doctor's Profile Pic"
        type="file"
        name="uploadDocs.docProfilePic"

        // className="d-flex flex-column fs-5"
      />
    </Container>
  );
}

export default RegistrationDocs;
