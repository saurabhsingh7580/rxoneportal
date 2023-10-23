import { useContext, useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddBusinessSharpIcon from "@mui/icons-material/AddBusinessSharp";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import PaymentsContext from "../../context/payments-context";
import SelectHospital from "../hospitals/SelectHospital";
import AmountPaidInput from "./AmountPaidInput";
import RefreshDataBtn from "../refresh-data/RefreshDataBtn";
import DataTable from "../ui/DataTable";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const tableHeadRow = [
  "Appointment Date",
  "Doctor Name",
  "Patient Name",
  "Consultation Charges",
  "Consultation Type",
  "Payment Mode",
  "Amount Paid",
  "Confirm Payment",
];

function PaymentsTab(props) {
  // const { pays, setPays, arePaysLoading, setIsPaymentBeingConfirmed } = props;

  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading } = useContext(HospitalsContext);
  const { paysCount } = useContext(PaymentsContext);

  const [pays, setPays] = useState([]);
  const [arePaysLoading, setArePaysLoading] = useState(true);
  const [isPaymentBeingConfirmed, setIsPaymentBeingConfirmed] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showUpdatedPaymentsMsg, setShowUpdatedPaymentsMsg] = useState(false);

  const fetchPaymentsData = async () => {
    setArePaysLoading(true);

    const userModeKey = JSON.parse(localStorage.getItem("usr_keys"))[mode];
    const key = userModeKey[`${mode}_key`];
    const secret = userModeKey[`${mode}_secret`];

    try {
      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.get(
        RX_OPD_ENDPOINTS.HOSPITAL.OPD.LIST_UNPAID_CASH_ORDERS +
          "/" +
          currentHospital.hos_id
      );

      if (res) {
        setPays(res.data.cash_orders);
      } else {
        setPays([]);
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setArePaysLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && currentHospital) {
      fetchPaymentsData();
    }

    if (!isLoading && !currentHospital) {
      setArePaysLoading(false);
    }
  }, [currentHospital, isLoading]);

  useEffect(() => {
    if (!arePaysLoading) {
      if (paysCount > pays.length) {
        setShowUpdatedPaymentsMsg(true);
      } else {
        setShowUpdatedPaymentsMsg(false);
      }
    }
  }, [paysCount, arePaysLoading]);

  const removeSpinnerRemoveDisabled = () => {
    const loadingSpinnerSpanAlll = document.querySelectorAll(".spinnerSpan");
    const amountPaidInputAlll = document.querySelectorAll(".amount-paid-input");

    for (const loadingSpinnerSpan of loadingSpinnerSpanAlll) {
      loadingSpinnerSpan?.remove();
    }
    for (const amountPaidIp of amountPaidInputAlll) {
      amountPaidIp?.removeAttribute("disabled");
    }
  };

  const handleConfirm = async (appointmentId, currency, amountDue) => {
    const loadingSpinnerSpanAll = document.querySelectorAll(".spinnerSpan");

    if (loadingSpinnerSpanAll.length > 0) return;

    setIsPaymentBeingConfirmed(true);

    const amountPaidInput = document.getElementById(appointmentId);
    const errorMessageSmallAll = document.querySelectorAll(".paymentAmountIp");

    for (const errorMessageSmall of errorMessageSmallAll) {
      errorMessageSmall?.remove();
    }

    removeSpinnerRemoveDisabled();

    if (+amountPaidInput.value !== amountDue) {
      const resMessageSmall = document.createElement("small");
      resMessageSmall.className =
        "d-block text-nowrap text-danger text-end h-100 form-text paymentAmountIp";

      if (amountPaidInput.value === "") {
        resMessageSmall.innerHTML = "Please enter the amount";
      } else {
        resMessageSmall.innerHTML =
          "Amount must be equal to the consultation charges.";
      }

      amountPaidInput.focus();
      amountPaidInput.insertAdjacentElement("afterend", resMessageSmall);

      return;
    }

    const spinnerSpan = document.createElement("span");
    spinnerSpan.ariaHidden = "true";
    spinnerSpan.setAttribute("role", "status");
    spinnerSpan.classList = "spinner-border spinner-border-sm mx-3 spinnerSpan";
    amountPaidInput.insertAdjacentElement("afterend", spinnerSpan);

    const amountPaidInputAll = document.querySelectorAll(".amount-paid-input");
    for (const amountPaidIp of amountPaidInputAll) {
      amountPaidIp.setAttribute("disabled", "true");
    }

    try {
      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.OPD.CONFIRM_CASH_PAYMENT +
          "/" +
          appointmentId,
        {
          amount_paid: +amountPaidInput.value,
          currency: currency,
          payment_mode: paymentMode,
        }
      );

      if (res) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(res.data.message);

        removeSpinnerRemoveDisabled();

        setPays(prevPayments => {
          const arr = [...prevPayments];

          const idx = arr.findIndex(
            pay => pay.appointment_id === appointmentId
          );

          arr.splice(idx, 1);

          return arr;
        });
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);

      removeSpinnerRemoveDisabled();
    } finally {
      setIsPaymentBeingConfirmed(false);
    }
  };

  return (
    <>
      <div
        className="my-4 px-3 py-1"
        style={{
          backgroundColor: "#b3c6e7",
        }}
      >
        Confirm Cash Payment for In-Person Appointments
      </div>

      {showUpdatedPaymentsMsg && !arePaysLoading && (
        <div className="alert alert-info" role="alert">
          New payments available. Please refresh the table to fetch new payments
        </div>
      )}

      <div className="px-2 mb-2 mb-md-0">
        <SelectHospital type="payments" />
      </div>

      <RefreshDataBtn
        type="payments"
        setData={setPays}
        tableDataLoading={arePaysLoading}
        setTableDataLoading={setArePaysLoading}
        setErrorMessage="No Payments Data Found"
      />

      <DataTable
        headRow={tableHeadRow}
        bodyRows={pays.map(order => ({
          appointmentDate: (
            <>
              <div>{order.appointment_date}</div>
              <div>{order.appointment_time.replace(".", ":")}</div>
            </>
          ),
          doctorName: order.doctor,
          patientName: order.patient,
          consultationCharges: order.currency + " " + order.amount_due,
          consultationType: (
            <button
              disabled
              className="fw-bold border-2 w-100 btn btn-tigerlily"
            >
              <AddBusinessSharpIcon className="mx-1 fw-bolder" /> In-Person
            </button>
          ),
          paymentMode: (
            <select
              defaultValue="cash"
              onChange={event => {
                setPaymentMode(event.target.value);
              }}
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Debit/Credit Card</option>
              <option value="wallet">Wallet</option>
            </select>
          ),
          amountPaid: <AmountPaidInput id={order.appointment_id} />,
          confirmPayment: (
            <CheckCircleIcon
              role="button"
              className="confirm-btn"
              style={{ color: "#198754", fontSize: "2rem" }}
              onClick={() =>
                handleConfirm(
                  order.appointment_id,
                  order.currency,
                  order.amount_due
                )
              }
            />
          ),
          key: order.appointment_id,
        }))}
        isLoading={arePaysLoading}
        noDataMessage="No Payments Data Found"
      />

      <Toast type={toastType} show={showToast} handleToastClose={setShowToast}>
        {toastMessage}
      </Toast>
    </>
  );
}

export default PaymentsTab;
