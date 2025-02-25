using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Model;    

namespace ExtraHours.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> employees { get; set; }
        public DbSet<ExtraHour> extraHours { get; set; }
        public DbSet<ExtraHoursConfig> extraHoursConfigs { get; set; }
        public DbSet<Manager> managers { get; set; }
        public DbSet<User> users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.manager)
                .WithMany()
                .HasForeignKey(e => e.managerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ExtraHoursConfig>().HasData(new ExtraHoursConfig { id = 1 });

            modelBuilder.Entity<ExtraHour>()
               .Property(e => e.date)
               .HasConversion(
            v => v.ToUniversalTime(),  // Convierte a UTC al guardar
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // Convierte a UTC al leer
        );

            base.OnModelCreating(modelBuilder);
        }

    }
}
