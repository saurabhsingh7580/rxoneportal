import { useContext } from "react";
import Select from "react-select";
import { Spinner } from "react-bootstrap";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

function SelectHospital(props) {
  const { type } = props;

  const { mode } = useContext(ModeContext);
  const {
    isLoading,
    currentHospital,
    changeCurrentHospital,
    hospitals,
    noHospsMessage,
  } = useContext(HospitalsContext);

  const handleHospitalChange = ({ value }) => {
    changeCurrentHospital(value);
  };

  return !noHospsMessage ? (
    <div className="d-flex flex-row align-items-center m-0 p-0">
      <div className="" style={{ width: "30%" }}>
        Select Facility:
      </div>

      <div
        className={`d-flex align-items-center ${type}-hospital-wrapper ${
          type === "appointment" ? "w-100" : ""
        }`}
      >
        {currentHospital && (
          <img
            src={
              process.env.REACT_APP_RX_OPD +
              (mode === "test" ? "test/" : "") +
              RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_LOGO +
              "/" +
              currentHospital.hos_id +
              "?v=" +
              Math.random() * Math.random()
            }
            alt={currentHospital.hosp_name}
            className="mx-3"
            style={{ height: "32px", width: "32px" }}
          />
        )}

        {!isLoading ? (
          <Select
            defaultValue={{
              label: currentHospital.hosp_name,
              value: currentHospital.hos_id,
            }}
            options={hospitals.map(hospital => ({
              label: hospital.hosp_name,
              value: hospital.hos_id,
            }))}
            onChange={handleHospitalChange}
            className={`${type}-select-hospital select-hospital`}
            styles={{
              control: controlStyles => ({
                ...controlStyles,
                // alignItems: "center",
                // height: "34.4px",
                padding: "0px",
                // width: "100%",
                border: "2px solid #b3c6e7",
                borderRadius: "0",
              }),
              container: containerStyles => ({
                ...containerStyles,
                // height: "34.4px",
              }),
            }}
          />
        ) : (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mx-3"
          />
        )}
      </div>
    </div>
  ) : (
    <div>{noHospsMessage}</div>
  );
}

export default SelectHospital;
