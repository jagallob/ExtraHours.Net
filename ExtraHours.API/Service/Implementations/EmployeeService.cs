using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;

namespace ExtraHours.API.Service.Implementations
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IManagerRepository _managerRepository;
        private readonly AppDbContext _context;

        public EmployeeService(IEmployeeRepository employeeRepository, IManagerRepository managerRepository, AppDbContext context)
        {
            _employeeRepository = employeeRepository;
            _managerRepository = managerRepository;
            _context = context; 
        }

        public async Task<bool> EmployeeExistsAsync(long id)
        {
            // Directly check existence in the database context
            return await _context.employees
                .AsNoTracking()  // More efficient for existence checks
                .AnyAsync(e => e.id == id);
        }

        public async Task<List<Employee>> GetEmployeesByManagerIdAsync(long managerId)
        {
            return await _employeeRepository.GetEmployeesByManagerIdAsync(managerId);
        }

        public async Task<Employee> GetByIdAsync(long id)
        {
            return await _employeeRepository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException("Empleado no encontrado");
        }

        public async Task<List<Employee>> GetAllAsync()
        {
            return await _employeeRepository.GetAllAsync();
        }

        public async Task<Employee> AddEmployeeAsync(Employee employee)
        {
            return await _employeeRepository.AddAsync(employee);
        }

        public async Task<Employee> UpdateEmployeeAsync(long id, UpdateEmployeeDTO dto)
        {
            
            return await _employeeRepository.UpdateEmployeeAsync(id, dto);
        }

        public async Task DeleteEmployeeAsync(long id)
       {
          var employee = await _employeeRepository.GetByIdAsync(id);
          if (employee == null)
          {
        throw new KeyNotFoundException("Empleado no encontrado");
          }

            await _employeeRepository.DeleteAsync(employee.id);
       }

    }
}
