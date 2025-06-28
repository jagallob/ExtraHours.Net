using System.Collections.Generic;
using System.Threading.Tasks;
using ExtraHours.API.Model;
using ExtraHours.API.Dto;
using ExtraHours.API.Service.Implementations;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Data;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using Xunit;

namespace ExtraHours.API.Tests
{
    public class EmployeeServiceTests
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IManagerRepository _managerRepository;
        private readonly AppDbContext _context;
        private readonly EmployeeService _employeeService;

        public EmployeeServiceTests()
        {
            _employeeRepository = Substitute.For<IEmployeeRepository>();
            _managerRepository = Substitute.For<IManagerRepository>();
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "EmployeeServiceTestsDb")
                .Options;
            _context = new AppDbContext(options);
            _employeeService = new EmployeeService(_employeeRepository, _managerRepository, _context);
        }

        /// <summary>
        /// Verifica que EmployeeExistsAsync retorne true si el empleado existe.
        /// </summary>
        [Fact]
        public async Task EmployeeExistsAsync_ReturnsTrue_WhenEmployeeExists()
        {
            var employee = new Employee { id = 1, name = "Test" };
            _context.employees.Add(employee);
            await _context.SaveChangesAsync();
            var exists = await _employeeService.EmployeeExistsAsync(1);
            Assert.True(exists);
        }

        /// <summary>
        /// Verifica que EmployeeExistsAsync retorne false si el empleado no existe.
        /// </summary>
        [Fact]
        public async Task EmployeeExistsAsync_ReturnsFalse_WhenEmployeeDoesNotExist()
        {
            var exists = await _employeeService.EmployeeExistsAsync(999);
            Assert.False(exists);
        }

        /// <summary>
        /// Verifica que GetEmployeesByManagerIdAsync llama al repositorio y retorna la lista esperada.
        /// </summary>
        [Fact]
        public async Task GetEmployeesByManagerIdAsync_ReturnsList()
        {
            var expected = new List<Employee> { new Employee { id = 1, name = "A" } };
            _employeeRepository.GetEmployeesByManagerIdAsync(2).Returns(expected);
            var result = await _employeeService.GetEmployeesByManagerIdAsync(2);
            Assert.Equal(expected, result);
        }

        /// <summary>
        /// Verifica que GetByIdAsync retorna el empleado si existe.
        /// </summary>
        [Fact]
        public async Task GetByIdAsync_ReturnsEmployee_WhenExists()
        {
            var employee = new Employee { id = 1, name = "Test" };
            _employeeRepository.GetByIdAsync(1).Returns(employee);
            var result = await _employeeService.GetByIdAsync(1);
            Assert.Equal(employee, result);
        }

        /// <summary>
        /// Verifica que GetByIdAsync lanza excepción si el empleado no existe.
        /// </summary>
        [Fact]
        public async Task GetByIdAsync_Throws_WhenNotFound()
        {
            _employeeRepository.GetByIdAsync(1).Returns((Employee)null);
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _employeeService.GetByIdAsync(1));
        }

        /// <summary>
        /// Verifica que GetAllAsync retorna la lista de empleados del repositorio.
        /// </summary>
        [Fact]
        public async Task GetAllAsync_ReturnsList()
        {
            var expected = new List<Employee> { new Employee { id = 1, name = "A" } };
            _employeeRepository.GetAllAsync().Returns(expected);
            var result = await _employeeService.GetAllAsync();
            Assert.Equal(expected, result);
        }

        /// <summary>
        /// Verifica que AddEmployeeAsync llama al repositorio y retorna el empleado agregado.
        /// </summary>
        [Fact]
        public async Task AddEmployeeAsync_ReturnsAddedEmployee()
        {
            var employee = new Employee { id = 1, name = "Nuevo" };
            _employeeRepository.AddAsync(employee).Returns(employee);
            var result = await _employeeService.AddEmployeeAsync(employee);
            Assert.Equal(employee, result);
        }

        /// <summary>
        /// Verifica que UpdateEmployeeAsync llama al repositorio y retorna el empleado actualizado.
        /// </summary>
        [Fact]
        public async Task UpdateEmployeeAsync_ReturnsUpdatedEmployee()
        {
            var dto = new UpdateEmployeeDTO { Name = "Actualizado" };
            var updated = new Employee { id = 1, name = "Actualizado" };
            _employeeRepository.UpdateEmployeeAsync(1, dto).Returns(updated);
            var result = await _employeeService.UpdateEmployeeAsync(1, dto);
            Assert.Equal(updated, result);
        }

        /// <summary>
        /// Verifica que DeleteEmployeeAsync elimina el empleado si existe.
        /// </summary>
        [Fact]
        public async Task DeleteEmployeeAsync_Deletes_WhenExists()
        {
            var employee = new Employee { id = 1, name = "Borrar" };
            _employeeRepository.GetByIdAsync(1).Returns(employee);
            await _employeeService.DeleteEmployeeAsync(1);
            await _employeeRepository.Received().DeleteAsync(1);
        }

        /// <summary>
        /// Verifica que DeleteEmployeeAsync lanza excepción si el empleado no existe.
        /// </summary>
        [Fact]
        public async Task DeleteEmployeeAsync_Throws_WhenNotFound()
        {
            _employeeRepository.GetByIdAsync(1).Returns((Employee)null);
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _employeeService.DeleteEmployeeAsync(1));
        }
    }
}
