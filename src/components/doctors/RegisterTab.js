import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";

import HospitalsContext from "../../context/hospitals-context";
import ModeContext from "../../context/mode-context";
import Form from "../form/Form";
import DoctorDetails from "./DoctorDetails";
import DoctorSchedule from "./DoctorSchedule";
import RegistrationDocs from "./RegistrationDocs";
import { RX_OPD_ENDPOINTS } from "../../utils/api/apiEndPoints";
import { rxOpdApi } from "../../utils/api/api";

const scheduleEndDate = new Date();
scheduleEndDate.setFullYear(scheduleEndDate.getFullYear() + 1);

const scheduleInitialValues = {
  weekdays: "",
  startTime: "09.00",
  endTime: "18.00",
  slotDuration: "10",
  scheduleEndDate,
};

const scheduleValidationSchema = Yup.object().shape({
  weekdays: Yup.array()
    .min(1, "Select at least one of the weekdays")
    .required("Weekdays is required"),
  startTime: Yup.string().required("Start Time is required"),
  endTime: Yup.string().required("End Time is required"),
  slotDuration: Yup.string().required("Slot Duration is required"),
  scheduleEndDate: Yup.date().required("End Date is required"),
});

const initialValues = {
  doctorDetails: {
    firstName: "",
    lastName: "",
    rmpNo: "",
    regYear: "",
    birthYear: "",
    degreeYear: "",
    qualification: "",
    speciality: "",
    consultCharges: "",
    onlineDiscount: "",
    email: "",
    phoneNo: "",
  },

  onlineSchedule: scheduleInitialValues,

  inPersonSchedule: scheduleInitialValues,

  uploadDocs: {
    accreditationBody: "",
    rmpRegCertificate: "",
    docProfilePic: "",
  },
};

const validationSchema = Yup.object().shape({
  doctorDetails: Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    rmpNo: Yup.string().required("RMP No. is required"),
    regYear: Yup.string().required("Reg. Year is required"),
    birthYear: Yup.string().required("Birth Year is required"),
    degreeYear: Yup.string().required("Degree Year is required"),
    qualification: Yup.string().required("Qualification is required"),
    speciality: Yup.string().required("Speciality is required"),
    consultCharges: Yup.string().required("Consult Charges is required"),
    onlineDiscount: Yup.mixed().required("Online discount is required."),
    email: Yup.string().required("Email is required"),
    phoneNo: Yup.string().required("Phone No. is required"),
  }),

  onlineSchedule: scheduleValidationSchema,

  inPersonSchedule: scheduleValidationSchema,

  uploadDocs: Yup.object().shape({
    accreditationBody: Yup.object().required("Accrediation Body is required."),
    rmpRegCertificate: Yup.mixed().required(
      "RMP Registration Certificate is required."
    ),
    docProfilePic: Yup.mixed().required("Doctor's Profile Pic is required."),
  }),
});

function RegisterTab(props) {
  const { mode } = useContext(ModeContext);
  const { currentHospital, isLoading } = useContext(HospitalsContext);

  const [formValues, setFormValues] = useState(null);
  const [formNavItems, setFormNavItems] = useState([
    {
      label: "Doctor's Details",
      identifier: "doctorDetails",
      isActive: true,
      // element: <DoctorDetails />,
      element: DoctorDetails,
      elementWrapperClassName: "",
      formHeading:
        "Provide doctor’s details. User RMP Search to fetch NMC RMP (Registered Medical Professional) Details.",
      // element: DoctorDetails,
      // elementProps: {},
    },
    {
      label: "Online Schedule",
      identifier: "onlineSchedule",
      isActive: false,
      // element: <DoctorSchedule type="onlineSchedule" />,
      element: DoctorSchedule,
      elementProps: { type: "onlineSchedule" },
      elementWrapperClassName: "",
      formHeading:
        "Create a recurring schedule (for a Time Period) for doctor for Online Consultation.",
    },
    {
      label: "In-Person Schedule",
      identifier: "inPersonSchedule",
      isActive: false,
      // element: <DoctorSchedule type="inPersonSchedule" />,
      element: DoctorSchedule,
      elementProps: { type: "inPersonSchedule" },
      elementWrapperClassName: "",
      formHeading:
        "Create a recurring schedule (for a Time Period) for doctor for In-Person (at Facility) Consultation.",
    },
    {
      label: "Upload Documents & Submit Form",
      isActive: false,
      // element: <RegistrationDocs />,
      element: RegistrationDocs,
      // elementWrapperClassName: "w-75",
      formHeading:
        "Upload required documents and submit to complete Doctor's registration.",
      // elementProps: {},
    },
  ]);
  const [doctorId, setDoctorId] = useState(null);
  const [isDocInitialValLoading, setIsDocInitialValLoading] = useState(true);
  const [isEditModeOn, setIsEditModeOn] = useState();
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("edit")) {
      const toBeEditedDocId = searchParams.get("doc_id");

      const fetchDoctorData = async () => {
        const userKeys = localStorage.getItem("usr_keys");
        const userModeKey = JSON.parse(userKeys)[mode];

        const key = userModeKey[`${mode}_key`];
        const secret = userModeKey[`${mode}_secret`];

        try {
          rxOpdApi.setAuthHeaders(key, secret);
          const res = await rxOpdApi.get(
            RX_OPD_ENDPOINTS.HOSPITAL.FETCH_A_DOCTOR +
              "/" +
              currentHospital.hos_id +
              "/" +
              toBeEditedDocId
          );
          const onlineScheduleRes = await rxOpdApi.get(
            RX_OPD_ENDPOINTS.HOSPITAL.FETCH_DOCTOR_RECURRING_SCHEDULE +
              "/" +
              currentHospital.hos_id +
              "/" +
              toBeEditedDocId +
              "/online"
          );
          const inPersonScheduleRes = await rxOpdApi.get(
            RX_OPD_ENDPOINTS.HOSPITAL.FETCH_DOCTOR_RECURRING_SCHEDULE +
              "/" +
              currentHospital.hos_id +
              "/" +
              toBeEditedDocId +
              "/in-person"
          );

          if (res && onlineScheduleRes && inPersonScheduleRes) {
            const toBeEditedDocData = res.data;
            const toBeEditedOnlineSchedule =
              Object.keys(onlineScheduleRes.data).length > 0
                ? {
                    weekdays: onlineScheduleRes.data.weekdays.map(day =>
                      day.toString()
                    ),
                    startTime: onlineScheduleRes.data.start_time,
                    endTime: onlineScheduleRes.data.end_time,
                    slotDuration: onlineScheduleRes.data.slot_duration,
                    scheduleEndDate: new Date(
                      onlineScheduleRes.data.schedule_till_date
                    ),
                  }
                : scheduleInitialValues;
            const toBeEditedInPersonSchedule =
              Object.keys(inPersonScheduleRes.data).length > 0
                ? {
                    weekdays: inPersonScheduleRes.data.weekdays.map(day =>
                      day.toString()
                    ),
                    startTime: inPersonScheduleRes.data.start_time,
                    endTime: inPersonScheduleRes.data.end_time,
                    slotDuration: inPersonScheduleRes.data.slot_duration,
                    scheduleEndDate: new Date(
                      inPersonScheduleRes.data.schedule_till_date
                    ),
                  }
                : scheduleInitialValues;

            // {
            //   weekdays: "",
            //   startTime: "09.00",
            //   endTime: "18.00",
            //   slotDuration: "10",
            //   scheduleEndDate,
            // }

            setFormValues({
              doctorDetails: {
                firstName: toBeEditedDocData.firstname,
                lastName: toBeEditedDocData.lastname,
                rmpNo: toBeEditedDocData.rmp_num,
                regYear: toBeEditedDocData.rmp_reg_year,
                birthYear: toBeEditedDocData.rmp_birth_year,
                degreeYear: toBeEditedDocData.rmp_degree_year,
                qualification: toBeEditedDocData.qualification,
                speciality: toBeEditedDocData.speciality,
                consultCharges: toBeEditedDocData.consult_charge,
                onlineDiscount: {
                  label: toBeEditedDocData.online_discount,
                  value: toBeEditedDocData.online_discount,
                },
                email: toBeEditedDocData.email,
                phoneNo: toBeEditedDocData.phone.replace("+91", ""),
              },

              onlineSchedule: toBeEditedOnlineSchedule,

              inPersonSchedule: toBeEditedInPersonSchedule,

              uploadDocs: {
                accreditationBody: "",
                rmpRegCertificate: "",
                docProfilePic: "",
              },
            });
            setDoctorId(toBeEditedDocId);
            setIsEditModeOn(true);
          } else {
            throw new Error("Something went wrong. Please try later.");
          }
        } catch (error) {
          setShowToast(true);
          setToastType("error");
          setToastMessage(error.message);
          setErrorOccurred(true);
        } finally {
          setIsDocInitialValLoading(false);
        }
      };

      fetchDoctorData();
    } else {
      setFormValues({
        doctorDetails: {
          firstName: "",
          lastName: "",
          rmpNo: "",
          regYear: "",
          birthYear: "",
          degreeYear: "",
          qualification: "",
          speciality: "",
          consultCharges: "",
          onlineDiscount: {
            label: "0",
            value: "0",
          },
          email: "",
          phoneNo: "",
        },

        onlineSchedule: scheduleInitialValues,

        inPersonSchedule: scheduleInitialValues,

        uploadDocs: {
          accreditationBody: "",
          rmpRegCertificate: "",
          docProfilePic: "",
        },
      });
      setIsDocInitialValLoading(false);
    }
  }, []);

  const handleSaveData = async (values, itemNumber) => {
    const userKeys = localStorage.getItem("usr_keys");

    if (userKeys && !isLoading) {
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      let endPoint;
      let body;
      let res;

      try {
        rxOpdApi.setAuthHeaders(key, secret);

        switch (itemNumber) {
          case 1:
            endPoint =
              RX_OPD_ENDPOINTS.HOSPITAL.REGISTER_DOCTOR +
              "/" +
              currentHospital.hos_id;
            body = {
              email: values.email,
              phone: "+91" + values.phoneNo,
              firstname: values.firstName,
              lastname: values.lastName,
              qualification: values.qualification,
              speciality: values.speciality,
              rmp_accred_by: currentHospital.hosp_accreditation_by,
              rmp_reg_year: values.regYear,
              rmp_birth_year: values.birthYear,
              rmp_degree_year: values.degreeYear,
              rmp_num: values.rmpNo,
              consult_charge: values.consultCharges,
              currency: "INR",
              online_discount: +values.onlineDiscount.value,
            };

            res = await rxOpdApi.post(endPoint, body);
            setDoctorId(res.data.doc_id);
            break;

          case 2:
          case 3:
            endPoint =
              RX_OPD_ENDPOINTS.HOSPITAL.CREATE_DOCTOR_RECURRING_SCHEDULE +
              "/" +
              currentHospital.hos_id +
              "/" +
              doctorId;
            body = {
              appointment_type: itemNumber === 2 ? "online" : "in-person",
              days_list: values.weekdays.map(val => +val),
              start_time: values.startTime,
              end_time: values.endTime,
              slot_duration: values.slotDuration,
              schedule_end_date: `${values.scheduleEndDate.getFullYear()}-${
                values.scheduleEndDate.getMonth() + 1
              }-${values.scheduleEndDate.getDate()}`,
            };
            res = await rxOpdApi.put(endPoint, body);
            break;
        }

        return { success: true, message: res.data.message };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  };

  const handleFormSubmit = async values => {
    if (!isLoading) {
      const userKeys = localStorage.getItem("usr_keys");
      const userModeKey = JSON.parse(userKeys)[mode];

      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];

      try {
        const doctorRegistrationDocsFormData = new FormData();
        doctorRegistrationDocsFormData.append(
          "registration_certificate",
          values.uploadDocs.rmpRegCertificate
        );
        doctorRegistrationDocsFormData.append(
          "profile_pic",
          values.uploadDocs.docProfilePic
        );

        rxOpdApi.setMultipartHeaders();
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.post(
          `${RX_OPD_ENDPOINTS.HOSPITAL.UPLOAD_DOCTOR_DOCS}/${
            currentHospital.hos_id
          }/${doctorId}/${values.uploadDocs.accreditationBody.value.toUpperCase()}`,
          doctorRegistrationDocsFormData
        );

        if (res) {
          return { success: true, message: res.data.message };
        } else {
          throw new Error("Something went wrong. Please try later.");
        }
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  };

  return (
    <Form
      type="Doctor's Registration"
      initialValues={formValues}
      validationSchema={validationSchema}
      formNavItems={formNavItems}
      setFormNavItems={setFormNavItems}
      onSaveBtnClick={handleSaveData}
      onSubmit={handleFormSubmit}
      isLoading={isLoading || isDocInitialValLoading}
      areDocsSubmitted={isEditModeOn}
      redirectUrl="/app/doctors/doctors"
    />
  );
}

export default RegisterTab;
