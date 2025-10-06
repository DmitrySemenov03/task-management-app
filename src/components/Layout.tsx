import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();

  const noFooterRoutes = ["/calendar", "/boards", "/login", "/register"];
  const hideFooter = noFooterRoutes.some((path) =>
    location.pathname.includes(path)
  );

  return (
    <div className="app-layout">
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default Layout;
