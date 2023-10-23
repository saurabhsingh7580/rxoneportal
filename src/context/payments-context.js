import React, { useEffect, useState } from "react";

const PaymentsContext = React.createContext({
  paysCount: 0,
  setPaysCount: () => {},
});

function PaymentsProvider(props) {
  const [paysCount, setPaysCount] = useState(0);

  return (
    <PaymentsContext.Provider value={{ paysCount, setPaysCount }}>
      {props.children}
    </PaymentsContext.Provider>
  );
}

export default PaymentsContext;
export { PaymentsProvider };
