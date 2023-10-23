import { useContext, useEffect, useRef, useState } from "react";
import { Field, useFormikContext } from "formik";
import Select from "react-select";

import AuthContext from "../../context/auth-context";
import FormControl from "../form/FormControl";
import Toast from "../ui/Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";
import FieldInfo from "../form/FieldInfo";

const idOptions = [
  { label: "PAN", value: "pan_card" },
  { label: "Voter ID", value: "voter_id" },
  { label: "Aadhar", value: "aadhar_value" },
];

function DocsVerification(props) {
  const { areDocsSubmitted } = props;

  const { logout } = useContext(AuthContext);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [uploadingFile, setUploadingFile] = useState("");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);

  const ref = useRef();

  const formik = useFormikContext();

  const businessType = formik.values.business.business_type.value;

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  const handleFileChange = async (fileInputName, file, fieldProps) => {
    setUploadingFile(fileInputName);
    setIsFileUploading(true);

    try {
      if (!file) {
        throw new Error("Please upload a file.");
      }
      const userToken = localStorage.getItem("usr_token");
      const fileFormData = new FormData();
      let endPoint;

      fileFormData.append(fileInputName.split(".")[1], file);

      switch (fileInputName) {
        case "docsVerification.business_pan_card":
          fieldProps.form.setFieldValue(
            "docsVerification.business_pan_card",
            file
          );
          endPoint = RX_ONE_ENDPOINTS.USER.KYC_DOCS_VERIFICATION_BUSINESS_PAN;
          break;

        case "docsVerification.incorp_certificate":
          fieldProps.form.setFieldValue(
            "docsVerification.incorp_certificate",
            file
          );
          endPoint = RX_ONE_ENDPOINTS.USER.KYC_DOCS_VERIFICATION_INCORP_CERTI;
          break;

        case "docsVerification.authorized_sign_id":
          if (typeof formik.values.docsVerification.sign_id_type !== "object") {
            fieldProps.form.setFieldValue(
              "docsVerification.authorized_sign_id",
              ""
            );
            ref.current.value = "";

            throw new Error(
              "Please select one of the Signatory ID Type before uploading Signatory ID."
            );
          }

          fieldProps.form.setFieldValue(
            "docsVerification.authorized_sign_id",
            file
          );
          endPoint =
            RX_ONE_ENDPOINTS.USER.KYC_DOCS_VERIFICATION_SIGNATORY_ID +
            "/" +
            formik.values.docsVerification.sign_id_type.value;
          break;
      }

      rxOneApi.setUserSecretAuthHeaders();
      rxOneApi.setMultipartHeaders();
      const res = await rxOneApi.put(
        endPoint + "/" + userToken,
        fileFormData,
        true,
        true
      );

      if (res) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(res.data.message);
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      if (error?.status === 401) {
        if (!document.querySelector(".toast-modal")) {
          setShowToast(true);
          setToastType("error");
          setToastMessage("Invalid session. Please login again.");
          setShouldLogout(true);
        }
      } else {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error?.error?.message || error?.message);
      }
    } finally {
      setIsFileUploading(false);
    }
  };

  return (
    <>
      <FormControl
        info="Upload Business PAN Card or Facility Owner PAN Card"
        disabled={areDocsSubmitted}
        label={`${
          businessType === "individual" ? "" : "Business Pan Card or "
        }Facility Owner Pan Card`}
        type="file"
        name="docsVerification.business_pan_card"
        onChange={(event, fieldProps) =>
          handleFileChange(
            "docsVerification.business_pan_card",
            event.currentTarget.files[0],
            fieldProps
          )
        }
        isLoading={
          isFileUploading &&
          uploadingFile === "docsVerification.business_pan_card"
        }
      />

      <FormControl
        info="Upload Certificate of Incorporation (If Applicable)"
        disabled={areDocsSubmitted}
        label={`${
          businessType === "individual"
            ? "Doctor's Registration Certificate"
            : "Certificate of Incorporation /Registration Certificate"
        }`}
        type="file"
        name="docsVerification.incorp_certificate"
        onChange={(event, fieldProps) =>
          handleFileChange(
            "docsVerification.incorp_certificate",
            event.currentTarget.files[0],
            fieldProps
          )
        }
        isLoading={
          isFileUploading &&
          uploadingFile === "docsVerification.incorp_certificate"
        }
      />

      {/* <FormControl
        label="Signatory ID Card"
        type="file"
        name="docs.signatoryIdCard"
      /> */}

      <div className="my-1 row" style={{ position: "relative" }}>
        <label className="accreditationBodyLabel px-0 pe-md-3 col-11 col-md-4 d-flex text-end justify-content-start justify-content-md-end align-items-center">
          {`${
            businessType === "individual"
              ? "Owner ID Card Type"
              : "Signatory ID Card"
          }`}
        </label>

        <FieldInfo
          info="Select type of ID for Business/Facility Owner"
          classes="d-inline-block d-md-none text-end align-items-end m-0 p-0 h-100 w-auto"
        />

        <Field name="docsVerification.sign_id_type" className="col-12 col-md-8">
          {({ field, form }) => (
            <Select
              {...field}
              isDisabled={areDocsSubmitted}
              options={idOptions}
              name="docsVerification.sign_id_type"
              className="col-12 col-md-8 px-0 h-50"
              onChange={option => {
                form.setFieldValue(
                  "docsVerification.sign_id_type",
                  option,
                  true
                );
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
          info="Select type of ID for Business/Facility Owner"
          classes="d-none d-md-flex align-items-center m-0 p-0 h-100"
          styles={{ position: "absolute", right: "-50px", width: "auto" }}
        />
      </div>

      <FormControl
        info="Upload Business/Facility Owner ID"
        disabled={areDocsSubmitted}
        label={`${
          businessType === "individual"
            ? "Upload Owner ID"
            : "Upload Signatory ID"
        }`}
        type="file"
        name="docsVerification.authorized_sign_id"
        onChange={(event, fieldProps) =>
          handleFileChange(
            "docsVerification.authorized_sign_id",
            event.currentTarget.files[0],
            fieldProps
          )
        }
        isLoading={
          isFileUploading &&
          uploadingFile === "docsVerification.authorized_sign_id"
        }
        reff={ref}
      />

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
          // autohide={true}
          // autohideDelay={3000}
        >
          {toastMessage}
        </Toast>
      )}
    </>
  );
}

export default DocsVerification;
