import { useContext, useState } from "react";
import { Field, useFormikContext } from "formik";
import Select from "react-select";
import { Spinner } from "react-bootstrap";

import ModeContext from "../../context/mode-context";
import FormControl from "../form/FormControl";
import RmpDataModal from "./RmpDataModal";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";
import FieldInfo from "../form/FieldInfo";

const discountOptions = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

function DoctorDetails(props) {
  const { isMainDataSaved, areDocsSubmitted } = props;

  const formikProps = useFormikContext();

  const { mode } = useContext(ModeContext);

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isRmpLoading, setIsRmpLoading] = useState(false);
  const [showRmpDataModal, setShowRmpDataModal] = useState(false);
  const [rmpDetails, setRmpDetails] = useState([]);

  const handleRmpSearch = async () => {
    const firstName = formikProps.values.doctorDetails.firstName;
    const lastName = formikProps.values.doctorDetails.lastName;

    try {
      if (firstName === "" || lastName === "") {
        throw new Error(
          "Please enter First Name and Last Name for RMP Search."
        );
      }

      setIsRmpLoading(true);

      const userKeys = localStorage.getItem("usr_keys");

      if (userKeys) {
        const userModeKey = JSON.parse(userKeys)[mode];

        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.RMP_SEARCH + `/${firstName}/${lastName}`
        );

        if (res) {
          setRmpDetails(res.data["RMP Details"]);
          setShowRmpDataModal(true);
        } else {
          throw new Error("Something went wrong. Please try later!.");
        }
      } else {
        throw new Error("User not logged in. Please login to proceed.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setIsRmpLoading(false);
    }
  };

  return (
    <>
      <FormControl
        info="Enter Doctor's First Name"
        label="First Name"
        type="text"
        name="doctorDetails.firstName"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Doctor's Last Name"
        label="Last Name"
        type="text"
        name="doctorDetails.lastName"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <div className="row">
        <div className="col-12 col-md-4"></div>

        <Button
          disabled={isRmpLoading || isMainDataSaved || areDocsSubmitted}
          className="col-12 col-md-8 w-auto"
          onClick={handleRmpSearch}
        >
          {isRmpLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mx-3"
            />
          ) : (
            "RMP Search"
          )}
        </Button>
      </div>

      <FormControl
        info="Enter Email id to be used for Doctor portal login"
        label="Email"
        type="email"
        name="doctorDetails.email"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Phone No. to be used for Doctor portal login"
        label="Phone No."
        type="tel"
        name="doctorDetails.phoneNo"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Registered Medical Professional (RMP) No."
        label="RMP No."
        type="text"
        name="doctorDetails.rmpNo"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Registration Year"
        label="Reg. Year"
        type="text"
        name="doctorDetails.regYear"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Doctor’s Birth Year"
        label="Birth Year"
        type="text"
        name="doctorDetails.birthYear"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Doctor’s latest qualification/degree Year"
        label="Degree Year"
        type="text"
        name="doctorDetails.degreeYear"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Doctor’s Qualifications. Separated by Comma “,”"
        label="Qualification"
        type="text"
        name="doctorDetails.qualification"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Doctor’s Specialities. Separated by Comma “,”"
        label="Speciality"
        type="text"
        name="doctorDetails.speciality"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      <FormControl
        info="Enter Doctor’s Consultation Charges (Online or In-Person)"
        label="Consultation Fees (INR)"
        type="text"
        name="doctorDetails.consultCharges"
        disabled={isMainDataSaved || areDocsSubmitted}
      />

      {/* <FormControl
        info="We recommend 5-20% Online Payment discount, to make paying in advance attractive."
        label="Online Discount (5% - 20%)"
        type="text"
        name="doctorDetails.onlineDiscount"
        disabled={isMainDataSaved || areDocsSubmitted}
      /> */}

      <div
        className="my-1 row align-items-center"
        style={{ position: "relative" }}
      >
        <label className="accreditationBodyLabel px-0 pe-md-3 col-11 col-md-4 d-flex text-end justify-content-start justify-content-md-end align-items-center">
          {/* {`${
            businessType === "individual"
              ? "Owner ID Card Type"
              : "Signatory ID Card"
          }`} */}
          Online Booking Discount (Up to 20%)
        </label>

        <FieldInfo
          info="We recommend 5-20% Online Payment discount, to make paying in advance attractive."
          classes="d-inline-block d-md-none text-end align-items-end m-0 p-0 h-100 w-auto"
        />
        <Field name="doctorDetails.onlineDiscount" className="col-12 col-md-8">
          {({ field, form }) => (
            <Select
              {...field}
              isDisabled={isMainDataSaved || areDocsSubmitted}
              options={discountOptions.map(op => ({
                label: op.toString(),
                value: op.toString(),
              }))}
              name="doctorDetails.onlineDiscount"
              className="col-12 col-md-8 px-0 h-50"
              onChange={option => {
                form.setFieldValue(
                  "doctorDetails.onlineDiscount",
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
                menuList: menustyles => ({
                  ...menustyles,
                  height: "100px",
                }),
              }}
            />
          )}
        </Field>

        <FieldInfo
          info="We recommend 5-20% Online Payment discount, to make paying in advance attractive."
          classes="d-none d-md-flex align-items-center m-0 p-0 h-100"
          styles={{ position: "absolute", right: "-50px", width: "auto" }}
        />
      </div>

      {showRmpDataModal && (
        <RmpDataModal
          rmpDetails={rmpDetails}
          show={showRmpDataModal}
          onHide={() => setShowRmpDataModal(false)}
        />
      )}

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
          autohide={true}
          autohideDelay={3000}
        >
          {toastMessage}
        </Toast>
      )}
    </>
  );
}

export default DoctorDetails;
