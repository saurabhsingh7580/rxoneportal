import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Spinner from "react-bootstrap/Spinner";

import kycRoutes from "../../routes/kyc.routes";
import PageContentRoutes from "../../utils/app-content-routes";
import Button from "../../components/ui/Button";
import { RX_ONE_ENDPOINTS } from "../../utils/api/apiEndPoints";
import { rxOneApi } from "../../utils/api/api";

// if status is submitted, then disable save and save & next btns.

const validationSchema = Yup.object().shape({
  contact: Yup.object().shape({
    name: Yup.string().required("Contact Name is required"),
    number: Yup.string()
      .required("Contact Number is required")
      .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
      .label("Contact Number"),
    email: Yup.string()
      .required("Contact Email is required")
      .email("Invalid email format"),
  }),

  // change Business to Facility
  business: Yup.object().shape({
    name: Yup.string().required("Business Name is required"),
    businessPanNo: Yup.string().required("Business PAN No. is required"),
    // .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid Pan Card Number"),
    cin: Yup.string().required("CIN is required"),
    type: Yup.string().required("Business Type is required"),
    authorizedSignatory: Yup.string().required(
      "Authorizes Signatory is required"
    ),
    signatoryPanNo: Yup.string().required("Signatory PAN No. is required"),
    businessAddress: Yup.string().required("Business Address is required"),
    // address: max chars: 100
    pinCode: Yup.string()
      .required("Pin Code is required")
      .length(6)
      .label("Pin Code"),
  }),

  account: Yup.object().shape({
    beneficiaryName: Yup.string().required("Beneficiary Name is required"),
    branchIfscCode: Yup.string().required("Branch IFSC Code is required"),
    accountNumber: Yup.string().required("Account Number is required"),
    // account no field: password field
    reEnterAccNumber: Yup.string().required("This field is required"),
  }),

  business_pan_card: Yup.mixed().required("Business PAN Card is required"),
  incorp_certificate: Yup.mixed().required(
    "Certificate of Incorporation is required"
  ),
  authorized_sign_id: Yup.mixed().required("Signatory ID is required"),
});

function KycForm(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaveAndNextLoading, setIsSaveAndNextLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formHeading, setFormHeading] = useState(
    "Please confirm contact details, we will reach out on below coordinate if we need any information."
  );
  const [formValues, setFormValues] = useState(null);
  const [currentPath, setCurrentPath] = useState("contact-info");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const fetchUserKycData = async () => {
      const userToken = localStorage.getItem("usr_token");

      try {
        rxOneApi.setUserSecretAuthHeaders();
        const contactInfoRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.KYC_FORM_CONTACT_INFO + "/" + userToken
        );
        const businessDetailsRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.KYC_FORM_BUSINESS_DETAILS + "/" + userToken
        );
        const accountDetailsRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.KYC_FORM_ACCOUNT_DETAILS + "/" + userToken
        );

        setFormValues({
          contact: {
            name: contactInfoRes.data["Contact Name"] || "",
            number: contactInfoRes.data["Contact Number"].substring(3) || "",
            email: contactInfoRes.data["Contact Email"] || "",
          },

          business: {
            name:
              businessDetailsRes.data["Business Details"].business_name || "",
            businessPanNo:
              businessDetailsRes.data["Business Details"].business_pan_number ||
              "",
            cin: businessDetailsRes.data["Business Details"].business_cin || "",
            type:
              businessDetailsRes.data["Business Details"].business_type || "",
            authorizedSignatory:
              businessDetailsRes.data["Business Details"]
                .authorized_signatory || "",
            signatoryPanNo:
              businessDetailsRes.data["Business Details"]
                .authorized_signatory_pan_number || "",
            businessAddress:
              businessDetailsRes.data["Business Details"].business_address ||
              "",
            pinCode: businessDetailsRes.data["Business Details"].pin_code || "",
          },

          account: {
            beneficiaryName:
              accountDetailsRes.data["Account Details"].beneficiary_name || "",
            branchIfscCode:
              accountDetailsRes.data["Account Details"].branch_ifsc_code || "",
            accountNumber:
              accountDetailsRes.data["Account Details"].account_number || "",
            reEnterAccNumber:
              accountDetailsRes.data["Account Details"].account_number || "",
          },

          business_pan_card: "",
          incorp_certificate: "",
          authorized_sign_id: "",
        });
      } catch (error) {
        console.log("Oops! Something went wrong. Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserKycData();
  }, []);

  useEffect(() => {
    const kycPath = pathname.split("/")[3];
    const route = kycRoutes.find(route => kycPath === route.path);

    if (route) {
      setCurrentPath(route.path);
      setFormHeading(route.formHeading);
    }
  }, [pathname]);

  const handleSaveBtnClick = async formikProps => {
    setIsSaveLoading(true);

    const userToken = localStorage.getItem("usr_token");
    const { errors, values } = formikProps;
    let body = {};
    let endPoint;

    try {
      switch (currentPath) {
        case "contact-info":
          if (
            !values.contact.email ||
            !values.contact.name ||
            !values.contact.number
          ) {
            throw new Error(
              "Fill all the required fields in Contact Info form."
            );
          }

          endPoint = RX_ONE_ENDPOINTS.USER.KYC_FORM_CONTACT_INFO;
          const name = values.contact.name.split(" ");
          body = {
            firstname: name[0],
            lastname: name[1],
            email: values.contact.email,
            phone: "+91" + values.contact.number,
          };
          break;

        case "business-details":
          if (
            !values.business.name ||
            !values.business.businessPanNo ||
            !values.business.cin ||
            !values.business.type ||
            !values.business.authorizedSignatory ||
            !values.business.signatoryPanNo ||
            !values.business.businessAddress ||
            !values.business.pinCode
          ) {
            throw new Error(
              "Fill all the required fields in Business Details form."
            );
          }

          endPoint = RX_ONE_ENDPOINTS.USER.KYC_FORM_BUSINESS_DETAILS;
          body = {
            business_name: values.business.name,
            business_pan_number: values.business.businessPanNo,
            business_cin: values.business.cin,
            business_type: values.business.type,
            business_description: "TEST DESCRIPTION",
            authorized_signatory: values.business.authorizedSignatory,
            authorized_signatory_pan_number: values.business.signatoryPanNo,
            business_address: values.business.businessAddress,
            pin_code: values.business.pinCode,
          };
          break;

        case "account-details":
          if (
            !values.account.accountNumber ||
            !values.account.beneficiaryName ||
            !values.account.branchIfscCode ||
            !values.account.reEnterAccNumber
          ) {
            throw new Error(
              "Fill all the required fields in Account Details form."
            );
          }

          endPoint = RX_ONE_ENDPOINTS.USER.KYC_FORM_ACCOUNT_DETAILS;
          body = {
            beneficiary_name: values.account.beneficiaryName,
            branch_ifsc_code: values.account.branchIfscCode,
            account_number: values.account.accountNumber,
          };
          break;

        case "documents-verification":
          if (
            values.business_pan_card &&
            values.incorp_certificate &&
            values.authorized_sign_id
          ) {
            const businessPanCardFormData = new FormData();
            const incorpCertificateFormData = new FormData();
            const authorizedSignIdFormData = new FormData();

            businessPanCardFormData.append(
              "business_pan_card",
              values.business_pan_card
            );
            incorpCertificateFormData.append(
              "incorp_certificate",
              values.incorp_certificate
            );
            authorizedSignIdFormData.append(
              "authorized_sign_id",
              values.authorized_sign_id
            );

            rxOneApi.setMultipartHeaders();
            rxOneApi.setUserSecretAuthHeaders();
            const businessPanCardRes = await rxOneApi.put(
              RX_ONE_ENDPOINTS.USER.KYC_DOCS_VERIFICATION_BUSINESS_PAN +
                "/" +
                userToken,
              businessPanCardFormData,
              true
            );
            const incorpCertificateRes = await rxOneApi.put(
              RX_ONE_ENDPOINTS.USER.KYC_DOCS_VERIFICATION_INCORP_CERTI +
                "/" +
                userToken,
              incorpCertificateFormData
            );
            const authorizedSignatoryIdRes = await rxOneApi.put(
              RX_ONE_ENDPOINTS.USER.KYC_DOCS_VERIFICATION_SIGNATORY_PAN +
                "/" +
                userToken,
              authorizedSignIdFormData
            );

            alert(
              businessPanCardRes.data.message +
                "\n" +
                incorpCertificateRes.data.message +
                "\n" +
                authorizedSignatoryIdRes.data.message
            );
            return true;
          } else {
            if (!values.business_pan_card) {
              formikProps.setFieldTouched("business_pan_card", true, true);
            }

            if (!values.incorp_certificate) {
              formikProps.setFieldTouched("incorp_certificate", true, true);
            }

            if (!values.authorized_sign_id) {
              formikProps.setFieldTouched("authorized_sign_id", true, true);
            }

            throw new Error("Error in Documents Verification form");
          }
          break;

        default:
          endPoint = "";
          body = {};
          console.log("Current path is invalid");
      }

      if (endPoint) {
        rxOneApi.setUserSecretAuthHeaders();
        const saveDataRes = await rxOneApi.put(
          endPoint + "/" + userToken,
          body
        );

        if (saveDataRes) {
          alert(saveDataRes.data.message);
          return true;
        } else {
          throw new Error("Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      alert("Error:\n" + error.message);
      return false;
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleSaveAndNextBtnClick = async formikProps => {
    try {
      setIsSaveAndNextLoading(true);
      const resSuccess = await handleSaveBtnClick(formikProps);

      if (resSuccess) {
        const routeIdx = kycRoutes.findIndex(
          route => currentPath === route.path
        );
        const nextPath = kycRoutes[routeIdx + 1].path;

        navigate(nextPath);
      }
    } catch (error) {
      alert("Error:\n" + error.message);
      console.log("Oops! Something went wrong. Please try again.\nError:");
    } finally {
      setIsSaveAndNextLoading(false);
    }
  };

  const handleFormSubmit = async values => {
    setIsFormSubmitting(true);
    const userToken = localStorage.getItem("usr_token");

    try {
      rxOneApi.setUserSecretAuthHeaders();
      const res = await rxOneApi.post(
        RX_ONE_ENDPOINTS.USER.KYC_SUBMIT + "/" + userToken
      );

      if (res) {
        alert(res.data.message);
        navigate("/app/home");
      } else {
        throw new Error("Something went wrong. Please try later");
      }
    } catch (error) {
      alert("Error:\n" + error.message || error);
      setIsFormSubmitting(false);
    }
  };

  return (
    <>
      <header
        className="py-3 px-2 mx-0 w-100"
        style={{ backgroundColor: "#00b0f0" }}
      >
        <h2 className="fs-6 text-white fw-normal">{formHeading}</h2>
      </header>

      {!isLoading ? (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {formikProps => {
            return (
              <Form className="d-flex flex-column justify-content-around h-100 custom-form">
                <div className="d-flex flex-column align-items-end">
                  <PageContentRoutes routes={kycRoutes} />
                </div>

                <div className="d-flex justify-content-end">
                  {currentPath === "submit-form" ? (
                    <>
                      <Button
                        className="mx-3"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid primary",
                          color: "black",
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        disabled={isFormSubmitting}
                        type="submit"
                        className="mx-3"
                      >
                        {isFormSubmitting ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-3"
                          />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        disabled={isSaveLoading}
                        className="mx-3"
                        onClick={() => {
                          handleSaveBtnClick(formikProps);
                        }}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid primary",
                          color: "black",
                        }}
                      >
                        {isSaveLoading && !isSaveAndNextLoading ? (
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

                      <Button
                        disabled={isSaveAndNextLoading}
                        onClick={() => {
                          handleSaveAndNextBtnClick(formikProps);
                        }}
                      >
                        {isSaveAndNextLoading ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mx-3"
                          />
                        ) : (
                          "Save & Next"
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <div className="d-flex align-items-center h-100">
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}

export default KycForm;
