using ExtraHours.API.Model;
using ExtraHours.API.Dto;

namespace ExtraHours.API.Repositories.Interfaces

{
    public interface IEmployeeRepository
    {
        Task<List<Employee>> GetEmployeesByManagerIdAsync(long managerId);
        Task<Employee?> GetByIdAsync(long id);
        Task<List<Employee>> GetAllAsync();
        Task<Employee> AddAsync(Employee employee);
        Task<Employee> UpdateEmployeeAsync(long id, UpdateEmployeeDTO dto);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(long id);

    }
}
