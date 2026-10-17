using System;
using System.Collections.Generic;
using System.Linq;
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

        private async Task<List<string>> GetPermissionsForRoleAsync(string? role)
        {
            if (string.IsNullOrWhiteSpace(role)) return new List<string>();

            // Super Admin / Manager gets all modules
            if (string.Equals(role, "Manager", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                return new List<string>
                {
                    "overview",
                    "frontpage",
                    "bookings",
                    "rooms",
                    "users",
                    "reviews",
                    "newsletter",
                    "chat",
                    "roles"
                };
            }

            var rp = await _context.RolePermissions
                .FirstOrDefaultAsync(r => r.RoleName.ToLower() == role.ToLower());

            if (rp != null && rp.AllowedModules != null && rp.AllowedModules.Any())
            {
                return rp.AllowedModules;
            }

            // Fallback default permissions by common role names if not yet customized
            var rLower = role.ToLower();
            if (rLower.Contains("reception") || rLower.Contains("front desk"))
            {
                return new List<string> { "overview", "bookings", "chat" };
            }
            if (rLower.Contains("room") || rLower.Contains("inventory") || rLower.Contains("housekeep"))
            {
                return new List<string> { "overview", "rooms" };
            }
            if (rLower.Contains("marketing") || rLower.Contains("content"))
            {
                return new List<string> { "frontpage", "newsletter", "reviews" };
            }
            if (rLower.Contains("support") || rLower.Contains("concierge"))
            {
                return new List<string> { "overview", "chat", "reviews", "bookings" };
            }

            return new List<string> { "overview" };
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
            var permissions = await GetPermissionsForRoleAsync(user.Role);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role,
                    Permissions = permissions
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
            var permissions = await GetPermissionsForRoleAsync(user.Role);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role,
                    Permissions = permissions
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
            var permissions = await GetPermissionsForRoleAsync(user.Role);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role,
                    Permissions = permissions
                }
            });
        }

        /// <summary>
        /// Register a new manager account (role = Manager).
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
                MembershipTier = "Hotel Executive",
                Role = "Manager",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var permissions = await GetPermissionsForRoleAsync(user.Role);

            return Ok(new AuthResponseDto
            {
                Token = string.Empty,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role,
                    Permissions = permissions
                }
            });
        }

        /// <summary>
        /// Login for management dashboard.
        /// Allows Managers, Admins, and all staff users with designated dashboard roles.
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

            // Block standard customer accounts from accessing the manager/staff portal
            var role = user.Role?.Trim() ?? "";
            if (string.Equals(role, "User", StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(403, new { message = "Access denied. This dashboard is restricted to hotel staff and managers with assigned roles." });
            }

            var token = _tokenService.GenerateToken(user);
            var permissions = await GetPermissionsForRoleAsync(user.Role);

            return Ok(new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    MembershipTier = user.MembershipTier,
                    Role = user.Role,
                    Permissions = permissions
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

            var permissions = await GetPermissionsForRoleAsync(user.Role);

            return Ok(new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                MembershipTier = user.MembershipTier,
                Role = user.Role,
                Permissions = permissions
            });
        }
    }
}
