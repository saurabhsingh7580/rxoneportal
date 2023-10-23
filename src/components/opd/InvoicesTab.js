import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import download from "downloadjs";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import ModeContext from "../../context/mode-context";
import HospitalsContext from "../../context/hospitals-context";
import SelectHospital from "../hospitals/SelectHospital";
import DateRange from "../date-range/DateRange";
import RefreshDataBtn from "../refresh-data/RefreshDataBtn";
import DataTable from "../ui/DataTable";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

import rxOneLogo from "../../assets/images/logos/user-nav-logo.png";

const endDateVal = new Date();
const startDateVal = new Date();
startDateVal.setDate(endDateVal.getDate() - 2);

const tableHeadRow = [
  "Appointment Date",
  "Doctor Name",
  "Patient Name",
  "Consultation Charges",
  "Consultation Type",
  "",
];

const getYyyyMmDdDate = date => {
  const month = date.getMonth() + 1;
  const d = date.getDate();

  const mm = month.toString().length === 1 ? `0${month}` : `${month}`;
  const dd = d.toString().length === 1 ? `0${d}` : `${d}`;

  return `${dd}-${mm}-${date.getFullYear()}`;
};

function InvoicesTab(props) {
  const navigate = useNavigate();

  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading } = useContext(HospitalsContext);

  const [startDate, setStartDate] = useState(startDateVal);
  const [endDate, setEndDate] = useState(endDateVal);
  const [invoices, setInvoices] = useState([]);
  const [generatingInvoiceOrderId, setGeneratingInvoiceOrderId] =
    useState(null);
  const [isInvoiceBeingGenerated, setIsInvoiceBeingGenerated] = useState(false);
  const [noInvoicesMessage, setNoInvoicesMessage] = useState("");
  const [areInvoicesLoading, setAreInvoicesLoading] = useState(true);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!currentHospital) {
        setInvoices([]);
        setAreInvoicesLoading(false);
        return;
      }

      setAreInvoicesLoading(true);

      const userModeKey = JSON.parse(localStorage.getItem("usr_keys"))[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.OPD.LIST_INVOICES +
            "/" +
            currentHospital.hos_id +
            "/" +
            `${startDate.getFullYear()}-${
              startDate.getMonth() + 1
            }-${startDate.getDate()}` +
            "/" +
            `${endDate.getFullYear()}-${
              endDate.getMonth() + 1
            }-${endDate.getDate()}`
        );

        if (res) {
          if (res.data?.message) {
            setNoInvoicesMessage(res.data.message);
            setInvoices([]);
          } else {
            setInvoices(res.data.invoices);
          }
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
      } finally {
        setAreInvoicesLoading(false);
      }
    };

    fetchInvoices();
  }, [mode, currentHospital, startDate, endDate]);

  useEffect(() => {
    if (printInvoiceData !== null) {
      window.print();
    }

    return () => setPrintInvoiceData(null);
  }, [printInvoiceData]);

  const handleGenerateInvoice = async invoice => {
    setIsInvoiceBeingGenerated(true);
    setGeneratingInvoiceOrderId(invoice.order_id);

    try {
      const userKeys = localStorage.getItem("usr_keys");

      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      rxOpdApi.setAuthHeaders(key, secret);
      const generateInvoiceRes = await rxOpdApi.post(
        RX_OPD_ENDPOINTS.HOSPITAL.OPD.GENERATE_INVOICE +
          "/" +
          currentHospital.hos_id +
          "/" +
          invoice.order_id,
        {},
        false,
        false,
        { responseType: "blob" }
      );

      const appointmentDate = new Date(invoice.appointment_date);
      download(
        generateInvoiceRes.data,
        invoice.patient.split(" ").join("_") +
          "__" +
          getYyyyMmDdDate(appointmentDate),
        generateInvoiceRes.headers["content-type"]
      );
    } catch (error) {
      setShowToast(true);
      setToastType("error");
      setToastMessage(
        error?.message ||
          error?.error?.message ||
          "Internal error occured during Prescription PDF generation. Please contact admin."
      );
    } finally {
      setIsInvoiceBeingGenerated(false);
      setGeneratingInvoiceOrderId(null);
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
        Click on Generate Invoice, to View or Print Invoice.
      </div>

      {/* <div className="d-flex align-items-center position-relative">
        <DateRange
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div> */}

      <div className="row justify-content-around align-items-center px-2 mt-4">
        <Col xs={12} lg={4}>
          <SelectHospital type="invoices" />
        </Col>

        <Col
          xs={12}
          lg={8}
          className="d-flex mt-3 mt-lg-0 align-items-center position-relative"
        >
          <DateRange
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Col>
      </div>

      <RefreshDataBtn
        type="invoices"
        setData={setInvoices}
        tableDataLoading={areInvoicesLoading}
        setTableDataLoading={setAreInvoicesLoading}
        setErrorMessage={setNoInvoicesMessage}
        startDate={startDate}
        endDate={endDate}
      />

      <DataTable
        headRow={tableHeadRow}
        bodyRows={invoices.map(invoice => ({
          appointmentDate: (
            // invoice.time_alloted.replace(".", ":")
            <>
              <div>{invoice.appointment_date}</div>
              <div>{invoice.time_alloted.replace(".", ":")}</div>
            </>
          ),
          docName: invoice.doctor,
          patientName: invoice.patient,
          consultationCharges: invoice.amount_paid,
          consultationType: (
            <button
              disabled
              className={`text-capitalize fw-bold border-2 btn btn-${
                invoice.appointment_type !== "in_person" ? "info" : "warning"
              }`}
            >
              {invoice.appointment_type.replace("_", "-")}
            </button>
          ),
          generateInvoice: (
            <button
              className="table-btn table-update-btn"
              onClick={async () => await handleGenerateInvoice(invoice)}
              disabled={isInvoiceBeingGenerated}
            >
              {isInvoiceBeingGenerated &&
              invoice.order_id === generatingInvoiceOrderId ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="mx-3"
                />
              ) : (
                "Generate Invoice"
              )}
            </button>
          ),
          key: invoice.appointment_id,
        }))}
        noDataMessage={noInvoicesMessage}
        isLoading={areInvoicesLoading || isLoading}
      />

      <div id="invoice-print">
        {printInvoiceData && (
          <div
            className="m-5 py-5"
            style={{ position: "relative", height: "90vh" }}
          >
            <div
              className="d-flex align-items-center py-3"
              style={{ borderBottom: "1px solid black" }}
            >
              {/* <div className="row align-items-center"> */}
              <img
                className="img-fluid me-3"
                src={
                  process.env.REACT_APP_RX_OPD +
                  (mode === "test" ? "test/" : "") +
                  RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_LOGO +
                  "/" +
                  currentHospital.hos_id
                }
                alt={currentHospital.hosp_name}
                style={{ width: "80px" }}
              />

              <div>
                <h1 className="h4">{currentHospital.hosp_name}</h1>
              </div>
              {/* </div> */}
            </div>

            {/* <hr
              style={{
                color: "#a5a5a5",
                backgroundColor: "#a5a5a5",
                height: "6px",
                width: "90%",
              }}
            /> */}

            <div className="d-flex align-items-center justify-content-between fs-5 mt-2">
              <p>
                Patient Name:{" "}
                <span className="fw-bold">{printInvoiceData.patient}</span>
              </p>

              <p>
                Date:{" "}
                <span className="fw-bold">
                  {printInvoiceData.appointment_date}
                </span>
              </p>
            </div>

            <div className="w-100 text-center my-5 pt-5">
              <h2 className="h3">Invoice</h2>
            </div>

            <table className="text-center table">
              <tr>
                <th>Particulars</th>
                <th>Amount</th>
              </tr>

              <tr>
                <td>
                  Consultation Fee for Consultation with:{" "}
                  {printInvoiceData.doctor}
                </td>
                <td>₹{printInvoiceData.amount_paid}</td>
              </tr>
            </table>

            <div
              className="d-flex flex-column justify-content-center w-100 align-items-center"
              style={{ position: "absolute", bottom: "0" }}
            >
              <p style={{ borderBottom: "1px solid black" }}>
                This is a system generated invoice, it does not require physical
                signatures
              </p>

              <img src={rxOneLogo} alt="Rx One" style={{ width: "30px" }} />
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
        >
          {toastMessage}
        </Toast>
      )}
    </>
  );
}

export default InvoicesTab;
