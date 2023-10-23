import RegisterFacility from "../components/facilities/RegisterFacility";
import FacilitiesTab from "../components/facilities/FacilitiesTab";
import UpdateTab from "../components/facilities/UpdateTab";
import PageContentLayout from "../components/page-content/PageContentLayout";
import PageNav from "../components/page-content/PageNav";
import PageContentRoutes from "../utils/app-content-routes";
import Pharmacy from "../components/facilities/pharmacy/Pharmacy";

const facilitiesRoutes = [
  { path: "OPD/*", component: <FacilitiesTab /> },
  {
    path: "register",
    component: <RegisterFacility />,
    isButton: true,
  },
  { path: "Pharmacy", component: <Pharmacy /> },
  // { path: "Lab", component: <UpdateTab /> },
  { path: "update", component: <UpdateTab /> },
];
// .map(route => route.path)
function Facilities() {
  return (
    <PageContentLayout>
      <PageNav routes={facilitiesRoutes} />

      <PageContentRoutes routes={facilitiesRoutes} />
    </PageContentLayout>
  );
}

export default Facilities;
