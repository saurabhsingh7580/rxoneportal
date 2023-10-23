import FormControl from "../form/FormControl";

function RegistrationDocs() {
  return (
    <>
      <FormControl
        info="Upload registration certificate of Facility or In case of Individual doctor clinic. Upload Doctor’s Registration"
        label="Registration Certificate"
        type="file"
        name="uploadDocs.registrationCertificate"
      />

      <FormControl
        info="Upload Facility brand logo in transparent background. In case you don’t have a logo file. Please provide photo of current logo."
        label="Hospital Logo"
        type="file"
        name="uploadDocs.hospitalLogo"
      />
    </>
  );
}

export default RegistrationDocs;
