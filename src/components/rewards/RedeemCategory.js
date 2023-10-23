import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Slider from "react-slick";

import AuthContext from "../../context/auth-context";
import RewardDetailsModal from "./RewardDetailsModal";
import Toast from "../ui/Toast";
import PrevArrow from "./PrevArrow";
import NextArrow from "./NextArrow";
import { rxOneApi } from "../../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";
import { Container, Row } from "react-bootstrap";

const settings = {
  infinite: true,
  dots: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

function RedeemCategory(props) {
  const { category, categoryRewards } = props;

  const { logout } = useContext(AuthContext);

  const [areRewardDetailsLoading, setAreRewardDetailsLoading] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [rewardDetails, setRewardDetails] = useState(null);
  const [selectedRewardId, setSelectedRewardId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);

  const userToken = localStorage.getItem("usr_token");

  rxOneApi.setUserSecretAuthHeaders();

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  const handleRewardImageClick = async rewardId => {
    setSelectedRewardId(rewardId);
    setShowRewardsModal(true);
    setAreRewardDetailsLoading(true);

    try {
      rxOneApi.setUserSecretAuthHeaders();
      const rewardDetailsRes = await rxOneApi.get(
        RX_ONE_ENDPOINTS.REWARDS.REDEEM.GET_REWARD_DETAILS +
          "/" +
          userToken +
          "/" +
          rewardId
      );

      if (rewardDetailsRes) {
        setRewardDetails(rewardDetailsRes.data);
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
      setAreRewardDetailsLoading(false);
    }
  };

  const getImg = async rewardId => {
    // rxOneApi.setUserSecretAuthHeaders();
    const rewardDetailsRes = await rxOneApi.get(
      RX_ONE_ENDPOINTS.REWARDS.REDEEM.GET_REWARD_IMAGE +
        "/" +
        userToken +
        "/" +
        rewardId
    );

    // let a=''
    // a.toString()
    return rewardDetailsRes;
  };

  return (
    <>
      {/* style={{ overflow: "hidden" }} */}
      <div className="h-100 m-0 p-0">
        <h1 className="h4 text-muted fw-bold mb-3">{category}</h1>

        {/* <div className="h-100 m-0 p-0 container"> */}
        {/* <p>{reward.image_name}</p> */}
        {/* <div className="row h-100"> */}
        {/* {categoryRewards.map(reward => (
          <React.Fragment key={reward.reward_id}>
            <Col xs={12} md={6} className="h-100">
              <img
                className="m-0 p-0 w-100"
                // style={{ height: "200%" }}
                src={
                  process.env.REACT_APP_RX_ONE +
                  "/" +
                  RX_ONE_ENDPOINTS.REWARDS.REDEEM.GET_REWARD_IMAGE +
                  "/" +
                  userToken +
                  "/" +
                  reward.reward_id
                }
                onClick={() => handleRewardImageClick(reward.reward_id)}
              />
            </Col>
          </React.Fragment>
        ))} */}
        {/* </div> */}

        {/* <p>{reward.required_claim_points}</p> */}
        {/* </div> */}

        <Slider
          {...settings}
          prevArrow={<PrevArrow />}
          nextArrow={<NextArrow />}
        >
          {categoryRewards.map(reward => (
            <div
              key={reward.reward_id}
              onClick={() => handleRewardImageClick(reward.reward_id)}
              style={{ cursor: "pointer" }}
            >
              <img
                className="mx-auto responsive"
                src={
                  process.env.REACT_APP_RX_ONE +
                  // "/" +
                  RX_ONE_ENDPOINTS.REWARDS.REDEEM.GET_REWARD_IMAGE +
                  "/" +
                  userToken +
                  "/" +
                  reward.reward_id
                }
                alt={reward.title}
                // style={{ width: "150px" }}
                style={{ width: "90%", height: "100%", cursor: "pointer" }}
              />
            </div>
          ))}
        </Slider>
      </div>

      <RewardDetailsModal
        areRewardDetailsLoading={areRewardDetailsLoading}
        rewardId={selectedRewardId}
        rewardDetails={rewardDetails}
        show={showRewardsModal}
        onHide={() => setShowRewardsModal(false)}
      />

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

export default RedeemCategory;
