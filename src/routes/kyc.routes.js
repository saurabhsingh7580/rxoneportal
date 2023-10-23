import ContactInfo from "../components/kyc/ContactInfo";
import BusinessDetails from "../components/kyc/BusinessDetails";
import AccountDetails from "../components/kyc/AccountDetails";
import DocsVerification from "../components/kyc/DocsVerification";

const kycRoutes = [
  {
    path: "contact-info",
    component: <ContactInfo />,
    // component: "Contact",
    formHeading:
      "Please confirm contact details, we will reach out on below coordinate if we need any information.",
  },
  {
    path: "business-details",
    component: <BusinessDetails />,
    // component: "Contact",
    formHeading: "Please provide details of your business.",
  },
  {
    path: "account-details",
    component: <AccountDetails />,
    // component: "Contact",
    formHeading:
      "Please provide business account (Current Account) details only.",
  },
  {
    path: "documents-verification",
    component: <DocsVerification />,
    // component: "Contact",
    formHeading: "Please upload clear scanned document, to fasten your KYC.",
  },
  {
    path: "submit-form",
    component: "",
    formHeading: "By Submitting the form you agree to Terms & Conditions.",
  },
];

export default kycRoutes;
