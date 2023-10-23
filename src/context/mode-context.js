import React, { useContext, useEffect, useState } from "react";
import AuthContext from "./auth-context";

const ModeContext = React.createContext({
  mode: "",
  changeMode: mode => {},
});

function ModeProvider(props) {
  const { userEmail } = useContext(AuthContext);

  const [mode, setMode] = useState(
    // userEmail === "devanshbhuptani@gmail.com" ? "test" : "live"
    "test"
    // "live"
    // localStorage.getItem("mode") || "test"
  );

  const changeMode = newMode => {
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  const modeContextValue = { mode, changeMode };

  return (
    <ModeContext.Provider value={modeContextValue}>
      {props.children}
    </ModeContext.Provider>
  );
}

export default ModeContext;
export { ModeProvider };
