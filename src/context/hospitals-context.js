import React, { useContext, useEffect, useState } from "react";

import ModeContext from "./mode-context";
import { rxOpdApi } from "../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../utils/api/apiEndPoints";
import AuthContext from "./auth-context";

const HospitalsContext = React.createContext({
  hospitals: [],
  removeHospitalById: hospitalId => {},
  currentHospital: {},
  changeCurrentHospital: newHospital => {},
  isLoading: true,
});

function HospitalsProvider(props) {
  const { mode } = useContext(ModeContext);
  const { logout } = useContext(AuthContext);

  const [hospitals, setHospitals] = useState([]);
  const [currentHospital, setCurrentHospital] = useState();
  const [isFacFalse, setIsFacFalse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [noHospsMessage, setNoHospsMessage] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const fetchHospitals = async () => {
      const userKeys = localStorage.getItem("usr_keys");

      if (userKeys) {
        const userModeKey = JSON.parse(userKeys)[mode];

        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        try {
          rxOpdApi.setAuthHeaders(key, secret);
          const res = await rxOpdApi.get(
            RX_OPD_ENDPOINTS.HOSPITAL.ALL_HOSPITALS
          );

          if (res) {
            const fetchedHospitals = res.data["Registered Institutes"];

            for (const facility of res.data["Registered Institutes"]) {
              if (facility.registration_approved === "False") {
                setIsFacFalse(true);
                break;
              } else {
                setIsFacFalse(false);
              }
            }

            if (fetchedHospitals.length === 0) {
              setNoHospsMessage(
                "No facilities found. Please create a facility first."
              );
            } else {
              setNoHospsMessage(null);
            }

            setHospitals(fetchedHospitals);
            setCurrentHospital(fetchedHospitals[0]);
            setIsLoading(false);
          } else {
            setNoHospsMessage(
              "No facilities found. Please create a facility first."
            );
            throw new Error("Something went wrong.");
          }
        } catch (error) {
          logout();
        }
      }
    };

    fetchHospitals();
  }, [mode]);

  const refreshHospitals = fetchedHospitals => {
    for (const facility of fetchedHospitals) {
      if (facility.registration_approved === "False") {
        setIsFacFalse(true);
        break;
      } else {
        setIsFacFalse(false);
      }
    }

    setHospitals(fetchedHospitals);
    setCurrentHospital(fetchedHospitals[0]);
  };

  const removeHospitalById = hospitalId => {
    let hosps;

    setHospitals(prevHospitals => {
      const hospitalsCopy = [...prevHospitals];
      const index = hospitalsCopy.findIndex(
        hospital => hospital.hos_id === hospitalId
      );
      hospitalsCopy.splice(index, 1);
      hosps = hospitalsCopy;

      return hospitalsCopy;
    });

    for (const facility of hosps) {
      if (facility.registration_approved === "False") {
        setIsFacFalse(true);
        break;
      } else {
        setIsFacFalse(false);
      }
    }

    if (hosps) setCurrentHospital(hosps[0]);
    else setCurrentHospital(null);
  };

  const changeCurrentHospital = hospitalId => {
    const hospital = hospitals.find(hosp => hosp.hos_id === hospitalId);

    setCurrentHospital(hospital);
  };

  const hospitalContextValue = {
    hospitals,
    refreshHospitals,
    removeHospitalById,
    currentHospital,
    changeCurrentHospital,
    isLoading,
    setIsLoading,
    isFacFalse,
    noHospsMessage,
  };

  return (
    <HospitalsContext.Provider value={hospitalContextValue}>
      {props.children}
    </HospitalsContext.Provider>
  );
}

export default HospitalsContext;
export { HospitalsProvider };
