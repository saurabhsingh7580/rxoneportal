import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import SelectHospital from "../hospitals/SelectHospital";
import AppointmentsForm from "./AppointmentsForm";
import Calendar from "./Calendar";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const allevents = [
  {
    id: 1,
    text: "Event 1",
    start: new Date(2022, 9, 31),
    end: new Date(2022, 9, 31),
  },
  {
    id: 2,
    text: "Event 2",
    start: new Date(2022, 9, 31),
    end: new Date(2022, 9, 31),
  },
  {
    id: 3,
    text: "Event 3",
    start: new Date(2022, 9, 31),
    end: new Date(2022, 9, 31),
  },
];

function AppointmentsTab2(props) {
  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading: areHospitalsLoading } =
    useContext(HospitalsContext);

  const [allDocs, setAllDocs] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      setLoadingDocs(true);

      try {
        const userKeys = localStorage.getItem("usr_keys");
        const userModeKey = JSON.parse(userKeys)[mode];

        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        rxOpdApi.setAuthHeaders(key, secret);
        const allDocsRes = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.APPOINTMENT.LIST_ALL_DOCTORS +
            "/" +
            currentHospital.hos_id
        );

        if (allDocsRes && allDocsRes.data.records.length > 0) {
          const allDocs = allDocsRes.data.records;

          setAllDocs(allDocs);
          setSelectedDocId(allDocs[0].doc_id);
        } else {
          setAllDocs([]);
          setSelectedDocId(null);
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);
      } finally {
        setLoadingDocs(false);
      }
    };

    currentHospital && Object.keys(currentHospital).length > 0 && fetchDocs();
  }, [mode, currentHospital]);

  return (
    <>
      <div className="row align-items-center">
        <Col xs={12} md={7} className="px-4 px-md-4">
          <SelectHospital type="appointment" />
        </Col>

        <Col xs={12} md={5} className="text-center text-md-start px-0"></Col>
      </div>

      {!loadingDocs ? (
        <>
          <div className="row align-items-center my-2 px-4">
            <Col xs={2} className="px-0">
              Select Doctor:{" "}
            </Col>

            <Col xs={10} md={4}>
              <Select
                isLoading={loadingDocs}
                options={allDocs?.map((doc) => ({
                  label: doc.doc_name,
                  value: doc.doc_id,
                }))}
                defaultValue={{
                  label: allDocs ? allDocs[0]?.doc_name : "",
                  value: allDocs ? allDocs[0]?.doc_id : "",
                }}
                onChange={({ value }) => setSelectedDocId(value)}
                styles={{
                  control: (controlStyles) => ({
                    ...controlStyles,
                    border: "2px solid #b3c6e7",
                    borderRadius: "0",
                  }),
                }}
              />
            </Col>
          </div>

          <div className="row my-3 px-4">
            <Calendar selectedDocId={selectedDocId} />
          </div>
        </>
      ) : (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          <Spinner
            as="span"
            animation="border"
            size="md"
            role="status"
            aria-hidden="true"
            className="mx-auto my-5"
          />
        </div>
      )}

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

export default AppointmentsTab2;
