import { useContext, useEffect, useState } from "react";

import ModeContext from "../context/mode-context";
import HospitalsContext from "../context/hospitals-context";
import SelectHospital from "../components/hospitals/SelectHospital";
import DoctorsTab from "../components/doctors/DoctorsTab";
import RegisterTab from "../components/doctors/RegisterTab";
import RemoveTab from "../components/doctors/RemoveTab";
import PageContentLayout from "../components/page-content/PageContentLayout";
import PageNav from "../components/page-content/PageNav";
import PageContentRoutes from "../utils/app-content-routes";
import { rxOpdApi } from "../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../utils/api/apiEndPoints";

function Doctors() {
  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading } = useContext(HospitalsContext);
  const [registeredDoctors, setRegisteredDoctors] = useState([]);
  const [isAnyDocRegPending, setIsAnyDocRePending] = useState(false);
  const [areDoctorsLoading, setAreDoctorsLoading] = useState(false);
  const [deletedDoctorId, setDeletedDoctorId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (deletedDoctorId) {
      setRegisteredDoctors(prevRegisteredDoctors => {
        const deletedDoctorIndex = prevRegisteredDoctors.findIndex(
          doctor => doctor.doc_id === deletedDoctorId
        );

        prevRegisteredDoctors.splice(deletedDoctorIndex, 1);

        return prevRegisteredDoctors;
      });
    }
  }, [deletedDoctorId]);

  useEffect(() => {
    if (currentHospital && registeredDoctors.length === 0) {
      setErrorMessage("Doctor profile not found.");
    } else {
      for (const doc of registeredDoctors) {
        if (doc.registration_status === "Pending") {
          setIsAnyDocRePending(true);
          break;
        } else {
          setIsAnyDocRePending(false);
        }
      }
    }
  }, [currentHospital, registeredDoctors]);

  useEffect(() => {
    if (isLoading) {
      setAreDoctorsLoading(true);
    } else {
      setAreDoctorsLoading(false);
    }

    if (!currentHospital) {
      setErrorMessage(
        "Hospital or Clinic profile not found. Please create a profile first."
      );

      return;
    }

    const userKeys = localStorage.getItem("usr_keys");

    if (userKeys) {
      const fetchRegisteredDoctors = async () => {
        setAreDoctorsLoading(true);

        const userModeKey = JSON.parse(userKeys)[mode];
        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        try {
          rxOpdApi.setAuthHeaders(key, secret);
          const res = await rxOpdApi.get(
            RX_OPD_ENDPOINTS.HOSPITAL.ALL_DOCTORS + "/" + currentHospital.hos_id
          );

          if (res) {
            setRegisteredDoctors(res.data["registered_doctors"]);

            for (const doc of res.data["registered_doctors"]) {
              if (doc.registration_status === "Pending") {
                setIsAnyDocRePending(true);
                break;
              } else {
                setIsAnyDocRePending(false);
              }
            }
          } else {
            throw new Error("Something went wrong. Please try again.");
          }
        } catch (error) {
          setRegisteredDoctors([]);
          setErrorMessage(error.message);
        } finally {
          setAreDoctorsLoading(false);
        }
      };

      fetchRegisteredDoctors();
    }
  }, [mode, isLoading, currentHospital]);

  const doctorsRoutes = [
    {
      path: "doctors",
      component: (
        <DoctorsTab
          hospitalId={currentHospital && currentHospital.hos_id}
          registeredDoctors={registeredDoctors}
          setRegisteredDoctors={setRegisteredDoctors}
          areDoctorsLoading={areDoctorsLoading}
          setAreDoctorsLoading={setAreDoctorsLoading}
          noDataMessage={errorMessage}
          isAnyDocRegPending={isAnyDocRegPending}
        />
      ),
    },
    { path: "register", component: <RegisterTab />, isButton: true },
    {
      path: "remove",
      component: (
        <RemoveTab
          registeredDoctors={registeredDoctors}
          setRegisteredDoctors={setRegisteredDoctors}
          areDoctorsLoading={areDoctorsLoading}
          setAreDoctorsLoading={setAreDoctorsLoading}
          noDataMessage={errorMessage}
          setDeletedDoctorId={setDeletedDoctorId}
        />
      ),
    },
  ];

  return (
    <PageContentLayout>
      <PageNav routes={doctorsRoutes} />

      <div className="w-100 px-2 my-3">
        <SelectHospital type="doctors" />
      </div>

      <PageContentRoutes routes={doctorsRoutes} />
    </PageContentLayout>
  );
}

export default Doctors;
