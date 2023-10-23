import { useContext, useState } from "react";
import Form from "react-bootstrap/Form";

import ModeContext from "../../context/mode-context";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

function DoctorAvailabilitySwitch(props) {
  const { available, hospitalId, doctorId } = props;

  const { mode } = useContext(ModeContext);
  const [isDoctorAvailable, setIsDoctorAvailable] = useState(available);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const handleAvailabilityToogle = async event => {
    const userKeys = localStorage.getItem("usr_keys");

    if (userKeys) {
      setUpdatingAvailability(true);

      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.put(
          RX_OPD_ENDPOINTS.HOSPITAL.SWITCH_DOCTOR_AVAILABILITY +
            "/" +
            hospitalId +
            "/" +
            doctorId
        );

        if (res) {
          setIsDoctorAvailable(res.data.availability);
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        alert("ERROR:\n" + error.message);
        console.log("Error in updating doctor availability.\nERROR:", error);
      } finally {
        setUpdatingAvailability(false);
      }
    }
  };

  return (
    <Form.Check
      className="m-auto"
      disabled={updatingAvailability}
      type="switch"
      id={`doctor-availablitiy-switch-${doctorId}`}
      label=""
      checked={isDoctorAvailable}
      onChange={handleAvailabilityToogle}
      value={isDoctorAvailable}
      style={{ height: "1rem", width: "3rem" }}
    />
  );
}

export default DoctorAvailabilitySwitch;
