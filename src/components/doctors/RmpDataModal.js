import { useFormikContext } from "formik";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import DataTable from "../ui/DataTable";

const tableHeadRow = [
  "Name",
  "RMP Num.",
  "Birth Year",
  "State Medical Council",
  "Degree",
  "Passing Year",
  "Registration Year",
];

function RmpDataModal(props) {
  const { rmpDetails, show, onHide } = props;

  const formik = useFormikContext();

  const handleRowClick = selectedRowValues => {
    formik.setFieldValue(
      "doctorDetails.firstName",
      selectedRowValues.DoctorName.split(" ")[0] || ""
    );
    formik.setFieldValue(
      "doctorDetails.lastName",
      selectedRowValues.DoctorName.split(" ")[1] || ""
    );
    formik.setFieldValue("doctorDetails.rmpNo", selectedRowValues.RMPNum || "");
    formik.setFieldValue(
      "doctorDetails.regYear",
      selectedRowValues.RegistrationYear || ""
    );
    formik.setFieldValue(
      "doctorDetails.birthYear",
      selectedRowValues.BirthYear || ""
    );
    formik.setFieldValue(
      "doctorDetails.degreeYear",
      selectedRowValues.YearOfPassing || ""
    );
    formik.setFieldValue(
      "doctorDetails.qualification",
      selectedRowValues.DoctorDegree || ""
    );

    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="custom-modal"
      centered
      contentClassName="p-3"
    >
      <h1 className="h6 text-center text-muted">
        Select the correct row to populate details in the form.
      </h1>

      <DataTable
        headRow={tableHeadRow}
        bodyRows={rmpDetails.map((detail, index) => ({
          name: detail.DoctorName,
          rmpNo: detail.RMPNum,
          birthYear: detail.BirthYear,
          stateMedicalCouncil: detail.StateMedicalCouncil,
          degree: detail.DoctorDegree,
          passingYear: detail.YearOfPassing,
          registrationYear: detail.RegistrationYear,
          key: index,
          handleRowClick: () => handleRowClick(detail),
        }))}
        areRowsClickable={true}
      />
    </Modal>
  );
}

export default RmpDataModal;
