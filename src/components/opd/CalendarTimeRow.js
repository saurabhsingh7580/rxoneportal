import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function CalendarTimeRow(props) {
  const { appointments } = props;

  return (
    <>
      {appointments.map((appointment, index) => {
        return (
          <Row
            key={index}
            className="align-items-center border border-2"
            style={{ height: "102px" }}
          >
            <Col
              xs={3}
              className="border-end border-2 h-100 text-center align-middle d-flex align-items-center justify-content-center fs-5"
            >
              {appointment.timeSlot}
            </Col>

            <Col
              xs={9}
              className="d-flex flex-column px-0 justify-content-start align-items-start h-100 position-relative"
            >
              <div
                className="cal-event-first-half h-50 w-100"
                style={{ borderBottom: "1px dotted gray" }}
              ></div>

              <div className="cal-event-sec-half h-50 w-100"></div>

              {/* <div
                className="position-absolute bg-secondary"
                style={{ top: "0", zIndex: "2" }}
              >
                OUTTER DIV (top: 0)
              </div>

              <div
                className="position-absolute bg-secondary"
                style={{ top: "10px", zIndex: "1" }}
              >
                OUTTER DIV (top: 10px)
              </div> */}
              <Container
                fluid
                className="position-absolute text-white h-100"
                style={{ padding: "0 12px", overflow: "hidden" }}
              >
                <Row className="h-100">
                  {appointment.appointments.map((app, innerIndex) => {
                    let backgroundColor = "";

                    if (app.appointment_card_status === "Not Confirmed") {
                      backgroundColor = "danger";
                    } else {
                      backgroundColor = "success";
                    }

                    return (
                      <Col
                        key={innerIndex}
                        xs={Math.floor(12 / appointment.appointments.length)}
                        className={`bg-${backgroundColor} mx-1 text-center px-0 d-flex align-items-center`}
                        style={{
                          fontSize: "0.7rem",
                          height: "24px",
                          top: "40px",
                        }}
                      >
                        {app.patient_name}, {app.patient_age},{" "}
                        {app.patient_gender} {innerIndex}
                      </Col>
                    );
                  })}
                </Row>
              </Container>
            </Col>
          </Row>
        );
      })}
    </>
  );
}

export default CalendarTimeRow;
