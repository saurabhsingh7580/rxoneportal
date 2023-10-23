import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faCheckCircle,
  faEdit,
  faBell,
  faBellSlash,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import { Col, Row, Badge } from "react-bootstrap";

const Card = (props) => {
  const {
    accepting_orders,
    email,
    end_time,
    full_address,
    google_place_id,
    ph_id,
    ph_name,
    ph_short_name,
    pharma_registration_no,
    phone1,
    phone2,
    registration_approved,
    registration_approved_on,
    registration_submitted,
    registration_submitted_on,
    start_time,
  } = props.record;
  let activated = true;
  return (
    <>
      <div className="m-2 shadow">
        <div className="card mb-3 border rounded bg-white">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between align-items-center container-fluid">
              <Row className="mx-0 w-100 justify-content-center align-items-center">
                {/* Image */}
                <Col xs={12} lg={1} md={2}>
                  <img
                    src="your-image-url.jpg"
                    alt="your image description"
                    style={{
                      border: "2px solid #333",
                      borderRadius: "20px",
                    }}
                  />
                </Col>

                {/* Pharmacy name and address */}
                <Col xs={12} lg={3} md={2}>
                  <div className=" d-flex flex-column">
                    <h5 className="card-title mb-0">{ph_name}</h5>
                    <a
                      // href={`mailto:${email}`}
                      className="d-flex align-items-center text-dark text-decoration-none"
                    >
                      {/* <FontAwesomeIcon icon={faEnvelope} className="mr-1" /> */}
                      <p className="card-text mb-0">
                        (REGNO : {pharma_registration_no})
                      </p>
                    </a>
                    <div className="d-flex align-items-center">
                      <div className="mr-3">
                        <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />
                      </div>
                      <div className="ml-4">
                        <p className="card-text mb-0">{full_address}</p>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Contact details */}
                <Col xs={12} md={2}>
                  <div className="d-flex flex-column">
                    <button
                      className="btn btn-outline-warning my-1 w-95 my-lg-0"
                      // onClick={() => setShowAddUserModal(true)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-warning mr-5"
                      />
                      Contact Details
                    </button>
                    <a
                      // href={`mailto:${email}`}
                      className="d-flex align-items-center text-dark text-decoration-none"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                      <p className="card-text mb-0 p-1">{email}</p>
                    </a>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faPhone} className="mr-1" />
                      <p className="card-text mb-0 ml-3">{phone1}</p>
                    </div>
                  </div>
                </Col>

                {/* Registration */}
                <Col xs={12} md={2}>
                  <div className="d-flex flex-column">
                    <div
                      className={`d-flex ${
                        registration_approved ? "bg-success" : "btn-warning"
                      } rounded justify-content-center p-2 align-items-center mt-3 mb-1 w-95 my-lg-0`}
                      style={{ cursor: registration_approved ? "" : "pointer" }}
                      disabled={registration_approved ? true : false}
                      // onClick={handleActivatedContactClick}
                    >
                      <p className="card-text text-light mb-0 p-1">
                        {registration_approved
                          ? "Registration Approved"
                          : "Continue Registration"}
                      </p>
                      <FontAwesomeIcon
                        icon={registration_approved ? faCheckCircle : faEdit}
                        className="text-light mr-2"
                      />
                    </div>
                  </div>
                </Col>
                {/* Accepting Orders */}
                <Col className="align-items-center" xs={12} md={2}>
                  <Row>
                    <Col xs={1} md={2}>
                      <FontAwesomeIcon icon={faBell} />
                    </Col>
                    <Col xs={11} md={10}>
                      <Badge variant="primary">{start_time}</Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={1} md={2}>
                      <FontAwesomeIcon icon={faBellSlash} />
                    </Col>
                    <Col xs={11} md={10}>
                      <Badge variant="secondary">{end_time}</Badge>
                    </Col>
                  </Row>
                  <div className="d-flex flex-column align-items-center">
                    <label className="text-success">Accepting Orders</label>
                    <Form.Check
                      className="form-switch-lg mt-1"
                      // disabled={updatingAccess}
                      type="switch"
                      // checked={accessAllowed}
                      // onChange={handleAvailabilityToogle}
                      value={accepting_orders}
                      style={{ transform: "scale(1.5)" }}
                    />
                  </div>
                </Col>
                {/* Update Details */}
                <Col xs={12} md={2}>
                  <div className="d-flex flex-column">
                    <button
                      className="btn btn-outline-warning rounded-pill my-1 w-95 my-lg-0"
                      // onClick={() => setShowAddUserModal(true)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-warning mr-5"
                      />
                      Update Details
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Card;
