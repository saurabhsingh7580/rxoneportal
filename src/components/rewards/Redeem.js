import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

import AuthContext from "../../context/auth-context";
import RedeemCategory from "./RedeemCategory";
import Toast from "../ui/Toast";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";

function Redeem(props) {
  const { logout } = useContext(AuthContext);

  const [rewards, setRewards] = useState({});
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchRewardsList = async () => {
      setIsLoading(true);

      const userToken = localStorage.getItem("usr_token");

      try {
        rxOneApi.setUserSecretAuthHeaders();
        const res = await rxOneApi.get(
          RX_ONE_ENDPOINTS.REWARDS.REDEEM.GET_REWARDS_LIST + "/" + userToken
        );

        if (res) {
          // setRewards(res.data.rewards);
          // rewards={
          //   "category":[]
          // }

          const localRewards = {};

          const categories = new Set();

          for (const reward of res.data.rewards) {
            categories.add(reward.category);

            localRewards[reward.category] = [];
          }

          for (const reward of res.data.rewards) {
            localRewards[reward.category].push(reward);
          }

          setRewards(localRewards);
        } else {
          setRewards({});
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
        setIsLoading(false);
      }
    };

    fetchRewardsList();
  }, []);

  const renderRedeemCategories = () => {
    if (Object.keys(rewards).length === 0) {
      return <h1 className="h4 text-muted">No Rewards Available</h1>;
    }

    const redeemCategories = [];

    for (const redeemCategory in rewards) {
      redeemCategories.push(
        <Row
          key={redeemCategory}
          // className="h-100"
          className="mb-5"
          // style={{ overflow: "hidden" }}
        >
          <Col xs={12} className="h-75">
            <RedeemCategory
              category={redeemCategory}
              categoryRewards={rewards[redeemCategory]}
            />
          </Col>
        </Row>
      );
    }

    return redeemCategories;
  };

  return (
    <>
      <div
        className="my-4 px-3 py-1"
        style={{
          backgroundColor: "#b3c6e7",
        }}
      >
        Redeem Rx Points from the Exquisite range of Rewards!
      </div>

      <Container
        fluid
        style={{ height: "60vh", overflow: "scroll", overflowX: "hidden" }}
      >
        {!isLoading ? (
          renderRedeemCategories()
        ) : (
          <Row className="justify-content-center h-100 align-items-center">
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
              className="mx-3"
            />
          </Row>
        )}
      </Container>

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}
    </>
  );
}

export default Redeem;
