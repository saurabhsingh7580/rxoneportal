import { useContext, useEffect, useState } from "react";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TaskIcon from "@mui/icons-material/Task";

import AuthContext from "../context/auth-context";
import ModeContext from "../context/mode-context";
import PageContentLayout from "../components/page-content/PageContentLayout";
import DateRange from "../components/date-range/DateRange";
import RefreshDataBtn from "../components/refresh-data/RefreshDataBtn";
import DataTable from "../components/ui/DataTable";
import Toast from "../components/ui/Toast";
import { rxOneApi } from "../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../utils/api/apiEndPoints";

const endDateVal = new Date();
const startDateVal = new Date();
startDateVal.setDate(1);

const tableHeadRow = [
  "Settlement ID",
  "Order Amount  INR (Inc Discount)",
  "Processing Fees INR (Inc Taxes)",
  "Settlement Amount INR",
  "Amount Reversed (Cancelled Appointment)",
  "Initiated On",
  "To be Settled On",
  "Transfer Status",
];

function Settlements() {
  const { logout } = useContext(AuthContext);
  const { mode } = useContext(ModeContext);

  const [startDate, setStartDate] = useState(startDateVal);
  const [endDate, setEndDate] = useState(endDateVal);
  const [settlements, setSettlements] = useState([]);
  const [areSettlementsLoading, setAreSettlementsLoading] = useState(true);
  const [noSettlementsMessage, setNoSettlementsMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchSettlements = async () => {
      setAreSettlementsLoading(true);

      const userToken = localStorage.getItem("usr_token");

      try {
        rxOneApi.setUserSecretAuthHeaders();
        const res = await rxOneApi.get(
          `${
            RX_ONE_ENDPOINTS.SETTLEMENTS.LIST_SETTLEMENTS
          }/${userToken}/${mode}/${startDate.getFullYear()}-${
            startDate.getMonth() + 1
          }-${startDate.getDate()}` +
            "/" +
            `${endDate.getFullYear()}-${
              endDate.getMonth() + 1
            }-${endDate.getDate()}`
        );

        if (res) {
          if (res.data?.message) {
            setNoSettlementsMessage(res.data.message);
            setSettlements([]);
          } else {
            setSettlements(res.data.settlements);
          }
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        if (error?.status === 401) {
          if (!document.querySelector(".toast-modal")) {
            setShowToast(true);
            setToastType("error");
            setToastMessage("Invalid session. Please login again.");
            setShouldLogout(true);
          }
        } else {
          setShowToast(true);
          setToastType("error");
          setToastMessage(error?.error?.message || error?.message);
        }
      } finally {
        setAreSettlementsLoading(false);
      }
    };

    fetchSettlements();
  }, [mode, startDate, endDate]);

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  return (
    <PageContentLayout className="pt-5">
      <h1 className="h4 p-0 text-muted mx-3" style={{ marginTop: "-40px" }}>
        Settlements
      </h1>

      <div
        className="px-3 py-1"
        style={{
          backgroundColor: "#b3c6e7",
        }}
      >
        Below settlements are for Online Payments Only. Appointments Payments
        are settled automatically after 3 days of Payment.
      </div>

      <div className="d-flex align-items-center position-relative mt-4">
        <DateRange
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>

      <RefreshDataBtn
        type="settlements"
        setData={setSettlements}
        tableDataLoading={areSettlementsLoading}
        setTableDataLoading={setAreSettlementsLoading}
        setErrorMessage={setNoSettlementsMessage}
        startDate={startDate}
        endDate={endDate}
        isRxOne={true}
      />

      <DataTable
        headRow={tableHeadRow}
        bodyRows={settlements.map(settlement => ({
          settlementId: settlement.settlement_id,
          orderAmount: settlement.order_amount,
          processingFee: settlement.processing_fee,
          settlementAmount: settlement.settlement_amount,
          amountReversed: settlement.amount_reversed,
          initiatedOn: settlement.initiated_on,
          toBeSettledOn: settlement.to_be_settled_on,
          transferStatus: (
            <button
              disabled
              className={`text-center text-capitalize w-100 fw-bolder border-2 btn btn-outline-${
                settlement.settlement_status !== "pending"
                  ? "success"
                  : "danger"
              }`}
            >
              {settlement.settlement_status === "pending" ? (
                <PendingActionsIcon className="mx-1 fw-bolder" />
              ) : (
                <TaskIcon className="mx-1 fw-bolder" />
              )}
              {settlement.settlement_status}
            </button>
          ),
          key: settlement.settlement_id,
        }))}
        noDataMessage={noSettlementsMessage}
        isLoading={areSettlementsLoading}
      />

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}
    </PageContentLayout>
  );
}

export default Settlements;
