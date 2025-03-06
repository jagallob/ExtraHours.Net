import { Link } from "react-router-dom";
import "./ReportsPage.scss";
import { ReportInfo } from "../components/ReportInfo/ReportInfo";
import logoamadeus from "../../../client/src/assets/images/logoamadeus.png";

const Reports = () => {
  return (
    <>
      <header className="page__header">
        <Link to="/menu">
          <img className="logoamadeus" src={logoamadeus} alt="Logo Amadeus" />
        </Link>
      </header>

      <div className="page-container">
        {/* <h2 className="h2Info">Informes</h2> */}
        <ReportInfo />
      </div>
    </>
  );
};

export default Reports;
