import Container from "react-bootstrap/Container";

function PageContentLayout(props) {
  const { className } = props;

  return (
    <Container
      fluid
      className={`shadow my-4 mx-auto px-0 ${className ? className : ""}`}
      style={{ width: "90%", minHeight: "80%" }}
    >
      {props.children}
    </Container>
  );
}

export default PageContentLayout;
