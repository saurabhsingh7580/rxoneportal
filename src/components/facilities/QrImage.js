import { useEffect, useRef } from "react";

function QrImage(props) {
  const { type, svgData } = props;

  // const ref = useRef();

  useEffect(() => {
    // const qrCol = document.getElementById(`${type}-common-qr-col`);
    // console.log({ svgData });
    // if (svgData) {
    //   qrCol.innerHTML = svgData;
    // }
    // ref.current.innerHTML = svgData;
  }, []);

  return (
    <div
      // id={`${type}-common-qr-col`}
      // ref={ref}
      dangerouslySetInnerHTML={{ __html: svgData }}
    ></div>
  );
}

export default QrImage;
