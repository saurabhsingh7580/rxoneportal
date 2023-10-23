import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function EarnRewardsBanner(props) {
  const { icon, title, description, buttonText } = props;

  return (
    <div
      className="row alert alert-dark align-items-center text-white mx-auto earn-reward-banner"
      style={{ backgroundColor: "rgb(0, 176, 240)" }}
    >
      <Col
        xs={3}
        md={1}
        className="d-none d-md-block text-center px-0 text-white fw-bold"
      >
        {icon}
      </Col>
      <Col xs={9} md={9} className="earn-rewards-banner-desc">
        <div className="d-flex align-items-center earn-rewards-banner-desc">
          <div className="d-inline-block d-md-none me-3 text-white fw-bold">
            {icon}
          </div>

          <h1 className="h5 fw-bold d-inline-block">{title}</h1>
        </div>

        <div className="w-100 d-none d-md-block">{description}</div>
      </Col>
      <Col xs={12} md={0} className="d-block d-md-none">
        <div className="w-100">{description}</div>
      </Col>
      {/* <Col xs={12} md={2}>
        <Button className="w-100 mt-3 mt-md-0 px-0">{buttonText}</Button>
      </Col> */}
    </div>
  );
}

export default EarnRewardsBanner;
