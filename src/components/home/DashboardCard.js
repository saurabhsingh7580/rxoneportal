import { Col } from "react-bootstrap";

function DashboardCard(props) {
  const { title, onlineValue, rightLabel, rightValue } = props;

  return (
    <div className="shadow pt-2 pb-0 px-3">
      <h2 className="h4 text-muted fw-normal">{title}</h2>

      <div className="d-flex justify-content-evenly fw-bold text-muted fs-4">
        <p>
          <span className="fs-2 text-center">{onlineValue}</span> (Online)
        </p>

        <p>
          <span className="fs-2 text-center">{rightValue}</span>
          {` ${rightLabel}`}
        </p>
      </div>
    </div>
  );
}

export default DashboardCard;
