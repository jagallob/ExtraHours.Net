import PropTypes from "prop-types";
import Header from "../Header/Header";

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="app-content">
        <div className="page-container">{children}</div>
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
