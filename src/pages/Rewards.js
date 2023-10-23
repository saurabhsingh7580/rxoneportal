import PageContentLayout from "../components/page-content/PageContentLayout";
import PageNav from "../components/page-content/PageNav";
import Redeem from "../components/rewards/Redeem";
import EarnRewards from "../components/rewards/EarnRewards";
import PointsHistory from "../components/rewards/PointsHistory";
import PageContentRoutes from "../utils/app-content-routes";

const rewardsRoutes = [
  { path: "redeem", component: <Redeem /> },
  { path: "earn-rewards", component: <EarnRewards /> },
  { path: "points-history", component: <PointsHistory /> },
];

function Rewards() {
  return (
    <PageContentLayout>
      <PageNav routes={rewardsRoutes} />

      <PageContentRoutes routes={rewardsRoutes} />
    </PageContentLayout>
  );
}

export default Rewards;
