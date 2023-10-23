// import { useEffect, useState } from "react";
import { useFormikContext, Field } from "formik";
// import { Spinner } from "react-bootstrap";

const getTimeUnitInFormat = (timeUnit) => {
  let time = "";

  if (timeUnit.toString().length === 1) {
    time = "0" + timeUnit;
  } else {
    time = timeUnit.toString();
  }

  return time;
};

const timeOptions = [];

let hours = 0;
let mins = 0;

while (hours <= 23 && mins !== 59) {
  // let time=hours+"."+mins
  let time = "";

  time = getTimeUnitInFormat(hours) + ":" + getTimeUnitInFormat(mins);

  mins += 30;

  timeOptions.push(time);

  if (mins >= 59) {
    mins = 0;
    hours++;
  }
}

function ScheduleModalSelect(props) {
  const { type, name } = props;

  // const [timeOptions, setTimeOptions] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  // const formik = useFormikContext();

  // useEffect(() => {
  //   const slotDurationField = document.querySelector(
  //     `select[name="${type}.slotDuration"]`
  //   );

  //   let hours = 0;
  //   let mins = 0;

  //   // console.log({ le: hours.toString().length });

  //   while (hours <= 23 && mins !== 59) {
  //     // let time=hours+"."+mins
  //     let time = "";

  //     time = getTimeUnitInFormat(hours) + ":" + getTimeUnitInFormat(mins);

  //     mins += +formik.values[type].slotDuration;

  //     console.log({ time, hours, mins });

  //     if (mins >= 59) {
  //       mins = 0;
  //       hours++;
  //     }
  //   }

  //   setIsLoading(false);
  // }, [type, name, formik.values[type].slotDuration]);

  // !isLoading?
  return (
    <Field as="select" name={name} className="w-auto border-0">
      {/* <option value="09.00">9:00</option>
      <option value="09.30">9:30</option>
      <option value="10.00">10:00</option>
      <option value="10.30">10:30</option>
      <option value="17.30">17:30</option>
      <option value="18.00">18:00</option> */}
      {timeOptions.map((timeOption) => (
        <option key={timeOption} value={timeOption.replace(":", ".")}>
          {timeOption}
        </option>
      ))}
    </Field>
  );
  // : (
  //   <Spinner
  //     as="span"
  //     animation="border"
  //     size="sm"
  //     role="status"
  //     aria-hidden="true"
  //     className="mx-3"
  //   />
  // );
}

export default ScheduleModalSelect;
