using ExtraHours.API.Model;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Service.Interface;
using ExtraHours.API.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Service.Implementations
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IManagerRepository _managerRepository;

        public EmployeeService(IEmployeeRepository employeeRepository, IManagerRepository managerRepository)
        {
            _employeeRepository = employeeRepository;
            _managerRepository = managerRepository;
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
            var employee = await _employeeRepository.GetByIdAsync(id);
            if (employee == null)
            {
                throw new KeyNotFoundException("Empleado no encontrado");
            }

            employee.name = dto.Name ?? employee.name;
            employee.position = dto.Position ?? employee.position;
            employee.salary = dto.Salary ?? employee.salary;

            if (dto.ManagerId.HasValue)
            {
                var manager = await _managerRepository.GetByIdAsync(dto.ManagerId.Value);
                if (manager == null)
                {
                    throw new KeyNotFoundException("Manager no encontrado");
                }
                employee.manager = manager;
            }

            await _employeeRepository.UpdateAsync(employee);
            return employee;
        }

        public async Task DeleteEmployeeAsync(long id)
        {
            await _employeeRepository.DeleteAsync(id);
        }

    }
}
