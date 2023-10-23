import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import CloseIcon from "@mui/icons-material/Close";

import AccActivation from "./AccActivation";
import SidebarNav from "./SidebarNav";

import sidebarHeaderLogoImg from "../../assets/images/logos/sidebar-logo.png";
import { useContext } from "react";
import SidebarDisplayContext from "../../context/sidebar-display";

function Sidebar() {
  const { toggleDisplayClass } = useContext(SidebarDisplayContext);

  const navigate = useNavigate();

  const userToken = localStorage.getItem("usr_token");

  return (
    <>
      <header className="py-2 text-center">
        <div onClick={() => navigate("/app/home")}>
          <Image
            src={sidebarHeaderLogoImg}
            alt="Rx One Provider"
            style={{ height: "60px" }}
          />
        </div>

        {/* float-right */}
        <span
          className="d-inline d-sm-none position-absolute end-0"
          style={{ top: "22px" }}
          onClick={toggleDisplayClass}
        >
          <CloseIcon style={{ fontWeight: "bolder", fontSize: "2.5rem" }} />
        </span>
      </header>

      <hr
        className="my-1 mx-auto"
        style={{
          color: "#a5a5a5",
          backgroundColor: "#a5a5a5",
          height: "6px",
          width: "90%",
        }}
      />

      {userToken && userToken.startsWith("FO") && <AccActivation />}

      <SidebarNav />
    </>
  );
}

export default Sidebar;
