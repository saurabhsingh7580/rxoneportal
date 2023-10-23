import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faEnvelope,
  faPhone,
  faCheckCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";

import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";
import { rxOneApi } from "../../utils/api/api";
import Toast from "../ui/Toast";
import AddUserModal from "./AddUserModal";
import { Col, Row } from "react-bootstrap";

const Card = (props) => {
  const {
    first_name,
    last_name,
    email,
    activated,
    phone,
    access_allowed,
    staff_id,
  } = props.record;

  const { setShallUpdate } = props;

  const [updatingAccess, setUpdatingAccess] = useState(false);
  const [accessAllowed, setAccessAllowed] = useState(access_allowed);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const handleActivatedContactClick = () => {
    if (activated) return;

    setShowAddUserModal(true);
  };

  const handleAvailabilityToogle = async () => {
    try {
      setUpdatingAccess(true);
      const userToken = localStorage.getItem("usr_token");
      const userSecret = localStorage.getItem("usr_secret");

      const res = await rxOneApi.axios.put(
        RX_ONE_ENDPOINTS.SETTINGS.SWITCH_STAFF_ACCESS +
          "/" +
          userToken +
          "/" +
          staff_id,
        { access_allowed: !accessAllowed },
        { headers: { usr_secret: userSecret } }
      );
      if (res) {
        setAccessAllowed(res.data.access_allowed);
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setUpdatingAccess(false);
    }
  };

  return (
    <>
      <div className="m-2 shadow">
        <div className="card mb-3 border rounded bg-white">
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between align-items-center container-fluid">
              <Row className="mx-0 w-100 justify-content-center align-items-center">
                <Col xs={12} lg={3} md={6}>
                  <div className=" d-flex flex-column">
                    <h5 className="card-title mb-0">
                      {first_name + " " + last_name}
                    </h5>
                    <a
                      href={`mailto:${email}`}
                      className="d-flex align-items-center text-dark text-decoration-none"
                    >
                      <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                      <p className="card-text mb-0 p-1">{email}</p>
                    </a>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faPhone} className="mr-1" />
                      <p className="card-text mb-0 ml-3">{phone}</p>
                    </div>
                  </div>
                </Col>

                <Col xs={12} lg={3} md={6}>
                  <div className="d-flex flex-column align-items-center">
                    <label className="text-success">Allow Access</label>
                    <Form.Check
                      className="form-switch-lg mt-1"
                      disabled={updatingAccess}
                      type="switch"
                      checked={accessAllowed}
                      onChange={handleAvailabilityToogle}
                      //value={access_allowed}
                      style={{ transform: "scale(1.5)" }}
                    />
                  </div>
                </Col>

                <Col xs={12} lg={3} md={6}>
                  <div className="d-flex flex-column">
                    <div
                      className={`d-flex ${
                        activated ? "bg-success" : "btn-warning"
                      } rounded justify-content-center p-2 align-items-center mt-3 mb-1 w-95 my-lg-0`}
                      style={{ cursor: activated ? "" : "pointer" }}
                      disabled={activated ? true : false}
                      onClick={handleActivatedContactClick}
                    >
                      <p className="card-text text-light mb-0 p-1">
                        {activated ? "Contact Verified" : "Update Contact"}
                      </p>
                      <FontAwesomeIcon
                        icon={activated ? faCheckCircle : faEdit}
                        className="text-light mr-2"
                      />
                    </div>
                  </div>
                </Col>

                <Col xs={12} lg={3} md={6}>
                  <div className="d-flex flex-column">
                    <button
                      className="btn btn-outline-warning rounded-pill my-1 w-95 my-lg-0"
                      onClick={() => setShowAddUserModal(true)}
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

      {showAddUserModal && (
        <AddUserModal
          operation="edit"
          show={showAddUserModal}
          onHide={() => setShowAddUserModal(false)}
          staffId={staff_id}
          setShallUpdate={setShallUpdate}
        />
      )}

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </>
  );
};

export default Card;
