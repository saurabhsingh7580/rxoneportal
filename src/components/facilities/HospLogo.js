function HospLogo(props) {
  const { src } = props;

  return (
    <img
      src={src}
      id="modal-hosp-logo"
      className="mx-3"
      style={{ height: "32px", width: "32px" }}
      alt="Facility"
    />
  );
}

export default HospLogo;
