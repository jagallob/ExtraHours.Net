import { UpdateDeleteApprove } from "@components/UpdateDeleteApprove/UpdateDeleteApprove";
import "./UpdateDeleteApprovePage.scss";

const ManagementExtraHour = () => {
  return (
    <>
      <div>
        <header className="page__header"></header>
        {/* <h2 className="h2addextra">Gestión de Horas Extras</h2> */}
        <UpdateDeleteApprove />
      </div>
    </>
  );
};

export default ManagementExtraHour;
