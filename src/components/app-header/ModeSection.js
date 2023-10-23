import { useContext } from "react";

import ModeContext from "../../context/mode-context";

function ModeSection() {
  const { mode, changeMode } = useContext(ModeContext);

  const handleModeChange = event => {
    changeMode(event.target.value);
  };

  return (
    <section
      className="text-center"
      style={{
        backgroundColor: mode === "test" ? "#ffff99" : "#b3c6e7",
      }}
    >
      <select
        defaultValue={mode}
        onChange={handleModeChange}
        style={{
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
        }}
      >
        <option value="test">Test Mode</option>
        <option value="live">Live Mode</option>
      </select>
    </section>
  );
}

export default ModeSection;
