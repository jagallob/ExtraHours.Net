using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.API.Model
{
    [Table("employees")]
    public class Employee
    {
        [Key]
        [Column("id")]
        public long id { get; set; }

        [Required]
        [MaxLength(100)]
        public string name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? position { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El salario debe ser un valor positivo.")]
        public double? salary { get; set; }

        [ForeignKey("manager")]
        [Column("manager_id")]
        public long? managerId { get; set; }
        public Manager? manager { get; set; }
    }
}
