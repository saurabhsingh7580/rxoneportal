import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function NextArrow(props) {
  return (
    <ArrowForwardIosIcon
      className={`${props.className} slider-next-arrow mx-2 ms-5`}
      onClick={props.onClick}
      style={{
        ...props.style,
        color: "black",
        cursor: "pointer",
      }}
    />
  );
}

export default NextArrow;
