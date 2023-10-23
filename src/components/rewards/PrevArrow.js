import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

function PrevArrow(props) {
  return (
    <ArrowBackIosNewIcon
      className={`${props.className} slider-next-arrow mx-2 me-5`}
      onClick={props.onClick}
      style={{
        ...props.style,
        color: "black",
        cursor: "pointer",
      }}
    />
  );
}

export default PrevArrow;
