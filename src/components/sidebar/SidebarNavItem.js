import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

import SidebarDisplayContext from "../../context/sidebar-display";

function SidebarNavItem(props) {
  const { Icon, label, link } = props;

  const { displayClass, toggleDisplayClass } = useContext(
    SidebarDisplayContext
  );

  const { pathname } = useLocation();

  return (
    <Nav.Link
      as={NavLink}
      to={`/app/${link}`}
      className="text-black w-100 px-3 py-2"
      active={pathname === `/app/${link}`}
      onClick={displayClass !== "d-none" ? toggleDisplayClass : () => {}}
    >
      <Icon htmlColor="white" className="fs-1" /> {label}
    </Nav.Link>
  );
}

export default SidebarNavItem;
