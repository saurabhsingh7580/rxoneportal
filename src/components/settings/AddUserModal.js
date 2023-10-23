import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";
import AddUserForm from "./AddUserForm";
import RemoveUserForm from "./RemoveUserForm";
import Toast from "../ui/Toast";

function AddUserModal(props) {
  const { operation, show, onHide, staffId, setShallUpdate } = props;

  const [user, setUser] = useState(null);
  const [isFetchingUserDetails, setIsFetchingUserDetails] = useState(
    operation !== "add"
  );
  const [currentActive, setCurrentActive] = useState(1);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (operation === "edit") {
        setIsFetchingUserDetails(true);

        try {
          const userSecret = localStorage.getItem("usr_secret");
          const userToken = localStorage.getItem("usr_token");
          const res = await rxOneApi.get(
            RX_ONE_ENDPOINTS.SETTINGS.USER_DETAILS +
              "/" +
              userToken +
              "/" +
              staffId
          );

          setUser(res.data);
        } catch (error) {
          setShowToast(true);
          setToastType("error");
          setToastMessage(error.message);
        } finally {
          setIsFetchingUserDetails(false);
        }
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <>
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header
          className="p-2 text-white border-0"
          closeButton
          style={{ backgroundColor: "#00b0f0" }}
        >
          <Modal.Title>
            {operation === "add"
              ? "Add New User"
              : "Update the Details of Selected User"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="m-0 p-0">
          {!isFetchingUserDetails ? (
            <div className="px-0 m-0 w-100 container-fluid">
              <Row className="mx-0">
                {operation !== "add" && (
                  <Col xs={12} md={4} className="p-0 h6 d-flex flex-md-column">
                    <div
                      className="p-3 m-0 update-user-modal text-center text-md-start"
                      style={{
                        backgroundColor:
                          currentActive === 1 ? "#D3D3D3" : "white",
                        cursor: "pointer",
                      }}
                      onClick={() => setCurrentActive(1)}
                    >
                      Update Details
                    </div>
                    <div
                      className="p-3 m-0 update-user-modal text-center text-md-start"
                      style={{
                        backgroundColor:
                          currentActive === 2 ? "#D3D3D3" : "white",
                        cursor: "pointer",
                      }}
                      onClick={() => setCurrentActive(2)}
                    >
                      Remove User
                    </div>
                  </Col>
                )}

                <Col xs={12} md={operation === "add" ? 12 : 8}>
                  {currentActive === 1 ? (
                    <AddUserForm
                      operation={operation}
                      onHide={onHide}
                      user={user}
                      setShallUpdate={setShallUpdate}
                    />
                  ) : (
                    <RemoveUserForm
                      onHide={onHide}
                      userName={user.first_name + " " + user.last_name}
                      staffId={user.staff_id}
                      setShallUpdate={setShallUpdate}
                    />
                  )}
                </Col>
              </Row>
            </div>
          ) : (
            <div className="w-100 d-flex justify-content-center p-3">
              <Spinner
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
                className="mx-3"
              />
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </>
  );
}

export default AddUserModal;
