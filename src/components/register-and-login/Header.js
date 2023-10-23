import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import headerImg from "../../assets/images/logos/header-logo.png";

function Header(props) {
  const { page } = props;

  return (
    <header>
      <Navbar expand="sm">
        <Container fluid>
          <Navbar.Brand href="https://rxone.app/">
            <Image
              src={headerImg}
              alt="Rx One Logo"
              fluid
              style={{ height: "60px" }}
            />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="navbar"
            style={{ backgroundColor: "lightblue" }}
          />
          <Navbar.Collapse id="navbar" className="justify-content-end">
            <section className="d-flex flex-column flex-sm-row align-items-center">
              <span className="my-auto px-4 fs-5 fw-bold text-center text-white">
                {page === "sign-up"
                  ? "Already have an account?"
                  : "New to Rx One?"}
              </span>

              <Nav style={{ maxHeight: "100px" }}>
                <Nav.Link
                  as={Link}
                  to={`${page === "sign-up" ? "login" : "sign-up"}`}
                  className=""
                >
                  <button className="register-and-login-btn">
                    {page === "sign-up" ? "Login" : "Sign Up"}
                  </button>
                </Nav.Link>
              </Nav>
            </section>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
