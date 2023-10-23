const doctorRoutes = [
  {
    path: "doctor-details",
    component: "Doctor's Details",
    formHeading:
      "Provide doctor’s details. User RMP Search to fetch NMC RMP (Registered Medical Professional) Details.",
  },
  {
    path: "online-schedule",
    component: "Online Schedule",
    formHeading:
      "Create a recurring schedule (for a Time Period) for doctor for Online Consultation.",
  },
  {
    path: "in-person-schedule",
    component: "In-person Schedule",
    formHeading:
      "Create a recurring schedule (for a Time Period) for doctor for In-Person (at Facility) Consultation.",
  },
  {
    path: "upload-docs",
    component: "Upload Docs & submit",
    formHeading:
      "Upload required documents and submit to complete Doctor's registration.",
  },
];

export default doctorRoutes;
