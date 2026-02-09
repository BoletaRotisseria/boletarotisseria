import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={isHome ? "h-screen flex flex-col" : "flex flex-col min-h-screen"}>
      <Header />
      <main className={isHome ? "flex-1 min-h-0" : "flex-1"}>
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  );
}
