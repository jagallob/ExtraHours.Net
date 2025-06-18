namespace ExtraHours.API.Tests
{
    using System;
    using Xunit;
    using ExtraHours.API.Service.Implementations;

    public class ColombianHolidayServiceTests
    {
        [Theory]
        [InlineData("2025-01-01", true)]  // Año Nuevo (fijo)
        [InlineData("2025-05-01", true)]  // Día del Trabajo (fijo)
        [InlineData("2025-01-06", false)] // Fecha original de Reyes Magos (cae lunes por defecto, revisar lógica)
        [InlineData("2025-01-13", false)]  // Lunes siguiente si aplica traslado (Revisar lógica)
        [InlineData("2025-04-13", true)]  // Domingo (cualquier domingo debería ser festivo)
        [InlineData("2025-04-17", true)]  // Jueves Santo (dep. de Pascua)
        [InlineData("2025-04-18", true)]  // Viernes Santo (dep. de Pascua)
        [InlineData("2025-07-20", true)]  // Día de la Independencia (fijo)
        [InlineData("2025-07-21", false)] // Día normal
        public void IsPublicHoliday_MultipleDates(string dateString, bool expected)
        {
            // Arrange
            var service = new ColombianHolidayService();
            var testDate = DateTime.Parse(dateString);

            // Act
            var result = service.IsPublicHoliday(testDate);

            // Assert
            Assert.Equal(expected, result);
        }
    }
}