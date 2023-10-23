import Col from "react-bootstrap/Col";

function TimeSlot(props) {
  const { slot, disabled, isSelected, onClick } = props;

  return (
    <Col xs={4} md={3}>
      <button
        className={`time-slot-btn p-1 p-md-2 mb-2 ${
          isSelected ? "active-time-slot" : ""
        }`}
        type="button"
        onClick={onClick}
        disabled={disabled}
      >
        {slot} {+slot.substring(0, 2) < 12 ? "AM" : "PM"}
      </button>
    </Col>
  );
}

export default TimeSlot;
