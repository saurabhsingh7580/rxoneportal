import { Navigate, Route, Routes } from "react-router-dom";

function PageContentRoutes(props) {
  const { routes } = props;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={routes[0].path} />} />

      {routes.map(route => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}

      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}

export default PageContentRoutes;
