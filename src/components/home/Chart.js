import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function Chart(props) {
  const { chartTitle, labels, onlineData, rightLabel, rightData } = props;

  // console.log({ labels, onlineData, rightLabel, rightData });

  // const [data, setData] = useState([1, 2, 1, 1]);

  // {
  //   labels: [...new Set(labels)],
  //   datasets: [
  //     {
  //       id: 1,
  //       label: "Online",
  //       data: onlineData,
  //       backgroundColor: "red",
  //       borderColor: "red",
  //     },
  //     {
  //       id: 2,
  //       label: rightLabel,
  //       data: rightData,
  //       backgroundColor: "blue",
  //       borderColor: "blue",
  //     },
  //   ],
  // }

  // console.log({ updatedLabels: [...new Set(labels)] });

  return (
    <Line
      // style={{ margin: "0 20px", minHeight: "100%" }}
      style={{
        height: "2000px",
        // widht: "100px",
        // margin: "0 20px",
      }}
      // [...new Set(labels)]
      datasetIdKey={`id_${chartTitle}`}
      data={{
        labels: [...new Set(labels)],
        datasets: [
          {
            data: onlineData,
            label: "Online",
            borderColor: "red",
            backgroundColor: "red",
          },
          {
            data: rightData,
            label: rightLabel,
            borderColor: "blue",
            backgroundColor: "blue",
          },
        ],
      }}
      width={200}
      height={150}
      options={{
        responsive: true,
        // maintainAspectRatio: false,
        scales: {
          x: {
            // type: "time",
            // time: { unit: "hour" },
            display: true,
            grid: { display: false },
            // ticks: {
            //   maxTicksLimit: 5,
            // },
            // time: { unit: "day" },
            // type: "timeseries",
          },
          y: {
            beginAtZero: true,
            // ticks: { stepSize: 2, sampleSize: 1000 },
            // alignToPixels: true,
            // max: rightLabel === "In-Person" ? 6 : 3000,
          },
        },
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            color: "#929292",
            font: {
              size: 24,
            },
          },
          legend: {
            position: "bottom",
            maxHeight: 20,
          },
        },
      }}
    />
  );
}

export default Chart;
