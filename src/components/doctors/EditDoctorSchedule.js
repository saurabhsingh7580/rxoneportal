import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import UpdateScheduleModal from "./UpdateScheduleModal";

function EditDoctorSchedule(props) {
  const { hospitalId, doctorId } = props;

  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);

  const handleEditSchedule = async () => {
    setShowEditScheduleModal(true);
  };

  return (
    <>
      <CalendarMonthIcon
        onClick={handleEditSchedule}
        style={{
          width: "100%",
          fontSize: "2.25rem",
          margin: "0 auto",
          color: "#0d6efd",
        }}
      />

      {showEditScheduleModal && (
        <UpdateScheduleModal
          hospitalId={hospitalId}
          doctorId={doctorId}
          show={showEditScheduleModal}
          onHide={() => setShowEditScheduleModal(false)}
        />
      )}
    </>
  );
}

export default EditDoctorSchedule;
