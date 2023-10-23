import MainContent from "../components/register-and-login/MainContent";

const authRoutes = [
  { path: "sign-up/*", component: <MainContent page="sign-up" /> },
  { path: "login", component: <MainContent page="login" /> },
];

export default authRoutes;
