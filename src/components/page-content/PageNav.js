import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

function PageNav(props) {
  const { routes } = props;

  return (
    <Nav as="nav" className="text-muted fw-bold page-nav mb-2">
      {routes.map(route =>
        !route.isButton ? (
          <Nav.Link
            key={route.path}
            as={NavLink}
            to={route.path.replace("/*", "")}
            className="text-muted text-capitalize"
            style={{ fontSize: "0.85rem" }}
          >
            {route.path.replace("/*", "").replace("-", " ")}
          </Nav.Link>
        ) : null
      )}
    </Nav>
  );
}

export default PageNav;
