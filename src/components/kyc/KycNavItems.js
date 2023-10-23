import { NavLink } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

function KycNavItems(props) {
  const { paths, isDropdown } = props;

  let Wrapper = props => <>{props.children}</>;

  if (isDropdown) {
    Wrapper = props => (
      <NavDropdown.Item className="text-black">
        {props.children}
      </NavDropdown.Item>
    );
  }

  return paths.map(path => (
    <Wrapper key={path}>
      <Nav.Item className="w-100">
        <Nav.Link
          as={NavLink}
          to={path}
          className="text-capitalize text-black fw-bold my-2 py-2 text-start"
        >
          <small>{path.split("-").join(" ")}</small>
        </Nav.Link>
      </Nav.Item>
    </Wrapper>
  ));
}

export default KycNavItems;
