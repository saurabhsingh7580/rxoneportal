import { Col, Row } from "react-bootstrap";

function Info(props) {
  const { title, body, learnMoreLink } = props;

  return (
    <Row xs={12} className="my-4 h-100">
      <Col as="section" xs={12} className="mt-3 mt-sm-0">
        <h2 className="h2 mb-4">{title}</h2>

        <p style={{ fontSize: "1.15rem" }}>{body}</p>

        <a href={learnMoreLink} className="text-white">
          {title === "Together for Better Care"
            ? "Know More..."
            : "Read More..."}
        </a>
      </Col>
    </Row>
  );
}

export default Info;
