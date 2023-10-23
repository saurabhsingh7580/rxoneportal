import React, { useEffect, useState } from "react";

const SidebarDisplayContext = React.createContext({
  displayClass: "d-none",
  toggleDisplayClass: () => {},
});

function SidebarDisplayProvider(props) {
  const [displayClass, setDisplayClass] = useState("d-none");

  useEffect(() => {
    if (displayClass === "d-block sidebar-pos") {
      document.body.style.height = "100vh";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [displayClass]);

  const toggleDisplayClass = () => {
    setDisplayClass(prevClass => {
      if (prevClass === "d-none") return "d-block sidebar-pos";
      else return "d-none";
    });
  };

  const contextValues = { displayClass, toggleDisplayClass };

  return (
    <SidebarDisplayContext.Provider value={contextValues}>
      {props.children}
    </SidebarDisplayContext.Provider>
  );
}

export default SidebarDisplayContext;
export { SidebarDisplayProvider };
