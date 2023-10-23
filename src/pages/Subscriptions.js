import PageContentLayout from "../components/page-content/PageContentLayout";
import Service from "../components/subscriptions/Service";

function Subscriptions() {
  return (
    <PageContentLayout className="pricing">
      <section className="py-5">
        <div className="container">
          <div className="row">
            <Service type="essential" />

            <Service type="premium" />
          </div>
        </div>
      </section>
    </PageContentLayout>
  );
}

export default Subscriptions;

{
  /* <h1 className="h5 px-3 py-2 text-muted">Available Services</h1>

<div className="subscription-rx-opd-services p-3">
  <h2 className="h4 fw-bolder">Subscribe to Rx OPD Services</h2>

  <p>
    (This service allows you to setup OPD Management System, Telemedicine
    Setup, along with Patient and Doctor Portals.)
  </p>

  <section className="container">
    <Row className="services">
      <Service type="essential" />

      <Service type="premium" />
    </Row>
  </section>
</div> */
}
