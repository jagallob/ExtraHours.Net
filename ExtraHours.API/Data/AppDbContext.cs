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
            // Relación entre Employee y Manager
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.manager)
                .WithMany()
                .HasForeignKey(e => e.manager_id)
                .OnDelete(DeleteBehavior.SetNull); // Si se elimina un manager, establecer manager_id en NULL

            // Relación entre Manager y User
            modelBuilder.Entity<Manager>()
                .HasOne(m => m.User)
                .WithOne()
                .HasForeignKey<Manager>(m => m.manager_id)
                .OnDelete(DeleteBehavior.Cascade); // Eliminar el manager si se elimina el usuario asociado

            // Relación entre Employee y User
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.User)
                .WithOne()
                .HasForeignKey<Employee>(e => e.id)
                .OnDelete(DeleteBehavior.Cascade); // Eliminar el empleado si se elimina el usuario asociado

            // Relación entre ExtraHour y Employee
            modelBuilder.Entity<ExtraHour>()
                .HasOne(eh => eh.employee)
                .WithMany()
                .HasForeignKey(eh => eh.id)
                .OnDelete(DeleteBehavior.Cascade); // Eliminar las horas extras si se elimina el empleado

            // Datos iniciales para ExtraHoursConfig
            modelBuilder.Entity<ExtraHoursConfig>().HasData(new ExtraHoursConfig { id = 1 });

            // Configuración de la propiedad 'date' en UTC
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
