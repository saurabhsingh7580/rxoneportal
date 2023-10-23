import { Navigate, Outlet, Route } from "react-router-dom";

import Header from "../components/register-and-login/Header";
import AppRoutesPage from "../pages/common/AppRoutesPage";

import registerAndLoginPageBgImg from "../assets/images/background-images/register-and-login.jpg";
import { SidebarDisplayProvider } from "../context/sidebar-display";

const getRoutes = (path, routes, shouldAllow, navigatePath, currentPath) => {
  const Page =
    path === "user" ? (
      <div
        className="d-flex flex-column"
        style={{
          height: "100vh",
          backgroundImage: `url(${registerAndLoginPageBgImg})`,
        }}
      >
        <Header page={currentPath} /> {/* Header of Sign Up and Login pages. */}
        <Outlet />
      </div>
    ) : (
      <SidebarDisplayProvider>
        <AppRoutesPage>
          <Outlet />
        </AppRoutesPage>
      </SidebarDisplayProvider>
    );

  return (
    <Route path={`/${path}`} element={Page}>
      {routes.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={
            shouldAllow ? route.component : <Navigate to={`/${navigatePath}`} />
          }
        />
      ))}

      <Route index element={<Navigate to="/app/home" />} />

      <Route path="*" element={<Navigate to="/404" />} />
    </Route>
  );
};

export default getRoutes;
