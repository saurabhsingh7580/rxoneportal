import { useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import AuthContext from "./context/auth-context";
import authRoutes from "./routes/auth.routes";
import appRoutes from "./routes/app.routes";
import getRoutes from "./utils/config-routes";

import "./App.css";

function App() {
  const { isUserLoggedIn } = useContext(AuthContext);
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAppLoaded(true);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/app/home", { replace: true });
    }
  }, [location, navigate]);

  return isAppLoaded ? (
    <Routes>
      {getRoutes(
        "user",
        authRoutes,
        !isUserLoggedIn,
        "app/home",
        location.pathname.split("/")[2]
      )}

      {getRoutes("app", appRoutes, isUserLoggedIn, "user/login")}

      <Route path="*" element={<h1>404! Page Not Found</h1>} />
    </Routes>
  ) : (
    <h1 style={{ textAlign: "center" }}>Loading...</h1>
  );
}

export default App;
