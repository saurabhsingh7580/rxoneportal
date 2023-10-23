import React, { useContext, useEffect, useState } from "react";

import AuthContext from "./auth-context";
import ModeContext from "./mode-context";
import Toast from "../components/ui/Toast";
import { rxOneApi } from "../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../utils/api/apiEndPoints";

const RxPointsContext = React.createContext({
  rewardPoints: 0,
  arePointsLoading: true,
  updatePoints: () => {},
});

function RxPointsProvider(props) {
  const { logout } = useContext(AuthContext);
  const { mode } = useContext(ModeContext);

  const [rewardPoints, setRewardPoints] = useState(0);
  const [arePointsLoading, setArePointsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);

  const fetchRewardsPointBalance = async () => {
    setArePointsLoading(true);

    try {
      const userToken = localStorage.getItem("usr_token");

      rxOneApi.setUserSecretAuthHeaders();
      const res = await rxOneApi.get(
        RX_ONE_ENDPOINTS.REWARDS.REDEEM.GET_POINTS_BALANCE +
          "/" +
          mode +
          "/" +
          userToken
      );

      if (res) {
        setRewardPoints(res.data.points);
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
      setArePointsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  useEffect(() => {
    fetchRewardsPointBalance();
  }, [mode]);

  const updatePoints = async () => fetchRewardsPointBalance();

  const rxPointsContextValue = { rewardPoints, arePointsLoading, updatePoints };

  return (
    <RxPointsContext.Provider value={rxPointsContextValue}>
      {props.children}

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </RxPointsContext.Provider>
  );
}

export default RxPointsContext;
export { RxPointsProvider };
