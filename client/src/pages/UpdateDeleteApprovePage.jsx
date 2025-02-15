import { Link } from "react-router-dom"; // Import Link from React Router
import { UpdateDeleteApprove } from "@components/UpdateDeleteApprove/UpdateDeleteApprove";
import "./UpdateDeleteApprovePage.scss";
import logoamadeus from "../../../client/src/assets/images/logoamadeus.png"; // Import logo images

const ManagementExtraHour = () => {
  return (
    <>
      <div>
        <header className="page__header">
          <Link to="/menu">
            <img className="logoamadeus" src={logoamadeus} alt="Logo Amadeus" />
          </Link>
        </header>
        <h2 className="h2Update">Actualizar, Aprobar ó Eliminar Horas Extra</h2>
        <UpdateDeleteApprove />
      </div>
    </>
  );
};

export default ManagementExtraHour;
