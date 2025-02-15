import Holiday from "date-holidays";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const hd = new Holiday("CO");

export const determineExtraHourType = (
  date,
  startTime,
  endTime,
  setError,
  setExtraHours,
  config
) => {
  if (!config || !config.diurnal_start || !config.diurnal_end) {
    console.error("La configuración aún no está completamente cargada.");
    return;
  }

  const { diurnal_start, diurnal_end } = config;

  const startDateTime = dayjs(`${date}T${startTime}`);
  const endDateTime = dayjs(`${date}T${endTime}`);

  // Verificación para evitar que la hora de fin sea anterior a la de inicio
  if (endDateTime.isBefore(startDateTime)) {
    setError("La hora de fin debe ser posterior a la hora de inicio.");
    return;
  }

  let current = startDateTime;
  let diurnal = 0,
    nocturnal = 0,
    diurnalHoliday = 0,
    nocturnalHoliday = 0;

  // Función para manejar horas extras según su tipo
  const handleExtraHours = (isHoliday, hoursDiff, isNight) => {
    if (isHoliday) {
      if (isNight) {
        nocturnalHoliday += hoursDiff; // Sumar a nocturnalHoliday
      } else {
        diurnalHoliday += hoursDiff; // Sumar a diurnalHoliday
      }
    } else {
      if (isNight) {
        nocturnal += hoursDiff; // Sumar a nocturnal
      } else {
        diurnal += hoursDiff; // Sumar a diurnal
      }
    }
  };

  while (current.isBefore(endDateTime)) {
    const isHoliday = hd.isHoliday(current.toDate()) || current.day() === 0; // Verificar si la hora actual es festiva
    const hour = current.hour();
    const minutes = current.minute();
    const nextHour = current.add(1, "hour");
    // nextHour.setHours(current.getHours() + 1);
    const actualEnd = nextHour.isAfter(endDateTime) ? endDateTime : nextHour;

    // Calcular la diferencia directamente en horas
    const hoursDiff = actualEnd.diff(current, "minutes") / 60;

    // Calcular horas diurnas
    if (
      hour >= parseInt(diurnal_start.split(":")[0], 10) &&
      hour < parseInt(diurnal_end.split(":")[0], 10)
    ) {
      if (hour === parseInt(diurnal_end.split(":")[0], 10) - 1) {
        // Si estamos en la última hora antes de que comience la franja nocturna
        const remainingMinutes =
          parseInt(diurnal_end.split(":")[0], 10) * 60 - (hour * 60 + minutes); // Minutos restantes hasta el final de la franja diurna
        const remainingHours = remainingMinutes / 60;

        handleExtraHours(isHoliday, remainingHours, false); // Sumar a diurna o festiva diurna
        const nocturnalHours = hoursDiff - remainingHours;
        if (nocturnalHours > 0) {
          handleExtraHours(isHoliday, nocturnalHours, true); // Sumar a nocturna o festiva nocturna
        }
      } else {
        handleExtraHours(isHoliday, hoursDiff, false); // Sumar horas diurnas
      }
    } else if (
      hour >= parseInt(diurnal_end.split(":")[0], 10) ||
      hour < parseInt(diurnal_start.split(":")[0], 10)
    ) {
      if (hour < parseInt(diurnal_start.split(":")[0], 10) && hour === 5) {
        const remainingMinutes =
          diurnal_start.split(":")[0] * 60 - (hour * 60 + minutes);
        const remainingHours = remainingMinutes / 60;

        handleExtraHours(isHoliday, remainingHours, true); // Sumar a nocturna o festiva nocturna
        const diurnalHours = hoursDiff - remainingHours;
        if (diurnalHours > 0) {
          handleExtraHours(isHoliday, diurnalHours, false); // Sumar a diurna o festiva diurna
        }
      } else {
        handleExtraHours(isHoliday, hoursDiff, true); // Sumar horas nocturnas
      }
    }

    current = nextHour; // Avanzar a la siguiente hora
  }

  const extrasHours = diurnal + nocturnal + diurnalHoliday + nocturnalHoliday;

  // Actualiza el estado con el valor redondeado a 2 decimales
  setExtraHours((prevData) => ({
    ...prevData,
    diurnal: diurnal.toFixed(2),
    nocturnal: nocturnal.toFixed(2),
    diurnalHoliday: diurnalHoliday.toFixed(2),
    nocturnalHoliday: nocturnalHoliday.toFixed(2),
    extrasHours: extrasHours.toFixed(2),
  }));
};
