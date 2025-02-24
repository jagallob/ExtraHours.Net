using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Model
{
    [Table("managers")]
    public class Manager
    {
        [Key]
        [Column("manager_id")]
        public long id { get; set; }

        [Required]
        [Column("manager_name")]
        public string name { get; set; } = string.Empty;
    }
}
