import { useFormikContext } from "formik";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";

function ProfileCard(props) {
  const { name, gender, age, email, profileType, onClick } = props;

  const formikProps = useFormikContext();

  return (
    <Row
      className="align-items-center bg-body shadow rounded-3 py-2 mb-3"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Col
        xs={3}
        className="text-center text-capitalize d-flex flex-column justify-content-center align-items-center"
      >
        {profileType === "self" ? (
          <PersonIcon style={{ fontSize: "3rem" }} />
        ) : (
          <GroupsIcon style={{ fontSize: "3rem" }} />
        )}

        <small style={{ fontSize: "0.8rem" }}>({profileType})</small>
      </Col>

      <Col xs={9} className="d-flex flex-column">
        <h1 className="h5 text-capitalize m-0">
          {name} ({gender}, {age})
        </h1>

        <span style={{ fontSize: "0.92rem" }}>
          +91 {formikProps.values.patientDetails.contactNo}
        </span>

        <span style={{ fontSize: "0.92rem" }}>{email}</span>
      </Col>
    </Row>
  );
}

export default ProfileCard;
