import { Link } from "react-router-dom"; // Import Link from React Router
import "./AddExtrahour.scss"; // Import your styles
import { FormExtraHour } from "../components/FormExtraHour/FormExtraHour"; // Import your form component
import logoamadeus from "../../../client/src/assets/images/logoamadeus.png"; // Import logo images

const AddExtrahour = () => {
  return (
    <>
      <div>
        <header className="page__header">
          {/* Correct use of Link component for navigation */}
          <Link to="/menu">
            <img className="logoamadeus" src={logoamadeus} alt="Logo Amadeus" />
          </Link>
        </header>
        <h2 className="h2addextra">Agregar Horas Extra</h2>
        <FormExtraHour />
      </div>
    </>
  );
};

export default AddExtrahour;
