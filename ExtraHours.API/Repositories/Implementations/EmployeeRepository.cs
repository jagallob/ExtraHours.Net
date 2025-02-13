using ExtraHours.API.Model;
using ExtraHours.API.Data;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Dto;

namespace ExtraHours.API.Repositories.Implementations
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;

        public EmployeeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Employee>> GetEmployeesByManagerIdAsync(long managerId)
        {
            return await _context.Employees.Where(e => e.Manager != null && e.Manager.Id == managerId).ToListAsync();
        }

        public async Task<Employee?> GetByIdAsync(long id)
        {
            return await _context.Employees.FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Employee>> GetAllAsync()
        {
            return await _context.Employees.ToListAsync();
        }

        public async Task<Employee> AddAsync(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task UpdateAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee != null)
            {
                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException("Empleado no encontrado");
            }
        }

        public async Task<Employee> UpdateEmployeeAsync(long id, UpdateEmployeeDTO dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                throw new KeyNotFoundException("Empleado no encontrado");

            employee.Name = dto.Name ?? employee.Name;
            employee.Position = dto.Position ?? employee.Position;
            employee.Salary = dto.Salary ?? employee.Salary;

            if (dto.ManagerId.HasValue)
            {
                var manager = await _context.Managers.FindAsync(dto.ManagerId.Value);
                if (manager == null)
                    throw new KeyNotFoundException("Manager no encontrado");
                employee.Manager = manager;
            }

            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
            return employee;
        }
    }
}
