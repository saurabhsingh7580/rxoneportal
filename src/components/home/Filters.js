import { useState } from "react";
import { Col, Row } from "react-bootstrap";

import DateRange from "../date-range/DateRange";

import "react-datepicker/dist/react-datepicker.css";

function Filters(props) {
  const { startDate, setStartDate, endDate, setEndDate } = props;

  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

  return (
    <section className="container">
      <Row className="d-flex justify-content-center align-items-center">
        <Col
          xs={12}
          // sm={6}
          className="d-flex align-items-center position-relative"
        >
          <DateRange
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Col>

        {/* <Col xs={12} sm={6}>
          time filters
        </Col> */}
      </Row>
    </section>
  );
}

export default Filters;
