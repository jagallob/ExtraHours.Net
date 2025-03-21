using ExtraHours.API.Model;
using ExtraHours.API.Service.Interface;

namespace ExtraHours.API.Service.Implementations
{
    public class ExtraHourCalculationService : IExtraHourCalculationService
    {
        private readonly IExtraHoursConfigService _configService;
        private readonly ColombianHolidayService _holidayService;

        public ExtraHourCalculationService(IExtraHoursConfigService configService)
        {
            _configService = configService;
            _holidayService = new ColombianHolidayService();
        }

        public async Task<ExtraHourCalculation> DetermineExtraHourTypeAsync(DateTime date, TimeSpan startTime, TimeSpan endTime)
        {
            // Obtener configuración de franjas horarias
            var config = await _configService.GetConfigAsync();
            if (config == null)
            {
                throw new InvalidOperationException("La configuración aún no está completamente cargada.");
            }

            TimeSpan diurnalStart = config.diurnalStart;
            TimeSpan diurnalEnd = config.diurnalEnd;

            // Verificar que la hora fin sea posterior a la hora inicio
            DateTime startDateTime = date.Date + startTime;
            DateTime endDateTime = date.Date + endTime;

            if (endDateTime <= startDateTime)
            {
                throw new InvalidOperationException("La hora de fin debe ser posterior a la hora de inicio.");
            }

            // Inicializar contadores de horas extras
            double diurnal = 0, nocturnal = 0, diurnalHoliday = 0, nocturnalHoliday = 0;

            // Obtener si el día es festivo en Colombia
            bool isHoliday = _holidayService.IsPublicHoliday(date) || date.DayOfWeek == DayOfWeek.Sunday;

            // Procesar hora por hora
            DateTime current = startDateTime;
            while (current < endDateTime)
            {
                DateTime nextHour = current.AddHours(1);
                DateTime actualEnd = nextHour > endDateTime ? endDateTime : nextHour;

                // Calcular diferencia en horas
                double hoursDiff = (actualEnd - current).TotalMinutes / 60;

                // Determinar si es hora diurna o nocturna
                TimeSpan currentTime = current.TimeOfDay;
                bool isNight = !IsInDiurnalPeriod(currentTime, diurnalStart, diurnalEnd);

                // Si estamos entre periodos (diurno/nocturno)
                if (!isNight && currentTime.Add(TimeSpan.FromHours(hoursDiff)) > diurnalEnd)
                {
                    // Calcular tiempo restante en periodo diurno
                    double remainingDiurnalHours = (diurnalEnd - currentTime).TotalMinutes / 60;

                    // Añadir horas diurnas
                    if (isHoliday)
                        diurnalHoliday += remainingDiurnalHours;
                    else
                        diurnal += remainingDiurnalHours;

                    // Añadir horas nocturnas
                    double remainingNocturnalHours = hoursDiff - remainingDiurnalHours;
                    if (remainingNocturnalHours > 0)
                    {
                        if (isHoliday)
                            nocturnalHoliday += remainingNocturnalHours;
                        else
                            nocturnal += remainingNocturnalHours;
                    }
                }
                // Si estamos pasando de nocturno a diurno
                else if (isNight && currentTime < diurnalStart && currentTime.Add(TimeSpan.FromHours(hoursDiff)) >= diurnalStart)
                {
                    // Calcular tiempo restante en periodo nocturno
                    double remainingNocturnalHours = (diurnalStart - currentTime).TotalMinutes / 60;

                    // Añadir horas nocturnas
                    if (isHoliday)
                        nocturnalHoliday += remainingNocturnalHours;
                    else
                        nocturnal += remainingNocturnalHours;

                    // Añadir horas diurnas
                    double remainingDiurnalHours = hoursDiff - remainingNocturnalHours;
                    if (remainingDiurnalHours > 0)
                    {
                        if (isHoliday)
                            diurnalHoliday += remainingDiurnalHours;
                        else
                            diurnal += remainingDiurnalHours;
                    }
                }
                // Si estamos completamente en un periodo
                else
                {
                    if (isHoliday)
                    {
                        if (isNight)
                            nocturnalHoliday += hoursDiff;
                        else
                            diurnalHoliday += hoursDiff;
                    }
                    else
                    {
                        if (isNight)
                            nocturnal += hoursDiff;
                        else
                            diurnal += hoursDiff;
                    }
                }

                current = nextHour;
            }

            return new ExtraHourCalculation
            {
                diurnal = Math.Round(diurnal, 2),
                nocturnal = Math.Round(nocturnal, 2),
                diurnalHoliday = Math.Round(diurnalHoliday, 2),
                nocturnalHoliday = Math.Round(nocturnalHoliday, 2),
                extraHours = Math.Round(diurnal + nocturnal + diurnalHoliday + nocturnalHoliday, 2)
            };
        }

        private bool IsInDiurnalPeriod(TimeSpan time, TimeSpan diurnalStart, TimeSpan diurnalEnd)
        {
            return time >= diurnalStart && time < diurnalEnd;
        }
    }
}