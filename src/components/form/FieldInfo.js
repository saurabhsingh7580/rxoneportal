import { useEffect, useRef, useState } from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function FieldInfo(props) {
  const { info, classes, styles = {} } = props;

  const [show, setShow] = useState(false);

  const target = useRef(null);

  useEffect(() => {
    if (show) {
      const hideTooltipTimeout = setTimeout(() => {
        setShow(prevShow => !prevShow);
      }, 5000);

      return () => clearTimeout(hideTooltipTimeout);
    }
  }, [show]);

  return (
    <>
      <p
        className={classes}
        style={{ ...styles, cursor: "pointer" }}
        ref={target}
        onClick={() => setShow(!show)}
      >
        <InfoOutlinedIcon />
      </p>

      <Overlay target={target.current} show={show} placement="bottom-start">
        {props => (
          <Tooltip id="overlay-example" {...props}>
            {info}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}

export default FieldInfo;
