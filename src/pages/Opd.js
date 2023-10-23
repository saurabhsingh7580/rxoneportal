import AppointmentsTab from "../components/opd/AppointmentsTab";
import AppointmentsTab2 from "../components/opd/AppointmentsTab2";
import InvoicesTab from "../components/opd/InvoicesTab";
import PaymentsTab from "../components/opd/PaymentsTab";
import PageContentLayout from "../components/page-content/PageContentLayout";
import PageNav from "../components/page-content/PageNav";
import PageContentRoutes from "../utils/app-content-routes";

function Opd() {
  const opdRoutes = [
    { path: "appointments", component: <AppointmentsTab2 /> },
    {
      path: "payments",
      component: <PaymentsTab />,
    },
    { path: "invoices", component: <InvoicesTab /> },
  ];

  return (
    <PageContentLayout>
      <PageNav routes={opdRoutes} />

      <PageContentRoutes routes={opdRoutes} />
    </PageContentLayout>
  );
}

export default Opd;
