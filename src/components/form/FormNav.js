import { Col } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import FormNavItem from "./FormNavItem";

function FormNav(props) {
  const { formNavItems, onNavItem } = props;

  return (
    <Row className="justify-content-center">
      {formNavItems.length > 1 &&
        formNavItems.map((navItem, index) => (
          <Col
            xs={2}
            key={navItem.label}
            className="d-flex justify-content-center px-1 px-md-2"
            style={{
              width: `${Math.floor(100 / formNavItems.length)}%`,
            }}
          >
            <FormNavItem
              itemNumber={index + 1}
              itemLabel={navItem.label}
              isActive={navItem.isActive}
              onNavItem={onNavItem}
            />
          </Col>
        ))}
    </Row>
  );
}

export default FormNav;
