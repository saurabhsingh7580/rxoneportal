import { useCallback, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Modal, Spinner } from "react-bootstrap";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import FacilityDetails from "./FacilityDetails";
import HospLogo from "./HospLogo";
import Button from "../ui/Button";
import Toast from "../ui/Toast";
import { rxOpdApi } from "../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";

const initialValues = {
  facilityDetails: {
    hospitalName: "",
    bedsCount: "",
    contactEmail: "",
    contactNo1: "",
    address: "",
    city: "",
    country: "",
  },
};

const validationSchema = Yup.object().shape({
  facilityDetails: Yup.object().shape({
    hospitalName: Yup.string(),
    bedsCount: Yup.string(),
    contactEmail: Yup.string().email("Invalid email format"),
    contactNo1: Yup.string()
      .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
      .label("Contact Number (1)"),
    address: Yup.string(),
    city: Yup.string(),
    country: Yup.string(),
  }),
});

function UpdateModal(props) {
  const { mode, hospitalId, show, onHide } = props;

  const [formValues, setFormValues] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isDataBeingSaved, setIsDataBeingSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [isChangeLogoClicked, setIsChangeLogoClicked] = useState(false);
  const [newFacilityLogo, setNewFacilityLogo] = useState("");
  const [facilityLogoChanging, setFacilityLogoChanging] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    process.env.REACT_APP_RX_OPD +
      (mode === "test" ? "test/" : "") +
      RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_LOGO +
      "/" +
      hospitalId
  );

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.get(
          RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL + "/" + hospitalId
        );

        if (res) {
          setFormValues({
            facilityDetails: {
              hospitalName: res.data.hosp_name,
              bedsCount: res.data.beds_count,
              contactEmail: res.data.email,
              contactNo1: res.data.phone1.substring(3),
              address: res.data.address,
              city: res.data.city,
              country: "",
            },
          });
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        setModalMessage(error.message);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [hospitalId, mode]);

  const handleFormSubmit = async values => {
    try {
      setIsDataBeingSaved(true);

      let emptyValuesCounter = 0;

      for (const field in values.facilityDetails) {
        if (values.facilityDetails[field] === "") {
          emptyValuesCounter++;
        }
      }

      if (emptyValuesCounter === 7) {
        throw new Error(
          "Please enter value for at least one of the field to update facility."
        );
      }

      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      const body = {};

      if (values.facilityDetails.hospitalName)
        body.hosp_name = values.facilityDetails.hospitalName;
      if (values.facilityDetails.contactEmail)
        body.email = values.facilityDetails.contactEmail;
      if (values.facilityDetails.country)
        body.country = values.facilityDetails.country;
      if (values.facilityDetails.city) body.city = values.facilityDetails.city;
      if (values.facilityDetails.bedsCount)
        body.beds_count = values.facilityDetails.bedsCount.toString();
      if (values.facilityDetails.contactNo1)
        body.phone1 = "+91" + values.facilityDetails.contactNo1;
      if (values.facilityDetails.address)
        body.address = values.facilityDetails.address;

      rxOpdApi.setAuthHeaders(key, secret);
      const res = await rxOpdApi.put(
        RX_OPD_ENDPOINTS.HOSPITAL.UPDATE_HOSPITAL + "/" + hospitalId,
        body
      );

      if (res) {
        setModalMessage(res.data.message);
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setToastType("error");
      setShowToast(true);
      setToastMessage(error.message);
    } finally {
      setIsDataBeingSaved(false);
    }
  };

  const handleHide = () => {
    setModalMessage(null);
    setImgSrc("");
    onHide();
  };

  const handleFacilityLogoChange = async () => {
    if (!newFacilityLogo) {
      return;
    }

    setFacilityLogoChanging(true);

    try {
      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      const fileFormData = new FormData();
      fileFormData.append("image", newFacilityLogo);

      rxOpdApi.setAuthHeaders(key, secret);
      rxOpdApi.setMultipartHeaders();
      const changeFacilityLogoRes = await rxOpdApi.put(
        RX_OPD_ENDPOINTS.HOSPITAL.CHANGE_HOSPITAL_LOGO + "/" + hospitalId,
        fileFormData
      );

      if (changeFacilityLogoRes) {
        setToastType("success");
        setShowToast(true);
        setToastMessage(changeFacilityLogoRes.data.message);
        setIsChangeLogoClicked(false);
        setImgSrc(
          process.env.REACT_APP_RX_OPD +
            (mode === "test" ? "test/" : "") +
            RX_OPD_ENDPOINTS.HOSPITAL.GET_HOSPITAL_LOGO +
            "/" +
            hospitalId
        );

        const reader = new FileReader();
        reader.readAsDataURL(newFacilityLogo);
        reader.onload = event => setImgSrc(event.target.result.toString());

        // fetchHospLogo();
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setToastType("error");
      setShowToast(true);
      setToastMessage(error.message);
    } finally {
      setFacilityLogoChanging(false);
    }
  };

  return (
    <Modal
      show={show}
      // onHide={onHide}
      size="lg"
      aria-labelledby="custom-modal"
      centered
      // dialogClassName="d-flex justify-content-center px-5"
      // contentClassName="align-items-center justify-content-around text-muted w-75 px-5"
      contentClassName="border-0"
    >
      <Modal.Header
        closeButton
        className="border-0 fs-5 text-white"
        style={{ backgroundColor: "#00b0f0" }}
        onHide={handleHide}
      >
        Provide the details to be updated for selected Facility.
      </Modal.Header>

      {!modalMessage && !isDataLoading ? (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          <Modal.Body
            as={Form}
            className="container-fluid w-75 custom-form facility-update-form"
          >
            <div className={`my-2 my-md-1 row align-items-center my-2`}>
              <label className="px-0 pe-md-3 col-10 col-md-4 d-flex justify-content-start justify-content-md-end align-items-center text-md-end">
                Facility Logo
              </label>

              {isChangeLogoClicked ? (
                <>
                  <div className="col-12 col-md-8 d-flex justify-content-between mx-0 p-0 my-2 m-md-0">
                    <div
                      className={`file-ip-div px-0 w-100`}
                      style={{ padding: "1px 0" }}
                    >
                      <input
                        name="facility-logo"
                        type="file"
                        onChange={event =>
                          setNewFacilityLogo(event.currentTarget.files[0])
                        }
                        style={{ marginLeft: "-18px" }}
                      />{" "}
                      <span className="upload-icon">
                        <FileUploadOutlinedIcon fontSize="large" />
                      </span>
                    </div>
                  </div>

                  <div className="col-12 col-md-12 d-flex p-0 m-0 my-md-2 justify-content-between justify-content-md-end ps-md-3">
                    <Button
                      disabled={facilityLogoChanging}
                      className="p-0 fs-6 mx-md-2"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid primary",
                        color: "black",
                      }}
                      onClick={() => setIsChangeLogoClicked(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      disabled={facilityLogoChanging}
                      className="p-0 fs-6 ms-md-2"
                      onClick={handleFacilityLogoChange}
                    >
                      {facilityLogoChanging ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="mx-3"
                        />
                      ) : (
                        "Change"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="col-12 col-md-8 my-3 my-md-0">
                  <div id="hosp-logo-wrapper" className="d-inline">
                    <HospLogo src={imgSrc} />
                  </div>

                  <Button onClick={() => setIsChangeLogoClicked(true)}>
                    Change Logo
                  </Button>
                </div>
              )}
            </div>

            <FacilityDetails type="update" />

            <div className="row justify-content-end mt-3">
              <div className="d-flex justify-content-end mx-0 px-0">
                <Button
                  disabled={isDataBeingSaved}
                  className="mx-3"
                  onClick={() => onHide()}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid primary",
                    color: "black",
                  }}
                >
                  Cancel
                </Button>

                <Button disabled={isDataBeingSaved} type="submit">
                  {isDataBeingSaved ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="mx-3"
                    />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Formik>
      ) : (
        !isDataLoading && (
          <Modal.Body className="text-center fs-3">{modalMessage}</Modal.Body>
        )
      )}

      {isDataLoading && (
        <Modal.Body className="text-center">
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
            className="mx-3"
          />
        </Modal.Body>
      )}

      {showToast && (
        <Toast
          type={toastType}
          show={showToast}
          handleToastClose={setShowToast}
          // autohide={true}
          // autohideDelay={3000}
        >
          {toastMessage}
        </Toast>
      )}
    </Modal>
  );
}

export default UpdateModal;
