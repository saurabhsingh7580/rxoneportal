import PageContentLayout from "../components/page-content/PageContentLayout";
import PageNav from "../components/page-content/PageNav";
import PageContentRoutes from "../utils/app-content-routes";
import Users from "../components/settings/Users";

const rewardsRoutes = [{ path: "users", component: <Users /> }];

function Settings() {
  return (
    <PageContentLayout>
      <PageNav routes={rewardsRoutes} />

      <PageContentRoutes routes={rewardsRoutes} />
    </PageContentLayout>
  );
}

export default Settings;
