import FormControl from "../form/FormControl";

function ContactInfo(props) {
  const { isMainDataSaved, areDocsSubmitted } = props;

  return (
    <>
      <FormControl
        info="Enter Contact Name of the Facility Owner"
        label="Contact Name"
        type="text"
        name="contact.name"
        disabled={areDocsSubmitted}
        // disabled={isMainDataSaved}
      />

      <FormControl
        info="Enter Contact Number for the Facility Owner"
        label="Contact Number"
        type="tel"
        name="contact.number"
        disabled={areDocsSubmitted}
        // disabled={isMainDataSaved}
      />

      <FormControl
        info="Enter Contact Email for the Facility Owner"
        label="Contact Email"
        type="email"
        name="contact.email"
        disabled={areDocsSubmitted}
        // disabled={isMainDataSaved}
      />
    </>
  );
}

export default ContactInfo;
