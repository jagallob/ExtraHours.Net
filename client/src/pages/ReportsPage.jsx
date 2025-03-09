import { ReportInfo } from "../components/ReportInfo/ReportInfo";
import "./ReportsPage.scss";

const Reports = () => {
  return (
    <>
      <div>
        <header className="page__header"></header>
        {/* <h2 className="h2addextra">Informes</h2> */}
        <ReportInfo />
      </div>
    </>
  );
};

export default Reports;
