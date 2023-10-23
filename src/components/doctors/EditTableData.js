import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import Spinner from "react-bootstrap/Spinner";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

import ModeContext from "../../context/mode-context";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";
import { Field } from "formik";

const discountOptions = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

function EditTableData(props) {
  const {
    type,
    dataPrefix = "",
    data,
    dataPostfix = "",
    doctorId,
    hospitalId,
  } = props;

  const { mode } = useContext(ModeContext);
  const [fieldData, setFieldData] = useState(data);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldSendReq, setShouldSendReq] = useState(true);
  const [isValueBeingSubmitted, setIsValueBeingSubmitted] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (!fieldData) setErrorMessage("This field is required.");
    else setErrorMessage("");

    if (fieldData === data) setShouldSendReq(false);
    else setShouldSendReq(true);
  }, [fieldData, data]);

  const handleEdit = () => {
    setIsEditModeOn(true);
  };

  const handleValueSubmit = async () => {
    if (!fieldData || isValueBeingSubmitted) {
      return;
    }

    if (shouldSendReq) {
      const userKeys = localStorage.getItem("usr_keys");

      if (userKeys) {
        setIsValueBeingSubmitted(true);

        const userModeKey = JSON.parse(userKeys)[mode];
        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        try {
          const endPoint =
            type === "consult-charges"
              ? RX_OPD_ENDPOINTS.HOSPITAL.UPDATE_DOCTOR_CONSULT_CHARGES
              : RX_OPD_ENDPOINTS.HOSPITAL.UPDATE_DOCTOR_ONLINE_DISCOUNT;

          const body =
            type === "consult-charges"
              ? { consult_charge: fieldData, currency: dataPrefix }
              : { online_discount: fieldData };

          rxOpdApi.setAuthHeaders(key, secret);
          const res = await rxOpdApi.put(
            endPoint + "/" + hospitalId + "/" + doctorId,
            body
          );

          if (res) {
            setShowToast(true);
            setToastType("success");
            setToastMessage(res.data.message);
          } else {
            setFieldData(data);
            throw new Error("Something went wrong. Please try later.");
          }
        } catch (error) {
          setFieldData(data);
          setShowToast(true);
          setToastType("error");
          setToastMessage(error.message);

          console.log("Error in submitting editted value.\nERROR:", error);
        } finally {
          setIsValueBeingSubmitted(false);
          setIsEditModeOn(false);
        }
      } else {
        setFieldData(data);
        console.log("USER IS NOT LOOGED IN");
      }
    } else {
      setIsEditModeOn(false);
    }
  };

  return (
    <>
      <p
        style={{
          minHeight: "60px",
          margin: "0",
          width: "80px",
        }}
      >
        {dataPrefix + " "}

        {isEditModeOn ? (
          <>
            {type !== "discount" ? (
              <input
                type="text"
                disabled={isValueBeingSubmitted}
                name={type}
                value={fieldData}
                onChange={event => setFieldData(event.target.value)}
                className="mx-3"
                style={{ width: "40%" }}
              />
            ) : (
              <Select
                menuPlacement="bottom"
                menuPosition="fixed"
                defaultValue={{
                  label: fieldData.toString(),
                  value: fieldData.toString(),
                }}
                options={discountOptions.map(op => ({
                  label: op.toString(),
                  value: op.toString(),
                }))}
                onChange={op => setFieldData(op.value)}
                styles={{
                  control: controlStyles => ({
                    ...controlStyles,
                    height: "34.4px",
                    padding: "0px",
                    border: "2px solid #b3c6e7",
                    borderRadius: "0",
                    width: "80px",
                  }),
                  menuList: menustyles => ({
                    ...menustyles,
                    height: "100px",
                  }),
                  container: containerStyles => ({
                    ...containerStyles,
                    width: "80px",
                  }),
                  indicatorsContainer: indicatorsContainerStyles => ({
                    ...indicatorsContainerStyles,
                    padding: "0px",
                  }),
                  dropdownIndicator: dropdownIndicatorStyles => ({
                    ...dropdownIndicatorStyles,
                    padding: "0",
                  }),
                  indicatorSeparator: indicatorSeparatorStyles => ({
                    ...indicatorSeparatorStyles,
                    display: "none",
                  }),
                  valueContainer: valueContainerStyles => ({
                    ...valueContainerStyles,
                    padding: "0 4px",
                    width: "80px",
                  }),
                }}
              />
            )}

            {!isValueBeingSubmitted ? (
              <CheckBoxOutlinedIcon
                onClick={handleValueSubmit}
                style={{
                  fontSize: "1.65rem",
                  color: "green",
                }}
              />
            ) : (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}

            {errorMessage && (
              <small className="text-danger d-block">{errorMessage}</small>
            )}
          </>
        ) : (
          <>
            {fieldData + " " + dataPostfix}
            <EditOutlinedIcon
              onClick={handleEdit}
              style={{
                fontSize: "1.65rem",
                margin: "0 0.5rem",
                color: "#0d6efd",
                clear: "both",
              }}
            />
          </>
        )}
      </p>

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

export default EditTableData;
