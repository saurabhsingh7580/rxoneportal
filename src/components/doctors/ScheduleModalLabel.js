function ScheduleModalLabel(props) {
  const { children } = props;

  return (
    <label className="col-11 col-sm-5 d-flex align-items-center justify-content-start justify-content-sm-end fw-bold py-1 schedule-modal-odd-row">
      {/* text-center text-sm-end */}
      {children}
    </label>
  );
}

export default ScheduleModalLabel;
