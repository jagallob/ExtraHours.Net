using ExtraHours.API.Model;
using ExtraHours.API.Dto;

namespace ExtraHours.API.Service.Interface
{
    public interface IEmployeeService
    {
        Task<List<Employee>> GetEmployeesByManagerIdAsync(long managerId);
        Task<Employee> GetByIdAsync(long id);
        Task<List<Employee>> GetAllAsync();
        Task<Employee> AddEmployeeAsync(Employee employee);
        Task<Employee> UpdateEmployeeAsync(long id, UpdateEmployeeDTO dto);
        Task DeleteEmployeeAsync(long id);
        Task<bool> EmployeeExistsAsync(long id);

    }
}
