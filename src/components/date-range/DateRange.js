import DatePicker from "react-datepicker";

function DateRange(props) {
  const { startDate, setStartDate, endDate, setEndDate } = props;

  return (
    <>
      <p className="w-auto h-100 my-0">Select Range: </p>

      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        selectsStart
        startDate={startDate}
        placeholderText="Start Date"
        endDate={endDate}
        maxDate={endDate}
        wrapperClassName="mx-2 w-auto"
        className="w-100"

        // calendarContainer="w-25"
      />

      <DatePicker
        selected={endDate}
        onChange={date => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        // maxDate={new Date()}
        placeholderText="End Date"
        wrapperClassName="mx-2 w-auto"
        className="w-100"
        // calendarContainer="w-25"
      />
    </>
  );
}

export default DateRange;
