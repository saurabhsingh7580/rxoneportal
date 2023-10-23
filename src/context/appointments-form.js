import React, { useContext, useState } from "react";

import ModeContext from "./mode-context";
import HospitalsContext from "./hospitals-context";
import { rxOpdApi } from "../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../utils/api/apiEndPoints";

const AppointmentsFormContext = React.createContext({
  values: null,
  setValues: () => {},
  profiles: [],
  setProfiles: () => {},
  selectedProfile: null,
  setSelectedProfile: () => {},
  newProfileAdded: false,
  setNewProfileAdded: () => {},
  fetchPatientProfiles: () => {},
  selectedDoc: null,
  setSelectedDoc: () => {},
  selectedDocAmt: null,
  setSelectedDocAmt: () => {},
  selectedDate: null,
  setSelectedDate: () => {},
  selectedSlotVal: null,
  setSelectedSlotVal: () => {},
  selectedAppointmentType: null,
  setSelectedAppointmentType: () => {},
  isWalkIn: null,
  setIsWalkIn: () => {},
  bookingData: null,
  setBookingData: () => {},
  orderData: null,
  setOrderData: () => {},
});

function AppointmentsFormProvider(props) {
  const { mode } = useContext(ModeContext);
  const { currentHospital } = useContext(HospitalsContext);

  const [values, setValues] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [newProfileAdded, setNewProfileAdded] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState("in-person");
  const [selectedDocAmt, setSelectedDocAmt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlotVal, setSelectedSlotVal] = useState(null);
  const [isWalkIn, setIsWalkIn] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const fetchPatientProfiles = async contactNo => {
    const userKeys = localStorage.getItem("usr_keys");
    const userModeKey = JSON.parse(userKeys)[mode];

    const key = userModeKey[`${mode}_key`];
    const secret = userModeKey[`${mode}_secret`];

    rxOpdApi.setAuthHeaders(key, secret);
    const res = await rxOpdApi.get(
      RX_OPD_ENDPOINTS.HOSPITAL.OPD.LIST_PATIENTS +
        "/" +
        currentHospital.hos_id +
        "/+91" +
        contactNo
    );

    if (res.data.profiles) {
      setProfiles(res.data.profiles);
    }

    return res.data;
  };

  return (
    <AppointmentsFormContext.Provider
      value={{
        values,
        setValues,
        profiles,
        setProfiles,
        selectedProfile,
        setSelectedProfile,
        newProfileAdded,
        setNewProfileAdded,
        fetchPatientProfiles,
        selectedDoc,
        setSelectedDoc,
        selectedDocAmt,
        setSelectedDocAmt,
        selectedDate,
        setSelectedDate,
        selectedSlotVal,
        setSelectedSlotVal,
        selectedAppointmentType,
        setSelectedAppointmentType,
        isWalkIn,
        setIsWalkIn,
        bookingData,
        setBookingData,
        orderData,
        setOrderData,
      }}
    >
      {props.children}
    </AppointmentsFormContext.Provider>
  );
}

export default AppointmentsFormContext;
export { AppointmentsFormProvider };
