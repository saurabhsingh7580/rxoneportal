import { useContext, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../../context/mode-context";
import HospitalsContext from "../../../context/hospitals-context";
import AppointmentsFormContext from "../../../context/appointments-form";
import Button from "../../ui/Button";
import Toast from "../../ui/Toast";
import { rxOpdApi } from "../../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../../utils/api/apiEndPoints";

function Payment(props) {
  const { onHide } = props;

  const { currentHospital } = useContext(HospitalsContext);
  const { mode } = useContext(ModeContext);
  const {
    selectedProfile,
    selectedAppointmentType,
    selectedSlotVal,
    selectedDate,
    selectedDoc,
    bookingData,
  } = useContext(AppointmentsFormContext);

  const [paymentMode, setPaymentMode] = useState("cash");
  const [amount, setAmount] = useState("");
  const [showAmtError, setShowAmtError] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [processingOnlinePayment, setProcessingOnlinePayment] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [closeForm, setCloseForm] = useState(false);
  const [verifyingRazorpayPayment, setVerifyingRazorpayPayment] =
    useState(false);

  const { values } = useFormikContext();

  useEffect(() => {
    if (closeForm && !showToast) {
      onHide();
    }
  }, [closeForm, showToast]);

  const successfulOnlinePayment = async (razorpayRes) => {
    setVerifyingRazorpayPayment(true);

    try {
      const body = {
        razorpay_payment_id: razorpayRes.razorpay_payment_id,
        razorpay_order_id: razorpayRes.razorpay_order_id,
        razorpay_signature: razorpayRes.razorpay_signature,
        razorpay_error_code: "",
        razorpay_error_description: "",
        razorpay_error_source: "",
        razorpay_error_step: "",
        razorpay_error_reason: "",
        razorpay_error_metadata_order_id: "",
        razorpay_error_metadata_payment_id: "",
      };

      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);
      const verifyRes = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.OPD.VERIFY_ONLINE_PAYMENT +
          "/" +
          currentHospital.hos_id +
          "/" +
          bookingData.appointment_id,
        body
      );

      if (verifyRes) {
        setToastType("success");
        setToastMessage(verifyRes.data.message);
        setShowToast(true);
        setCloseForm(true);
      }
    } catch (error) {
      setToastType("error");
      setToastMessage(error.message);
      setShowToast(true);
    } finally {
      setVerifyingRazorpayPayment(false);
    }
  };

  const unsuccessfulOnlinePayment = async (razorpayErrorRes) => {
    console.log({ razorpayErrorRes });
  };

  const initiateOrder = async (paymentType) => {
    if (paymentType === "online") {
      setProcessingOnlinePayment(true);
    } else {
      if (+amount !== +selectedDoc.consult_charge) {
        setShowAmtError(true);

        return;
      }

      setShowAmtError(false);
      setConfirming(true);
    }

    try {
      const appointmentId = bookingData.appointment_id;

      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);

      const initiateOrderRes = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.OPD.INITIATE_APPOINTMENT_ORDER +
          "/" +
          currentHospital.hos_id +
          "/" +
          appointmentId +
          "/" +
          paymentType
      );

      if (initiateOrderRes) {
        if (paymentType === "online") {
          await processRazorpayPayment(initiateOrderRes.data.razorpay_order_id);
        } else {
          handleConfirm();
        }
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);

      if (paymentType === "online") {
        setProcessingOnlinePayment(false);
      } else {
        setConfirming(false);
      }
    }
  };

  const processRazorpayPayment = async (razorpayOrderId) => {
    try {
      const razorpayKey =
        mode === "live" ? "rzp_live_Uy4jKL7ZDdslqp" : "rzp_test_BTj030BoE9feLH";
      const appointmentId = bookingData.appointment_id;

      const options = {
        key: razorpayKey, // Enter the Key ID generated from the Dashboard
        amount: selectedDoc.consult_charge * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: selectedDoc.currency,
        name: currentHospital.hosp_name,
        description: "Appointment Booking",
        image:
          process.env.REACT_APP_RX_OPD +
          (mode === "test" ? "test/" : "") +
          RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_LOGO +
          "/" +
          currentHospital.hos_id +
          "?v=" +
          Math.random() * Math.random(),
        order_id: razorpayOrderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        prefill: {
          name: selectedProfile.name,
          email: selectedProfile.email,
          contact: "91" + values.patientDetails.contactNo,
        },
        notes: {
          reciept: appointmentId,
        },
        theme: {
          color: "#a5d6a7",
        },
        handler: successfulOnlinePayment,
        modal: {
          ondismiss: function () {
            setToastType("info");
            setToastMessage("Payment cancelled by the user.");
            setShowToast(true);
          },
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", unsuccessfulOnlinePayment);

      rzp1.open();
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setProcessingOnlinePayment(false);
    }
  };

  const handleConfirm = async () => {
    try {
      const appointmentId = bookingData.appointment_id;

      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);
      const confirmRes = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.OPD.CONFIRM_CASH_PAYMENT +
          "/" +
          appointmentId,
        {
          payment_mode: paymentMode,
          amount_paid: +amount,
          currency: selectedDoc.currency,
        }
      );

      if (confirmRes) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(confirmRes.data.message);
        setCloseForm(true);
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(error.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="text-center w-100">
      <p className="mb-1">
        Booking for:{" "}
        <span className="text-decoration-underline fw-bold text-capitalize">
          {selectedProfile.name}
        </span>
      </p>
      <p className="mb-1">
        <span className="text-decoration-underline fw-bold text-capitalize">
          {selectedAppointmentType}
        </span>{" "}
        Appointment at{" "}
        <span className="text-decoration-underline fw-bold text-capitalize">
          {selectedSlotVal}
        </span>{" "}
        (
        <span className="text-decoration-underline fw-bold text-capitalize">
          {selectedDate.toDateString()}
        </span>
        )
      </p>
      <p className="mb-1">
        With{" "}
        <span className="text-decoration-underline fw-bold text-capitalize">
          {(selectedDoc.firstname + " " + selectedDoc.lastname).trim()}
        </span>
      </p>
      <p className="my-2">
        Amount Due: ₹
        <span className="fw-bold text-capitalize">
          {selectedDoc.consult_charge}
        </span>
      </p>
      <Button
        id="rzp-button1"
        className="w-100 mt-3 rounded-3"
        onClick={() => initiateOrder("online")}
        disabled={confirming || processingOnlinePayment}
      >
        {processingOnlinePayment ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mx-auto"
          />
        ) : (
          "Online Payment"
        )}
      </Button>
      {selectedAppointmentType !== "online" && (
        <div>
          <p className="my-3">Or</p>
          <p>Confirm Cash/Card (Direct) Payment</p>
          <select
            defaultValue="cash"
            onChange={(event) => {
              setPaymentMode(event.target.value);
            }}
            style={{
              border: "2px solid #b3c6e7",
              borderRadius: "0",
              padding: "6.5px",
              margin: "0",
            }}
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Debit/Credit Card</option>
            <option value="wallet">Wallet</option>
          </select>
          <input
            type="text"
            className="mx-2 px-2 mt-3 mt-md-0"
            placeholder="Amount Paid (INR)"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <small className="text-danger d-block w-100 text-center">
            {showAmtError
              ? "Entered amount is not equal to amount due."
              : "   "}
          </small>
          <Button
            className="w-100 my-3 rounded-3"
            onClick={() => initiateOrder("cash")}
            disabled={confirming || processingOnlinePayment}
          >
            {confirming ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mx-auto"
              />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      )}

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}

      {verifyingRazorpayPayment && (
        <div className="whole-screen-backdrop d-flex justify-content-center align-items-center">
          <div className="text-white">
            <Spinner
              as="span"
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
              className="m-auto text-white fs-1 d-block"
            />

            <p className="fs-4">Verifying Payment...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
