using System;
using System.Net.Mail;
using System.Threading.Tasks;
using ExtraHours.API.Service.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
 
namespace ExtraHours.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
 
        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }
 
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                // Verificar que exista la configuración necesaria
                var smtpServer = _configuration["Email:SmtpServer"];
                var portString = _configuration["Email:Port"];
                var username = _configuration["Email:Username"];
                var password = _configuration["Email:Password"];
                var fromEmail = _configuration["Email:FromEmail"];
 
                // Validar que todas las configuraciones existan
                if (string.IsNullOrEmpty(smtpServer) ||
                    string.IsNullOrEmpty(portString) ||
                    string.IsNullOrEmpty(username) ||
                    string.IsNullOrEmpty(password) ||
                    string.IsNullOrEmpty(fromEmail))
                {
                    _logger.LogError("La configuración de email está incompleta. Verifique appsettings.json");
                    return;
                }
 
                // Convertir el puerto a entero de forma segura
                if (!int.TryParse(portString, out int port))
                {
                    _logger.LogError($"El valor del puerto '{portString}' no es un número válido");
                    return;
                }
 
                using (var smtpClient = new SmtpClient(smtpServer))
                {
                    smtpClient.Port = port;
                    smtpClient.Credentials = new System.Net.NetworkCredential(username, password);
                    smtpClient.EnableSsl = true;
 
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(fromEmail),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };
                    mailMessage.To.Add(to);
 
                    await smtpClient.SendMailAsync(mailMessage);
                    _logger.LogInformation($"Email enviado a {to} con asunto: {subject}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al enviar email: {ex.Message}");
            }
        }
    }
}