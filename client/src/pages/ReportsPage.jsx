import { Link } from "react-router-dom"; // Import Link from React Router
import "./ReportsPage.scss";
import { ReportInfo } from "../components/ReportInfo/ReportInfo";
import logoamadeus from "../../../client/src/assets/images/logoamadeus.png"; // Import logo images

const Reports = () => {
  return (
    <>
      <header className="page__header">
        <Link to="/menu">
          <img className="logoamadeus" src={logoamadeus} alt="Logo Amadeus" />
        </Link>
      </header>
      <h2 className="h2Info">Informes</h2>
      <ReportInfo />
    </>
  );
};

export default Reports;
