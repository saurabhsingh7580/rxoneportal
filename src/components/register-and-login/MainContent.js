import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import FormEle from "./FormEle";
import InfoUnit from "./InfoUnit";

import headerLogoImg from "../../assets/images/logos/header-logo.png";

function MainContent(props) {
  const { page } = props;

  return (
    <>
      <Container as="main" className="h-100">
        <Row className="h-100 justify-content-center align-items-center">
          <Col
            className="p-1 p-sm-3 p-md-4 p-lg-5 text-white shadow-lg position-relative"
            xs={{ span: 12, order: "last" }}
            md={{ span: 7, order: page === "sign-up" ? "first" : "last" }}
            style={{ backgroundColor: "#006f80" }}
          >
            <InfoUnit />

            <br />

            <p style={{ position: "absolute", bottom: "0", right: "50px" }}>
              Need Help?{" "}
              <a href="#" className="text-white">
                Contact Us
              </a>
            </p>
          </Col>
          <Col
            as="section"
            xs={{ span: 12, order: "first" }}
            md={{ span: 5, order: page === "sign-up" ? "last" : "first" }}
            className="py-3 shadow-lg"
            style={{ margin: "0 -30px", backgroundColor: "white", zIndex: 2 }}
          >
            {page === "sign-up" ? (
              <>
                <header className="my-3 d-flex justify-content-center align-items-center">
                  <h1 className="h4 mb-0 mx-2">Welcome to</h1>

                  <a href="https://rxone.app/">
                    <Image
                      src={headerLogoImg}
                      alt="Rx One Logo"
                      fluid
                      style={{ height: "40px" }}
                    />
                  </a>
                </header>

                <p className="text-center">Signup to create account with us.</p>
              </>
            ) : (
              <h1 className="h4 mb-5">Login to Dashboard</h1>
            )}

            <FormEle page={page} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MainContent;
