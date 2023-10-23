import { useContext, useEffect, useState } from "react";

import ModeContext from "../../context/mode-context";
import Button from "../ui/Button";
import Card from "./Card";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";
import { Spinner } from "react-bootstrap";
import Toast from "../ui/Toast";
import Form from "../form/Form";
import AddUserModal from "./AddUserModal";

function Users() {
  const { mode } = useContext(ModeContext);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRecords, setUserRecords] = useState([]);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [shallUpdate, setShallUpdate] = useState(true);
  const [resultsFetchedSuccessfully, setResultsFetchedSuccessfully] =
    useState(false);

  useEffect(() => {
    if (resultsFetchedSuccessfully) setShallUpdate(false);
  }, [resultsFetchedSuccessfully]);

  useEffect(() => {
    const fetchUsersData = async () => {
      setIsLoading(true);
      setResultsFetchedSuccessfully(false);

      const userModeKey = JSON.parse(localStorage.getItem("usr_keys"))[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];
      const userToken = localStorage.getItem("usr_token");

      try {
        rxOneApi.setAuthHeaders(key, secret);
        const res = await rxOneApi.get(
          RX_ONE_ENDPOINTS.SETTINGS.LIST_FACILITY_STAFF + "/" + userToken
        );
        setUserRecords(res.data.records);
        setResultsFetchedSuccessfully(true);
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);
        setResultsFetchedSuccessfully(false);
      } finally {
        setIsLoading(false);
      }
    };

    shallUpdate && fetchUsersData();
  }, [shallUpdate]);

  return (
    <>
      <div>
        <Button
          className="mt-2 mx-3 rounded-pill"
          onClick={() => setShowAddUserModal(true)}
        >
          Add User
        </Button>
        <div className="container p-2">
          {isLoading ? (
            <div
              className="w-100 d-flex justify-content-center align-items-center"
              style={{ height: "70vh" }}
            >
              <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
                className="mx-3"
              />
            </div>
          ) : (
            <div>
              {userRecords.map((record) => (
                <Card
                  key={record.staff_id}
                  record={record}
                  setShallUpdate={setShallUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddUserModal
        operation="add"
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        setShallUpdate={setShallUpdate}
      />

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </>
  );
}

export default Users;
