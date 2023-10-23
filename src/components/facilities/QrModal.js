import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

import ModeContext from "../../context/mode-context";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

import headerLogoImg from "../../assets/images/logos/header-logo.png";

function QrModal(props) {
  const { type, hospitalId, qrLink, show, onHide } = props;

  const { mode } = useContext(ModeContext);

  const [isLoading, setIsLoading] = useState(true);
  const [qrCode, setQrCode] = useState(null);
  const [isPrintable, setIsPrintable] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchQrImage = async () => {
      try {
        const userKeys = localStorage.getItem("usr_keys");

        const userModeKey = JSON.parse(userKeys)[mode];
        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        const endPoint =
          type === "patient"
            ? RX_OPD_ENDPOINTS.HOSPITAL.GET_PATIENT_PORTAL_QR
            : RX_OPD_ENDPOINTS.HOSPITAL.GET_DOCTOR_PORTAL_QR;

        rxOpdApi.setAuthHeaders(key, secret);
        const qrImageRes = await rxOpdApi.get(
          endPoint + "/" + mode + "/" + hospitalId
        );

        if (qrImageRes) {
          const qrCol = document.getElementById("qr-col");
          qrCol.innerHTML =
            qrImageRes.data.patient_portal_url ||
            qrImageRes.data.doctor_portal_url
              ? ""
              : qrImageRes.data;

          setIsPrintable(
            qrImageRes.data.patient_portal_url ||
              qrImageRes.data.doctor_portal_url
              ? false
              : true
          );
          setQrCode(qrImageRes.data);
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        setShowToast(true);
        setToastType("error");
        setToastMessage(error.message);

        onHide();
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrImage();
  }, []);

  const handleQrPrint = () => {
    const qrPrintTitleDiv = document.getElementById("qr-print-title");
    const qrPrintCodeDiv = document.getElementById("qr-print-code");

    qrPrintTitleDiv.innerHTML = `<h1 class="display-4 text-center text-capitalize mt-1">${
      type === "patient" ? "Care" : "Doctor"
    } Portal QR</h1>`;
    qrPrintCodeDiv.innerHTML = qrCode;

    window.print();

    qrPrintCodeDiv.innerHTML = "";
  };

  const handleQrShare = () => {
    navigator.share({
      title: `${type === "patient" ? "Care" : "Doctor"} Portal QR`,
      url: qrLink,
    });
  };

  return (
    <>
      <Modal centered size="lg" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>QR Links</Modal.Title>
        </Modal.Header>

        <Modal.Body className="w-100 text-center p-0">
          {isLoading && (
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
            />
          )}

          <Container
            className="p-0"
            style={{ display: isLoading ? "none" : "block" }}
          >
            <Row className="justify-content-center">
              <Col xs={12} md={5}>
                <h1 className="h3 m-0 text-capitalize">
                  {type === "patient" ? "Care" : "Doctor"} Portal
                </h1>

                <a href={qrLink}>{qrLink}</a>

                <div id="qr-col"></div>

                <div className="d-flex justify-content-evenly align-items-center w-50 mx-auto">
                  {isPrintable && (
                    <PrintOutlinedIcon
                      onClick={handleQrPrint}
                      style={{ fontSize: "4rem" }}
                    />
                  )}

                  <ShareOutlinedIcon
                    onClick={handleQrShare}
                    style={{ fontSize: "3rem" }}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div id="invoice-print">
        <div className="d-flex justify-content-center w-100 m-0 p-0">
          <Image
            className="m-0 p-0"
            src={headerLogoImg}
            alt="Rx One Provider"
            style={{ height: "80px" }}
          />
        </div>

        <div id="qr-print-title"></div>

        <div id="qr-print-code"></div>
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

export default QrModal;
