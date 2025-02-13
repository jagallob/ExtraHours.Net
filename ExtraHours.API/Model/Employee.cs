using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExtraHours.API.Model
{
    [Table("employees")]
    public class Employee
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Position { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El salario debe ser un valor positivo.")]
        public double? Salary { get; set; }

        [ForeignKey("Manager")]
        [Column("manager_id")]
        public long? ManagerId { get; set; }
        public Manager? Manager { get; set; }
    }
}
