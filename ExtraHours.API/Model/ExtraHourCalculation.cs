namespace ExtraHours.API.Model
{
    public class ExtraHourCalculation
    {
        public double diurnal { get; set; }
        public double nocturnal { get; set; }
        public double diurnalHoliday { get; set; }
        public double nocturnalHoliday { get; set; }
        public double extraHours { get; set; }
    }
}
