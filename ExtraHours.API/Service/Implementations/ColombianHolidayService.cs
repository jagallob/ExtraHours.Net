namespace ExtraHours.API.Service.Implementations
{
    public class ColombianHolidayService
    {
        // Festivos fijos en Colombia
        private static readonly Dictionary<(int month, int day), string> FixedHolidays = new Dictionary<(int month, int day), string>
        {
            { (1, 1), "Año Nuevo" },
            { (5, 1), "Día del Trabajo" },
            { (7, 20), "Día de la Independencia" },
            { (8, 7), "Batalla de Boyacá" },
            { (12, 8), "Día de la Inmaculada Concepción" },
            { (12, 25), "Navidad" }
        };

        // Festivos que se trasladan al siguiente lunes
        private static readonly Dictionary<(int month, int day), string> MovableHolidays = new Dictionary<(int month, int day), string>
        {
            { (1, 6), "Día de los Reyes Magos" },
            { (3, 19), "Día de San José" },
            { (6, 29), "San Pedro y San Pablo" },
            { (8, 15), "La Asunción" },
            { (10, 12), "Día de la Raza" },
            { (11, 1), "Día de Todos los Santos" },
            { (11, 11), "Independencia de Cartagena" }
        };

        // Festivos que dependen de la Pascua
        private static readonly Dictionary<int, string> EasterDependentHolidays = new Dictionary<int, string>
        {
            { -3, "Jueves Santo" },
            { -2, "Viernes Santo" },
            { 43, "Ascensión del Señor" },
            { 64, "Corpus Christi" },
            { 71, "Sagrado Corazón" }
        };

        /// <summary>
        /// Verifica si una fecha es festivo en Colombia
        /// </summary>
        public bool IsPublicHoliday(DateTime date)
        {
            // Validar si es domingo
            if (date.DayOfWeek == DayOfWeek.Sunday)
                return true;

            // Verificar festivos fijos
            if (FixedHolidays.ContainsKey((date.Month, date.Day)))
                return true;

            // Verificar festivos trasladables (se celebran el siguiente lunes)
            foreach (var holiday in MovableHolidays)
            {
                var holidayDate = new DateTime(date.Year, holiday.Key.month, holiday.Key.day);

                // Si la fecha original cae en domingo, se traslada al lunes
                int daysToAdd = 0;
                if (holidayDate.DayOfWeek == DayOfWeek.Sunday)
                    daysToAdd = 1;
                else
                    daysToAdd = ((int)DayOfWeek.Monday - (int)holidayDate.DayOfWeek + 7) % 7;

                if (daysToAdd > 0)
                {
                    var movedDate = holidayDate.AddDays(daysToAdd);
                    if (date.Date == movedDate.Date)
                        return true;
                }
            }

            // Verificar festivos que dependen de la Pascua
            var easterSunday = CalculateEasterSunday(date.Year);
            foreach (var offset in EasterDependentHolidays.Keys)
            {
                var holidayDate = easterSunday.AddDays(offset);

                // Para los festivos que dependen de la Pascua, excepto jueves y viernes santo,
                // se aplica la misma regla de traslado al lunes
                if (offset > 0 && holidayDate.DayOfWeek != DayOfWeek.Monday)
                {
                    int daysToAdd = ((int)DayOfWeek.Monday - (int)holidayDate.DayOfWeek + 7) % 7;
                    holidayDate = holidayDate.AddDays(daysToAdd);
                }

                if (date.Date == holidayDate.Date)
                    return true;
            }

            return false;
        }

        /// <summary>
        /// Calcula la fecha del Domingo de Pascua para un año dado usando el algoritmo de Butcher
        /// </summary>
        private DateTime CalculateEasterSunday(int year)
        {
            int a = year % 19;
            int b = year / 100;
            int c = year % 100;
            int d = b / 4;
            int e = b % 4;
            int f = (b + 8) / 25;
            int g = (b - f + 1) / 3;
            int h = (19 * a + b - d - g + 15) % 30;
            int i = c / 4;
            int k = c % 4;
            int l = (32 + 2 * e + 2 * i - h - k) % 7;
            int m = (a + 11 * h + 22 * l) / 451;
            int month = (h + l - 7 * m + 114) / 31;
            int day = ((h + l - 7 * m + 114) % 31) + 1;

            return new DateTime(year, month, day);
        }
    }
}
