import PropTypes from "prop-types";
import Header from "../Header/Header";
import { useAuth } from "../../utils/useAuth";

const Layout = ({ children }) => {
  const { auth } = useAuth();

  return (
    <div className="app-container">
      {auth && <Header />}
      <main className="app-content">{children}</main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
