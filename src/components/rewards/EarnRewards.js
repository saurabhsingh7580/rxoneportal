import Container from "react-bootstrap/Container";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import MedicationIcon from "@mui/icons-material/Medication";
import BiotechIcon from "@mui/icons-material/Biotech";

import EarnRewardsBanner from "./EarnRewardsBanner";

const earnRewardsData = [
  {
    icon: <MonetizationOnOutlinedIcon style={{ fontSize: "3rem" }} />,
    title: "Help a fellow medical practioner/provider grow using RxOne",
    description:
      "Know someone who needs to set up Digital OPD? Receive 5000 Rx Points (~ ₹ 1,000)  as Rewards - 100% FREE* per successful referral",
    buttonText: "Refer Now",
  },
  {
    icon: <FavoriteSharpIcon style={{ fontSize: "3rem" }} />,
    title: "Help patients get the care they deserve!",
    description:
      "Each appointment booked and paid on your Care Portal will get you 100 Rx Points as Rewards - 100% FREE* per successful appointment",
    buttonText: "Share Link",
  },
  {
    icon: <MedicationIcon style={{ fontSize: "3rem" }} />,
    title: "Ease delivery of medicine for patients!",
    description:
      "Prescription medicine ordered and paid on your Care Portal will get you 250 Rx Points as Rewards - 100% FREE* per successful order",
    buttonText: "Share Link",
  },
  {
    icon: <BiotechIcon style={{ fontSize: "3rem" }} />,
    title: "Help patients get medical tests done faster!",
    description:
      "Each Lab Tests booked and paid on your Care Portal will get you 250 Rx Points as Rewards - 100% FREE* per successful test booking",
    buttonText: "Share Link",
  },
];

function EarnRewards() {
  return (
    <>
      <div
        className="my-4 px-3 py-1"
        style={{
          backgroundColor: "#b3c6e7",
        }}
      >
        More ways to earn Rx Points!
      </div>

      <Container className="my-4" style={{ overflow: "auto" }}>
        {earnRewardsData.map((reward, idx) => (
          <EarnRewardsBanner
            key={idx}
            icon={reward.icon}
            title={reward.title}
            description={reward.description}
            buttonText={reward.buttonText}
          />
        ))}
      </Container>
    </>
  );
}

export default EarnRewards;
