import Container from "react-bootstrap/Container";

import Info from "./Info";

function InfoUnit() {
  return (
    <Container as="article" className="h-100 justify-content-between">
      <Info
        title="Together for Better Care"
        body="We are creating a digital ecosystem for medical providers, where we can support each other to provide better accessibility and care for Patients. With RxOne providers get next generation patient engagement platform and opportunity to expand business beyond boundaries."
        learnMoreLink="https://rxone.app/providers"
      />

      <Info
        title="One Experience for Users"
        body="RxOne is truly one-of-its-kind platform which tries to give unified experience to users while they take medical care services from different providers. In core, we aim to improve accessibility of medical services in India and Worldwide."
        learnMoreLink="https://rxone.app/blogs"
      />
    </Container>
  );
}

export default InfoUnit;
