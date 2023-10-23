import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import CheckIcon from "@mui/icons-material/Check";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";

import HospitalsContext from "../../context/hospitals-context";
import EditTableData from "./EditTableData";
import DoctorAvailabilitySwitch from "./DoctorAvailabilitySwitch";
import EditDoctorSchedule from "./EditDoctorSchedule";
import RefreshDataBtn from "../refresh-data/RefreshDataBtn";
import DataTable from "../ui/DataTable";
import Button from "../ui/Button";

function DoctorsTab(props) {
  const {
    hospitalId,
    registeredDoctors,
    setRegisteredDoctors,
    areDoctorsLoading,
    setAreDoctorsLoading,
    noDataMessage,
    isAnyDocRegPending,
  } = props;

  const { isLoading, hospitals } = useContext(HospitalsContext);

  const [tableHeadRow, setTableHeadRow] = useState([
    "Doctor Name",
    "Speciality",
    "RMP No.",
    "Consultation Charges",
    "Online Booking Discount (Up to 20%)",
    "Registration Status",
    "Availability",
    "Schedule",
  ]);
  const [errorMessage, setErrorMessage] = useState(noDataMessage);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAnyDocRegPending) {
      setTableHeadRow([
        "Doctor Name",
        "Speciality",
        "RMP No.",
        "Consultation Charges",
        "Online Booking Discount (Up to 20%)",
        "Registration Status",
        "Availability",
        "Schedule",
        "        ",
      ]);
    } else {
      setTableHeadRow([
        "Doctor Name",
        "Speciality",
        "RMP No.",
        "Consultation Charges",
        "Online Booking Discount (Up to 20%)",
        "Registration Status",
        "Availability",
        "Schedule",
      ]);
    }
  }, [registeredDoctors, isAnyDocRegPending]);

  const handleContinueDocReg = doctorId => {
    navigate("/app/doctors/register?edit=true&doc_id=" + doctorId, {
      replace: true,
    });
  };

  return (
    <>
      <Button
        disabled={!isLoading && hospitals.length === 0}
        className="float-start mt-2 mx-3 rounded-pill"
      >
        <Nav as="nav" className="my-0">
          <Nav.Link
            as={NavLink}
            to="/app/doctors/register"
            className="p-0 text-white"
          >
            Add Doctor
          </Nav.Link>
        </Nav>
      </Button>

      <RefreshDataBtn
        type="doctors"
        setData={setRegisteredDoctors}
        tableDataLoading={areDoctorsLoading}
        setTableDataLoading={setAreDoctorsLoading}
        setErrorMessage={setErrorMessage}
      />

      <DataTable
        headRow={tableHeadRow}
        bodyRows={registeredDoctors.map(doctor => {
          const rowData = {
            docName: doctor.doctor_name,
            speciality: doctor.speciality,
            rmpNo: doctor.rmp_num,
            consultCharges: (
              <EditTableData
                type="consult-charges"
                dataPrefix={doctor.currency}
                data={doctor.consult_charges}
                hospitalId={hospitalId}
                doctorId={doctor.doc_id}
              />
            ),
            // onlineDiscount: doctor.online_discount,
            onlineDiscount: (
              <EditTableData
                type="discount"
                data={doctor.online_discount.substring(
                  0,
                  doctor.online_discount.length - 1
                )}
                dataPostfix="%"
                hospitalId={hospitalId}
                doctorId={doctor.doc_id}
              />
            ),
            registrationStatus: (
              <button
                disabled
                className={`text-capitalize w-100 fw-bold border-2 btn btn-outline-${
                  doctor.registration_status === "Confirmed"
                    ? "success"
                    : "danger"
                }`}
              >
                {doctor.registration_status === "Confirmed" ? (
                  <CheckIcon className="mx-1 fw-bolder" />
                ) : (
                  <AssignmentLateIcon className="mx-1 fw-bolder" />
                )}
                {doctor.registration_status}
              </button>
            ),
            availability: (
              <DoctorAvailabilitySwitch
                hospitalId={hospitalId}
                available={doctor.availability}
                doctorId={doctor.doc_id}
              />
            ),
            schedule: (
              <EditDoctorSchedule
                hospitalId={hospitalId}
                doctorId={doctor.doc_id}
              />
            ),
            continueRegBtn: doctor.registration_status === "Pending" && (
              <button
                className="table-btn table-update-btn fs-6"
                onClick={() => handleContinueDocReg(doctor.doc_id)}
              >
                Continue Registration
              </button>
            ),
            key: doctor.doc_id,
          };

          if (!isAnyDocRegPending) {
            delete rowData.continueRegBtn;
          }

          return rowData;
        })}
        noDataMessage={errorMessage}
        isLoading={areDoctorsLoading || isLoading}
      />
    </>
  );
}

export default DoctorsTab;
