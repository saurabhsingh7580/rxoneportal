import React, { useEffect, useState } from "react";

const AuthContext = React.createContext({
  isUserLoggedIn: false,
  userEmail: "",
  login: (userToken, email) => {},
  logout: () => {},
});

function AuthProvider(props) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("usr_token");
    const usrEmail = localStorage.getItem("usr_email");

    if (userToken) {
      setIsUserLoggedIn(true);
      setUserEmail(usrEmail);
    }
  }, []);

  const login = (userToken, userSecret, email) => {
    localStorage.setItem("usr_token", userToken);
    localStorage.setItem("usr_email", email);
    setIsUserLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.clear();

    setIsUserLoggedIn(false);
    setUserEmail("");
  };

  const authContextValue = { isUserLoggedIn, userEmail, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthProvider };
