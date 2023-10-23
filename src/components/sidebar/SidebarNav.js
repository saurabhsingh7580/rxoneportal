import Nav from "react-bootstrap/Nav";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SignpostIcon from "@mui/icons-material/Signpost";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SettingsIcon from "@mui/icons-material/Settings";

import SidebarNavItem from "./SidebarNavItem";

const navLinks = [
  { label: "Home", Icon: HomeIcon },
  { label: "OPD", Icon: EventIcon },
  { label: "Facilities", Icon: SignpostIcon },
  { label: "Doctors", Icon: PersonAddAlt1Icon },
  { label: "Settlements", Icon: HandshakeIcon },
  { label: "Rewards", Icon: EmojiEventsOutlinedIcon },
  { label: "Subscriptions", Icon: LocationOnOutlinedIcon },
  // { label: "Billing", Icon: MonetizationOnOutlinedIcon },
];

function SidebarNav(props) {
  const userToken = localStorage.getItem("usr_token");

  if (userToken && userToken.startsWith("FO") && navLinks.length === 7) {
    navLinks.push({ label: "Settings", Icon: SettingsIcon });
  } else if (
    (!userToken || !userToken.startsWith("FO")) &&
    navLinks.length === 8
  ) {
    navLinks.pop();
  }

  return (
    <Nav
      as="nav"
      className="flex-column justify-content-center py-2 fw-bold sidebar"
    >
      {navLinks.map((link) => (
        <SidebarNavItem
          key={link.label}
          Icon={link.Icon}
          label={link.label}
          link={link.label.toLowerCase()}
        />
      ))}
    </Nav>
  );
}

export default SidebarNav;
