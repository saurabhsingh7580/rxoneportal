import React, { useContext, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

import AuthContext from "../../context/auth-context";
import ModeContext from "../../context/mode-context";
import RxPointsContext from "../../context/rx-points-context";
import PointsHistoryTable from "./PointsHistoryTable";
import Toast from "../ui/Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";

function PointsHistory() {
  const { logout } = useContext(AuthContext);
  const { mode } = useContext(ModeContext);
  const { arePointsLoading, rewardPoints } = useContext(RxPointsContext);

  const [pointsHistoryLoading, setPointsHistoryLoading] = useState(true);
  const [pointsHistory, setPointsHistory] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  useEffect(() => {
    const fetchPointsHistory = async () => {
      setPointsHistoryLoading(true);

      const userToken = localStorage.getItem("usr_token");

      try {
        rxOneApi.setUserSecretAuthHeaders();
        const pointsHistoryRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.REWARDS.POINTS_HISTORY.GET_POINTS_HISTORY +
            "/" +
            mode +
            "/" +
            userToken
        );

        if (pointsHistoryRes) {
          const localHistory = {};

          for (const history of pointsHistoryRes.data.points_history) {
            const month = history.transaction_date.split("-")[1];
            const year = history.transaction_date.split("-")[2];

            const MM_YYYY = month + ", " + year;

            if (!(MM_YYYY in localHistory)) {
              localHistory[MM_YYYY] = [];
            }
            localHistory[MM_YYYY].push(history);
          }

          setPointsHistory(localHistory);
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        if (error?.status === 401) {
          if (!document.querySelector(".toast-modal")) {
            setShowToast(true);
            setToastType("error");
            setToastMessage("Invalid session. Please login again.");
            setShouldLogout(true);
          }
        } else {
          setShowToast(true);
          setToastType("error");
          setToastMessage(error?.error?.message || error?.message);
        }
      } finally {
        setPointsHistoryLoading(false);
      }
    };

    fetchPointsHistory();
  }, [mode]);

  const renderPointsHistory = () => {
    if (Object.keys(pointsHistory).length === 0) {
      return <div className="w-100 p-5 m-5">No Points History Available</div>;
    }

    const pointsHistoryDateWiseCategories = [];

    for (const history in pointsHistory) {
      pointsHistoryDateWiseCategories.push(
        <div key={history} className="h-100">
          <div
            className="w-100 p-2 h-100 fw-bold"
            style={{ backgroundColor: "#dfdcdc" }}
          >
            {history}
          </div>

          <PointsHistoryTable dateHistories={pointsHistory[history]} />
        </div>
      );
    }

    return pointsHistoryDateWiseCategories;
  };

  return (
    <div className="h-100">
      <div
        className="w-100 h-100 mt-4 px-3 py-1 fs-4 text-center"
        style={{
          backgroundColor: "#b3c6e7",
        }}
      >
        {!arePointsLoading ? (
          <span className="fw-bold">
            {rewardPoints.toString().length > 3
              ? rewardPoints
                  .substring(0, rewardPoints.length - 3)
                  .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
                "," +
                rewardPoints.substring(rewardPoints.length - 3)
              : rewardPoints.toString()}{" "}
          </span>
        ) : (
          <Spinner
            as="span"
            size="sm"
            animation="border"
            role="status"
            aria-hidden="true"
            className="mx-3 fw-normal"
          />
        )}

        <span className="fs-5">Rx Points Balance</span>
      </div>

      {/* style={{ height: "60vh", overflow: "hidden scroll" }} */}
      {!pointsHistoryLoading ? (
        <div className="">{renderPointsHistory()}</div>
      ) : (
        <div className="h-100 w-100 d-flex justify-content-center align-items-center p-0 py-5 m-0 my-5">
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
            className="mx-3 my-5"
          />
        </div>
      )}

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}
    </div>
  );
}

export default PointsHistory;
