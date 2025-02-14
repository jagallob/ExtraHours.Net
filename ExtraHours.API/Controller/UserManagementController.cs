//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace ExtraHours.API.Controller
//{

//    [Route("api/users")]
//    [ApiController]
//    [Authorize(Roles = "superuser")]
//    public class UserManagementController : ControllerBase
//    {
//        private readonly IUserService _userService;

//        public UserManagementController(IUserService userService)
//        {
//            _userService = userService;
//        }

//        [HttpGet]
//        public async Task<IActionResult<IEnumerable<UserDto>>> GetUsers()
//        {
//            var users = await _userService.GetAllUsersAsync();
//            return Ok(users);
//        }

//        [HttpGet("{id}")]
//        public async Task<IActionResult<UserDto>> GetUser(int id)
//        {
//            var user = await _userService.GetUserByIdAsync(id);
//            if (user == null)
//            {
//                return NotFound();
//            }
//            return Ok(user);
//        }

//        [HttpPost]
//        public async Task<ActionResult<UserDto>> CreateUser([FromBody] UserDto userDto)
//        {
//            var createdUser = await _userService.CreateUserAsync(userDto);
//            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, createdUser);
//        }

//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDto userDto)
//        {
//            var updated = await _userService.UpdateUserAsync(id, userDto);
//            if (!updated)
//            {
//                return NotFound();
//            }
//            return NoContent();
//        }

//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteUser(int id)
//        {
//            var deleted = await _userService.DeleteUserAsync(id);
//            if (!deleted)
//            {
//                return NotFound();
//            }
//            return NoContent();
//        }
        
//    }
//}
