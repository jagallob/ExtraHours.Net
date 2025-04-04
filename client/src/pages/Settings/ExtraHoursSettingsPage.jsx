import { useState } from "react";
import ExtraHoursSettings from "../../components/ExtraHoursSettings/ExtraHoursSettings";
import "./ExtraHoursSettingsPage.scss";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    `En Colombia, el pago de las horas extra está regulado por el Código Sustantivo del Trabajo, y depende de varios factores como la jornada laboral, la hora en que se realicen las horas extra y si estas coinciden con días festivos o fines de semana.

1. **Jornada Ordinaria de Trabajo:**  
   - Jornada Diurna: De 6:00 a.m. a 9:00 p.m.  
   - Jornada Nocturna: De 9:00 p.m. a 6:00 a.m  

2. **Recargos por Horas Extra:**  
   - Horas Extra Diurnas: Se pagan con un recargo del 25% sobre el valor de la hora ordinaria.  
   - Horas Extra Nocturnas: Se pagan con un recargo del 75% sobre el valor de la hora ordinaria.  

3. **Recargos en Días Festivos o Dominicales:**  
   - Trabajo en Domingo o Festivo Diurno: Se paga con un recargo del 75% sobre el valor de la hora ordinaria.  
   - Horas Extra en Domingo o Festivo Diurno: Se paga con un recargo del 100% sobre el valor de la hora ordinaria.  
   - Trabajo en Domingo o Festivo Nocturno: Se paga con un recargo del 110% sobre el valor de la hora ordinaria.  
   - Horas Extra en Domingo o Festivo Nocturno: Se paga con un recargo del 150% sobre el valor de la hora ordinaria.  

4. **Limitaciones:**  
   - El máximo de horas extra permitido por la ley es de 2 horas diarias y 12 horas semanales.  

5. **Cálculo:**  
   - El valor de la hora ordinaria se obtiene dividiendo el salario mensual por 240.  
   - Ejemplo: Si un trabajador gana un salario mínimo mensual en 2024 (1.160.000 COP), y trabaja una hora extra diurna:  
     - Valor de la hora ordinaria: 1.160.000 / 240 = 4.833 COP  
     - Valor de la hora extra diurna: 4.833 * 1.25 = 6.041 COP  

6. **Normativa Especial:**  
   - Algunas categorías de empleados, como los de dirección, confianza y manejo, pueden estar excluidos del pago de horas extra.`
  );

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="settingsMenu">
      <header className="page__header">
        <a href="http://localhost:5173/"></a>
      </header>
      <h2>Parámetros Horas Extra</h2>
      <div className="settings__container">
        <aside className="settings__article">
          <h3>Legislación vigente</h3>
          {isEditing ? (
            <textarea
              className="editable-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <article
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br/>"),
              }}
            />
          )}
          <button className="edit-button" onClick={toggleEdit}>
            {isEditing ? "Guardar" : "Editar"}
          </button>
        </aside>

        <section className="settings__form">
          <ExtraHoursSettings />
        </section>
      </div>
    </div>
  );
};

export default Settings;
