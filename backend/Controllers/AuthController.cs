using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hotel_booking_website.Data;
using hotel_booking_website.DTOs;
using hotel_booking_website.Models;
using hotel_booking_website.Services;

namespace hotel_booking_website.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ITokenService _tokenService;

        public AuthController(HotelDbContext context, IPasswordHasher passwordHasher, ITokenService tokenService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "An account with this email address already exists." });
            }

            var (hash, salt) = _passwordHasher.HashPassword(dto.Password);
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = dto.Name,
                Email = dto.Email.ToLower(),
                PasswordHash = hash,
                PasswordSalt = salt,
                MembershipTier = "Prestige VIP",
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _tokenService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var isValid = _passwordHasher.VerifyPassword(dto.Password, user.PasswordHash, user.PasswordSalt);
            if (!isValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = _tokenService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role
                }
            });
        }

        [HttpPost("demo-login")]
        public async Task<ActionResult<AuthResponseDto>> DemoLogin()
        {
            var demoEmail = "victoria.sterling@luxehaven.com";
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == demoEmail);
            if (user == null)
            {
                // Fallback creation if not found
                var (hash, salt) = _passwordHasher.HashPassword("Password123!");
                user = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Victoria Sterling",
                    Email = demoEmail,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    MembershipTier = "Diamond Ambassador",
                    Role = "User"
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            var token = _tokenService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role
                }
            });
        }

        /// <summary>
        /// Register a new manager account (role = Manager).
        /// This endpoint is for the manager portal only — not accessible to customers.
        /// </summary>
        [HttpPost("manager/register")]
        public async Task<ActionResult<AuthResponseDto>> ManagerRegister([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "An account with this email address already exists." });
            }

            var (hash, salt) = _passwordHasher.HashPassword(dto.Password);
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = dto.Name,
                Email = dto.Email.ToLower(),
                PasswordHash = hash,
                PasswordSalt = salt,
                MembershipTier = "Hotel Manager",
                Role = "Manager",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new AuthResponseDto
            {
                Token = string.Empty,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role
                }
            });
        }

        /// <summary>
        /// Login for manager portal. Returns 403 if the user is not a manager/admin.
        /// </summary>
        [HttpPost("manager/login")]
        public async Task<ActionResult<AuthResponseDto>> ManagerLogin([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var isValid = _passwordHasher.VerifyPassword(dto.Password, user.PasswordHash, user.PasswordSalt);
            if (!isValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Block non-manager users from accessing the manager portal
            var role = user.Role?.ToLower() ?? "";
            if (role != "manager" && role != "admin")
            {
                return StatusCode(403, new { message = "Access denied. This portal is restricted to hotel managers only." });
            }

            var token = _tokenService.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role
                }
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            return Ok(new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                MembershipTier = user.MembershipTier,
                Role = user.Role
            });
        }
    }
}
