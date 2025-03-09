import PropTypes from "prop-types";
import Header from "../Header/Header";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import Inicio from "../../assets/images/Inicio.png";

const Layout = ({ children, showHomeButton = true }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const isMenuPage = location.pathname === "/menu";

  return (
    <div className="app-container">
      {auth && <Header />}
      {showHomeButton && !isMenuPage && (
        <div className="page__header">
          <Link to="/menu">
            <img className="Inicio" src={Inicio} alt="Casa" />
          </Link>
        </div>
      )}
      <main className="app-content">
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  showHomeButton: PropTypes.bool,
};

export default Layout;
