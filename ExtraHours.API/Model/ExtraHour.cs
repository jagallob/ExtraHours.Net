using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.API.Model
{
    [Table("extra_hours")]
    public class ExtraHour
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Registry { get; set; }

        public long Id { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public double Diurnal { get; set; }
        public double Nocturnal { get; set; }
        public double DiurnalHoliday { get; set; }
        public double NocturnalHoliday { get; set; }
        public double ExtraHours { get; set; }
        public string? Observations { get; set; }

        [Required]
        public bool Approved { get; set; } = false;

        [ForeignKey("Id")]
        public Employee? Employee { get; set; }
    }
}
