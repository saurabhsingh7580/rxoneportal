import pointsEarnedImg from "../../assets/images/icons/earn-points/points-earned.png";
import pointsClaimedImg from "../../assets/images/icons/earn-points/points-claimed.png";
import rxOneImg from "../../assets/images/logos/user-nav-logo.png";

function PointsHistoryTable(props) {
  const { dateHistories } = props;

  return (
    <table className="mx-auto mb-4 points-history-table h-100">
      <tbody>
        {dateHistories.map((history, idx) => (
          <tr key={idx} className="point-history-data">
            <td>
              <img
                className="mx-auto"
                src={history.is_credit ? pointsEarnedImg : pointsClaimedImg}
                alt={`Points ${history.is_credit ? "Earned" : "Claimed"}`}
                style={{ height: "40px" }}
              />
            </td>

            <td>{history.description}</td>

            <td
              className={`text-${
                history.points > 0 ? "success" : "danger"
              } pt-2 pb-0`}
            >
              <img src={rxOneImg} alt="Rx One" style={{ height: "25px" }} />{" "}
              {history.points.toString().length > 3
                ? history.points
                    .toString()
                    .substring(0, history.points.toString().length - 3)
                    .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
                  "," +
                  history.points
                    .toString()
                    .substring(history.points.toString().length - 3)
                : history.points.toString()}
              <p
                className="text-black mt-2 mb-1"
                style={{ fontSize: "0.8rem" }}
              >
                {history.transaction_date}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PointsHistoryTable;
