import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Chart from "./Chart";

function Visualizations(props) {
  const { collectionChartData, appointmentChartData } = props;

  console.log({ collectionChartData, appointmentChartData });

  // const formatData = (rawData, identifier) => {
  //   let date;
  //   let dataType;
  //   let rightVal;
  //   let total;

  //   if (identifier === "appointment") {
  //     date = "appointment_date";
  //     dataType = "appointment_type";
  //     rightVal = "In-Person";
  //     total = "total_appointments";
  //   } else {
  //     date = "order_date";
  //     dataType = "payment_mode";
  //     rightVal = "Cash";
  //     total = "collection_amount";
  //   }

  //   const labels = [...new Set(rawData.map(rawDatum => rawDatum[date]))];

  //   if (identifier !== "appointment") {
  //     // console.log({ formater: labels });
  //   }

  //   const organizedData = [];

  //   for (const label of labels) {
  //     const sameData = rawData.filter(datum => datum[date] === label);

  //     organizedData.push(sameData);
  //   }

  //   const left = [];
  //   const right = [];

  //   for (const organizedDatum of organizedData) {
  //     let lefter = 0;
  //     let righter = 0;

  //     for (const datum of organizedDatum) {
  //       if (datum[dataType] === "Online") {
  //         lefter++;
  //       } else {
  //         righter++;
  //       }
  //     }

  //     if (lefter > 0) {
  //       left.push("ONLINE");
  //     } else {
  //       left.push(NaN);
  //     }

  //     if (righter > 0) {
  //       right.push("RIGHT");
  //     } else {
  //       right.push(NaN);
  //     }
  //   }

  //   if (identifier !== "appointment") {
  //     // console.log({ old: { left, right } });
  //   }

  //   for (let i = 0; i < left.length; i++) {
  //     if (isNaN(left[i]) && typeof left[i] !== "string") {
  //       continue;
  //     }

  //     for (const rawDatum of rawData) {
  //       if (rawDatum[dataType] === "Online") {
  //         left[i] = rawDatum[total];
  //         i++;
  //       }
  //     }
  //   }

  //   for (let i = 0; i < right.length; i++) {
  //     if (isNaN(right[i]) && typeof right[i] !== "string") {
  //       continue;
  //     }

  //     for (const rawDatum of rawData) {
  //       if (rawDatum[dataType] === rightVal) {
  //         right[i] = rawDatum[total];
  //         i++;
  //       }
  //     }
  //   }
  //   return { left, right };
  // };

  // console.log({
  //   appointments: formatData(appointmentChartData, "appointment"),
  // });
  // console.log({ collections: formatData(collectionChartData, "collection") });

  // console.log({
  // appointmentChartData.sort(
  //   (a, b) =>
  //     new Date(a.appointment_date).getMilliseconds() -
  //     new Date(b.appointment_date).getMilliseconds()
  // );
  // collectionChartData.sort(
  //   (a, b) =>
  //     new Date(a.order_date.split("-").reverse().join("-")).getTime() -
  //     new Date(b.order_date.split("-").reverse().join("-")).getTime()
  // );
  // });

  return (
    <Row className="justify-content-center h-100">
      <Col xs={12} md={6}>
        <Chart
          chartTitle="Appointments"
          labels={appointmentChartData.map(
            appointment => appointment.appointment_date
          )}
          rightLabel="In-Person"
          // onlineData={appointmentChartData.map(ap => {
          //   if (ap.appointment_type === "Online") {
          //     return ap.total_appointments;
          //   } else {
          //     return 0;
          //   }
          // })}
          // rightData={appointmentChartData.map(ap => {
          //   if (ap.appointment_type === "In-Person") {
          //     return ap.total_appointments;
          //   } else {
          //     return 0;
          //   }
          // })}
          // onlineData={online}
          onlineData={appointmentChartData
            .filter(ap => ap.appointment_type === "Online")
            .map(ap => ({ x: ap.appointment_date, y: ap.total_appointments }))}
          // onlineData={formatData(appointmentChartData, "appointment").left}
          rightData={appointmentChartData
            .filter(ap => ap.appointment_type === "In-Person")
            .map(ap => ({ x: ap.appointment_date, y: ap.total_appointments }))}
          // rightData={formatData(appointmentChartData, "appointment").right}
          // rightData={
          // appointmentChartData
          // .filter(ap => ap.appointment_type === "In-Person")
          // .map(ap => ap.total_appointments)
          // .map(ap => {
          //   console.log("In-Person", { ap });
          //   if (ap.appointment_type === "In-Person") {
          //     return ap.total_appointments;
          //   } else {
          //     return NaN;
          //   }
          // })
          // right
          // }
        />
      </Col>

      <Col xs={12} md={6}>
        <Chart
          chartTitle="Collections (INR)"
          labels={collectionChartData.map(
            appointment => appointment.order_date
          )}
          rightLabel="Cash"
          // onlineData={collectionChartData.map(ap => {
          //   if (ap.payment_mode === "Online") {
          //     return ap.collection_amount;
          //   } else {
          //     return 0;
          //   }
          // })}
          // rightData={collectionChartData.map(ap => {
          //   if (ap.payment_mode === "Cash") {
          //     return ap.collection_amount;
          //   } else {
          //     return 0;
          //   }
          // })}
          onlineData={
            // formatData(collectionChartData, "collection").left
            collectionChartData
              .filter(ap => ap.payment_mode === "Online")
              .map(ap => ({ x: ap.order_date, y: ap.collection_amount }))
          }
          rightData={
            // formatData(collectionChartData, "collection").right
            collectionChartData
              .filter(ap => ap.payment_mode === "Cash")
              .map(ap => ({ x: ap.order_date, y: ap.collection_amount }))
          }
        />
      </Col>
    </Row>
  );
}

export default Visualizations;
