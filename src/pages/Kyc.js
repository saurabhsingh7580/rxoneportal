import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

import AuthContext from "../context/auth-context";
import PageContentLayout from "../components/page-content/PageContentLayout";
import Form from "../components/form/Form";
import ContactInfo from "../components/kyc/ContactInfo";
import BusinessDetails from "../components/kyc/BusinessDetails";
import AccountDetails from "../components/kyc/AccountDetails";
import DocsVerification from "../components/kyc/DocsVerification";
import Toast from "../components/ui/Toast";
import { rxOneApi } from "../utils/api/api";
import { RX_ONE_ENDPOINTS } from "../utils/api/apiEndPoints";

const contactDetailsSchema = Yup.object().shape({
  name: Yup.string().required("Contact Name is required"),
  number: Yup.string()
    .required("Contact Number is required")
    .matches(/^[6-9]\d{9}$/gi, "Invalid phone number")
    .label("Contact Number"),
  email: Yup.string()
    .required("Contact Email is required")
    .email("Invalid email format"),
});

const individualBusinessSchema = Yup.object().shape({
  business_type: Yup.mixed().required("Select one of the Business Type"),
  name: Yup.string().required("Facility Name is required"),
  businessPanNo: Yup.string().required("Individual PAN No. is required"),
  ownerName: Yup.string().required("Owner Name is required"),
  businessAddress: Yup.string().required("Contact Address is required"),
  pinCode: Yup.string()
    .required("Pin Code is required")
    .length(6)
    .label("Pin Code"),
});

const registeredFacilitySchema = Yup.object().shape({
  business_type: Yup.mixed().required("Select one of the Business Type"),
  name: Yup.string().required("Business/Facility Name is required"),
  businessPanNo: Yup.string().required("Business PAN No. is required"),
  cin: Yup.string(),
  authorizedSignatory: Yup.string().required(
    "Authorizes Signatory is required"
  ),
  signatoryPanNo: Yup.string().required("Signatory PAN No. is required"),
  ownerName: Yup.string().required("Owner Name is required"),
  businessAddress: Yup.string().required("Business Address is required"),
  pinCode: Yup.string()
    .required("Pin Code is required")
    .length(6)
    .label("Pin Code"),
});

const accountSchema = Yup.object().shape({
  beneficiaryName: Yup.string().required("Beneficiary Name is required"),
  branchIfscCode: Yup.string().required("Branch IFSC Code is required"),
  accountNumber: Yup.string().required("Account Number is required"),
  // account no field: password field
  reEnterAccNumber: Yup.string()
    .oneOf([Yup.ref("accountNumber"), ""], "Account Numbers must match")
    .required("This field is required"),
});

const docsVerificationSchema = Yup.object().shape({
  business_pan_card: Yup.mixed().required("Business PAN Card is required"),
  incorp_certificate: Yup.mixed().required(
    "Certificate of Incorporation is required"
  ),
  sign_id_type: Yup.mixed().required("Select one of the Signatory ID Type"),
  authorized_sign_id: Yup.mixed().required("Signatory ID is required"),
});

const individualValidationSchema = Yup.object().shape({
  contact: contactDetailsSchema,
  business: individualBusinessSchema,
  account: accountSchema,
  docsVerification: docsVerificationSchema,

  // change Business to Facility
  // business: Yup.object().shape({
  //   business_type: Yup.mixed().required("Select one of the Business Type"),
  //   name: Yup.string().required("Name is required"),
  //   businessPanNo: Yup.string().required("PAN No. is required"),
  //   // .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid Pan Card Number"),
  //   cin: Yup.string().required("CIN is required"),
  //   type: Yup.string().required("Business Type is required"),
  //   authorizedSignatory: Yup.string().required(
  //     "Authorizes Signatory is required"
  //   ),
  //   signatoryPanNo: Yup.string().required("Signatory PAN No. is required"),
  //   businessAddress: Yup.string().required("Business Address is required"),
  //   // address: max chars: 100
  //   pinCode: Yup.string()
  //     .required("Pin Code is required")
  //     .length(6)
  //     .label("Pin Code"),
  // }),
});

const registeredValidationSchema = Yup.object().shape({
  contact: contactDetailsSchema,
  business: registeredFacilitySchema,
  account: accountSchema,
  docsVerification: docsVerificationSchema,
});

function Kyc(props) {
  const { logout } = useContext(AuthContext);

  const [shouldLogout, setShouldLogout] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldDisableKyc, setShouldDisableKyc] = useState(false);
  const [validationSchema, setValidationSchema] = useState(
    individualValidationSchema
  );
  const [businessType, setBusinessType] = useState({
    label: "Individual",
    value: "individual",
  });
  const [formNavItems, setFormNavItems] = useState([
    {
      label: "Contact Info",
      identifier: "contact",
      isActive: true,
      // element: <ContactInfo />,
      element: ContactInfo,
      elementWrapperClassName: "",
      formHeading:
        "Please confirm contact details, we will reach out on below coordinate if we need any information.",
    },
    {
      label: "Business Details",
      identifier: "business",
      isActive: false,
      // element: <BusinessDetails />,
      element: BusinessDetails,
      elementWrapperClassName: "",
      elementProps: { businessType, setBusinessType },
      formHeading: "Please provide details of your business.",
    },
    {
      label: "Account Details",
      identifier: "account",
      isActive: false,
      // element: <AccountDetails />,
      element: AccountDetails,
      elementWrapperClassName: "",
      formHeading:
        "Please provide business account (Current Account) details only.",
    },
    {
      label: "Documents Verification",
      identifier: "docsVerification",
      isActive: false,
      // element: <DocsVerification />,
      element: DocsVerification,
      elementWrapperClassName: "",
      formHeading: "Please upload clear scanned document, to fasten your KYC.",
    },
  ]);
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const fetchUserKycData = async () => {
      const userToken = localStorage.getItem("usr_token");

      try {
        rxOneApi.setUserSecretAuthHeaders();

        const kycStatusRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.KYC_STATUS + "/" + userToken
        );
        const contactInfoRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.KYC_FORM_CONTACT_INFO + "/" + userToken
        );
        const businessDetailsRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.KYC_FORM_BUSINESS_DETAILS + "/" + userToken
        );
        const accountDetailsRes = await rxOneApi.get(
          RX_ONE_ENDPOINTS.USER.KYC_FORM_ACCOUNT_DETAILS + "/" + userToken
        );

        setShouldDisableKyc(kycStatusRes.data.document_submitted);

        setFormValues({
          contact: {
            name: contactInfoRes.data["Contact Name"] || "",
            number: contactInfoRes.data["Contact Number"].substring(3) || "",
            email: contactInfoRes.data["Contact Email"] || "",
          },

          business: {
            business_type: { label: "Individual", value: "individual" },
            name:
              businessDetailsRes.data["Business Details"].business_name || "",
            businessPanNo:
              businessDetailsRes.data["Business Details"].business_pan_number ||
              "",
            ownerName: contactInfoRes.data["Contact Name"] || "",
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

          docsVerification: {
            business_pan_card: "",
            incorp_certificate: "",
            sign_id_type: "",
            authorized_sign_id: "",
          },
        });
      } catch (error) {
        setShowToast(true);
        setToastType("error");

        if (error?.status === 401) {
          setToastMessage("Invalid session. Please login again.");
          setShouldLogout(true);
        } else {
          setToastMessage(error?.error?.message || error?.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserKycData();
  }, []);

  useEffect(() => {
    if (shouldLogout && !showToast) {
      logout();
    }
  }, [shouldLogout, showToast]);

  const handleSaveBtnClick = async (values, itemNumber) => {
    const userToken = localStorage.getItem("usr_token");

    let endPoint;
    let body;

    try {
      switch (itemNumber) {
        case 1:
          endPoint = RX_ONE_ENDPOINTS.USER.KYC_FORM_CONTACT_INFO;
          const name = values.name.split(" ");
          body = {
            firstname: name[0],
            lastname: name[1],
            email: values.email,
            phone: "+91" + values.number,
          };
          break;

        case 2:
          endPoint = RX_ONE_ENDPOINTS.USER.KYC_FORM_BUSINESS_DETAILS;
          body = {
            business_name: values.name,
            business_pan_number: values.businessPanNo,
            business_cin:
              businessType.value !== "individual" ? values.cin : "NA",
            business_type: values.business_type.value,
            business_description: "",
            authorized_signatory:
              businessType.value === "individual"
                ? values.name
                : values.authorizedSignatory,
            authorized_signatory_pan_number:
              businessType.value === "individual"
                ? values.businessPanNo
                : values.signatoryPanNo,
            business_address: values.businessAddress,
            pin_code: values.pinCode,
          };
          break;

        case 3:
          endPoint = RX_ONE_ENDPOINTS.USER.KYC_FORM_ACCOUNT_DETAILS;
          body = {
            beneficiary_name: values.beneficiaryName,
            branch_ifsc_code: values.branchIfscCode,
            account_number: values.accountNumber,
          };
          break;

        case 4:
          break;

        default:
          throw new Error("Invalid path.");
      }

      rxOneApi.setUserSecretAuthHeaders();
      const res = await rxOneApi.put(endPoint + "/" + userToken, body,false,true);

      if (res) {
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");

      if (error?.status === 401) {
        setToastMessage("Invalid session. Please login again.");
        setShouldLogout(true);
        return { logout: true };
      } else {
        setToastMessage(error?.error?.message || error?.message);
        return {
          success: false,
          message: error?.error?.message || error?.message,
        };
      }
    }
  };

  const handleSubmit = async values => {
    try {
      const userToken = localStorage.getItem("usr_token");

      rxOneApi.setUserSecretAuthHeaders();
      const res = await rxOneApi.post(
        RX_ONE_ENDPOINTS.USER.KYC_SUBMIT + "/" + userToken, values, false, true
      );

      if (res) {
        return { success: true, message: res.data.message };
      } else {
        throw new Error("Something went wrong. Please try later.");
      }
    } catch (error) {
      setShowToast(true);
      setToastType("error");

      if (error?.status === 401) {
        setToastMessage("Invalid session. Please login again.");
        setShouldLogout(true);
        return { logout: true };
      } else {
        setToastMessage(error?.error?.message || error?.message);
        return {
          success: false,
          message: error?.error?.message || error?.message,
        };
      }
    }
  };

  useEffect(() => {
    if (businessType.value === "individual") {
      setValidationSchema(individualValidationSchema);
    } else {
      setValidationSchema(registeredValidationSchema);
    }
  }, [businessType]);

  return (
    <>
      <PageContentLayout className="pt-4">
        <Form
          // startItemNumber
          type="KYC"
          initialValues={formValues}
          validationSchema={validationSchema}
          formNavItems={formNavItems}
          setFormNavItems={setFormNavItems}
          onSaveBtnClick={handleSaveBtnClick}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          areDocsSubmitted={shouldDisableKyc}
          redirectUrl="/app/home"
        />
      </PageContentLayout>

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
    </>
  );
}

export default Kyc;
