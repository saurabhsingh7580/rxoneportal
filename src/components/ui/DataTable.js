import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

function DataTable(props) {
  const { headRow, bodyRows, noDataMessage, areRowsClickable, isLoading } =
    props;

  return (
    <div className="mt-3 text-center" style={{ clear: "left" }}>
      <Table striped bordered hover responsive style={{ clear: "left" }}>
        <thead className="t-head">
          <tr>
            {headRow.map(title => (
              <th key={title}>{title}</th>
            ))}
          </tr>
        </thead>

        <tbody className="t-body">
          {isLoading ? (
            <tr className="text-center">
              <td colSpan={headRow.length}>
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
              </td>
            </tr>
          ) : bodyRows && bodyRows.length > 0 ? (
            bodyRows.map(row => {
              const data = [];

              for (const prop in row) {
                if (prop === "key" || prop === "handleRowClick") {
                  continue;
                }

                data.push(<td key={prop}>{row[prop]}</td>);
              }

              return (
                <tr
                  key={row.key}
                  onClick={areRowsClickable ? row.handleRowClick : () => {}}
                >
                  {data}
                </tr>
              );
            })
          ) : (
            <tr className="text-center">
              <td colSpan={headRow.length}>
                {noDataMessage || "No data found!"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default DataTable;
