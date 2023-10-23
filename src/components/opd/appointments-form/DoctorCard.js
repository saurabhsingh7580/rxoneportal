import { useContext } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Avatar from "@mui/material/Avatar";

import ModeContext from "../../../context/mode-context";
import { RX_OPD_ENDPOINTS } from "../../../utils/api/apiEndPoints";

function DoctorCard(props) {
  const {
    docId,
    name,
    qualification,
    speciality,
    currency,
    consultCharge,
    isSelected,
    onClick,
  } = props;

  const { mode } = useContext(ModeContext);

  return (
    <>
      <Row
        className={`align-items-center shadow rounded-3 py-2 mb-3 bg-${
          isSelected ? "primary" : "body"
        } text-${isSelected ? "white" : "body"}`}
        style={{ cursor: "pointer" }}
        onClick={onClick}
      >
        <Col xs={2} className="text-center">
          {/* <PersonIcon style={{ fontSize: "3rem" }} /> */}

          <div
            className="bg-white m-0"
            style={{ height: "40px", width: "40px" }}
          >
            <Avatar
              variant="circular"
              src={
                process.env.REACT_APP_RX_OPD +
                (mode === "test" ? "test/" : "") +
                RX_OPD_ENDPOINTS.HOSPITAL.GET_DOCTOR_AVATAR +
                "/" +
                docId
              }
              sx={{ width: 40, height: 40 }}
              style={{ height: "40px", width: "40px" }}
            />
          </div>
        </Col>

        <Col xs={10} className={`d-flex justify-content-between`}>
          <div>
            <h1 className="h5 m-0">{name}</h1>

            <h2 className="m-0" style={{ fontSize: "0.8rem" }}>
              {qualification}, {speciality}
            </h2>
          </div>

          <p>{currency + " " + consultCharge}</p>
        </Col>
      </Row>
    </>
  );
}

export default DoctorCard;
