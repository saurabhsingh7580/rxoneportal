import { useContext, useEffect, useState } from "react";

import Card from "../common/card";
import { rxOneApi, rxOpdApi } from "../../../utils/api/api";
import { RX_OPD_ENDPOINTS } from "../../../utils/api/apiEndPoints";
import ModeContext from "../../../context/mode-context";

const Pharmacy = () => {
  const { mode } = useContext(ModeContext);
  const [pharmaRecords, setPharmaRecords] = useState([]);
  const [resultsFetchedSuccessfully, setResultsFetchedSuccessfully] =
    useState(false);

  useEffect(() => {
    const fetchPharmacyData = async () => {
      const userModeKey = JSON.parse(localStorage.getItem("usr_keys"))[mode];
      const key = userModeKey[`${mode}_key`];
      const secret = userModeKey[`${mode}_secret`];
      const userToken = localStorage.getItem("usr_token");
      try {
        rxOpdApi.setAuthHeaders(key, secret);
        const res = await rxOpdApi.get(RX_OPD_ENDPOINTS.PHARMACY.PHARMACY_LIST);

        setPharmaRecords(res.data.records);
        setResultsFetchedSuccessfully(true);
      } catch {}
    };
    fetchPharmacyData();
  }, []);

  return (
    <>
      {pharmaRecords.map((record) => (
        <Card record={record} />
      ))}
    </>
  );
};

export default Pharmacy;
