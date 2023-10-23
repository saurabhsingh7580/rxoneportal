import Home from "../pages/Home";
import Opd from "../pages/Opd";
import Subscriptions from "../pages/Subscriptions";
import Facilities from "../pages/Facilities";
import Doctors from "../pages/Doctors";
import Rewards from "../pages/Rewards";
import Billing from "../pages/Billing";
import Settlements from "../pages/Settlements";
import Settings from "../pages/Settings";
import Kyc from "../pages/Kyc";

const appRoutes = [
  { path: "home", component: <Home /> },
  { path: "opd/*", component: <Opd /> },
  { path: "facilities/*", component: <Facilities /> },
  { path: "doctors/*", component: <Doctors /> },
  { path: "settlements", component: <Settlements /> },
  { path: "subscriptions", component: <Subscriptions /> },
  { path: "rewards/*", component: <Rewards /> },
  { path: "settings/*", component: <Settings /> },
  // { path: "billing", component: <Billing /> },
  { path: "kyc/*", component: <Kyc /> },
];

export default appRoutes;
