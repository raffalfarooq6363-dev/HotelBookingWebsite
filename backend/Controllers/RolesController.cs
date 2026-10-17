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
    public class RolesController : ControllerBase
    {
        private readonly HotelDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public static readonly List<ModuleInfo> AllModules = new()
        {
            new ModuleInfo { Id = "overview", Label = "Dashboard Overview", Description = "Executive stats, total revenue, bookings overview and recent stays", Category = "Analytics", Icon = "BarChart3" },
            new ModuleInfo { Id = "frontpage", Label = "Front Page & Images", Description = "Hero section, bespoke experiences, marketing text and destination cards", Category = "CMS", Icon = "Layout" },
            new ModuleInfo { Id = "bookings", Label = "Bookings", Description = "Full reservation management, status toggles, guest check-in workflows", Category = "Operations", Icon = "Briefcase" },
            new ModuleInfo { Id = "rooms", Label = "Rooms & Suites", Description = "Room inventory, tariffs, luxury amenities and room catalog management", Category = "Inventory", Icon = "Hotel" },
            new ModuleInfo { Id = "users", Label = "Guest Accounts", Description = "Guest profiles, membership tiers (Prestige, VIP) and account details", Category = "Guests", Icon = "Users" },
            new ModuleInfo { Id = "reviews", Label = "Guest Reviews", Description = "Customer ratings, feedback testimonials and luxury experience reviews", Category = "Quality", Icon = "Star" },
            new ModuleInfo { Id = "newsletter", Label = "Newsletter Subscribers", Description = "Mailing list subscribers, luxury club member signups and emails", Category = "Marketing", Icon = "Mail" },
            new ModuleInfo { Id = "chat", Label = "Customer Live Chat", Description = "Real-time guest support, concierge messaging, and live inquiries", Category = "Concierge", Icon = "MessageCircle" },
            new ModuleInfo { Id = "roles", Label = "Role & Permissions", Description = "Configure role access, module permissions, and manage staff credentials", Category = "Administration", Icon = "Shield" }
        };

        public RolesController(HotelDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        /// <summary>
        /// Get all registered system and custom modules
        /// </summary>
        [HttpGet("modules")]
        public ActionResult<List<ModuleInfo>> GetAvailableModules()
        {
            return Ok(AllModules);
        }

        /// <summary>
        /// Get all roles with their assigned module permissions and staff count
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<RoleDto>>> GetAllRoles()
        {
            var roles = await _context.RolePermissions
                .OrderBy(r => r.IsSystem ? 0 : 1)
                .ThenBy(r => r.RoleName)
                .ToListAsync();

            // Count users per role
            var userCounts = await _context.Users
                .GroupBy(u => u.Role)
                .Select(g => new { Role = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Role ?? "", x => x.Count, StringComparer.OrdinalIgnoreCase);

            var result = roles.Select(r => new RoleDto
            {
                Id = r.Id,
                RoleName = r.RoleName,
                Description = r.Description,
                IsSystem = r.IsSystem,
                AllowedModules = r.AllowedModules ?? new List<string>(),
                UserCount = userCounts.TryGetValue(r.RoleName, out var count) ? count : 0
            }).ToList();

            return Ok(result);
        }

        /// <summary>
        /// Get permissions for a specific role or the current user's role
        /// </summary>
        [HttpGet("permissions/{roleName}")]
        public async Task<ActionResult<List<string>>> GetPermissionsForRole(string roleName)
        {
            if (string.Equals(roleName, "Manager", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(roleName, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                return Ok(AllModules.Select(m => m.Id).ToList());
            }

            var role = await _context.RolePermissions
                .FirstOrDefaultAsync(r => r.RoleName.ToLower() == roleName.ToLower());

            if (role == null)
            {
                return Ok(new List<string> { "overview" });
            }

            return Ok(role.AllowedModules ?? new List<string>());
        }

        /// <summary>
        /// Create a new custom role
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<RoleDto>> CreateRole([FromBody] CreateRoleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.RoleName))
            {
                return BadRequest(new { message = "Role name cannot be empty." });
            }

            var cleanName = dto.RoleName.Trim();
            if (await _context.RolePermissions.AnyAsync(r => r.RoleName.ToLower() == cleanName.ToLower()))
            {
                return BadRequest(new { message = $"A role with name '{cleanName}' already exists." });
            }

            // Sanitize allowed modules against AllModules list
            var validModuleIds = AllModules.Select(m => m.Id).ToHashSet();
            var allowedModules = (dto.AllowedModules ?? new List<string>())
                .Where(m => validModuleIds.Contains(m))
                .Distinct()
                .ToList();

            var role = new RolePermission
            {
                Id = "role-" + Guid.NewGuid().ToString("N")[..8],
                RoleName = cleanName,
                Description = dto.Description?.Trim() ?? string.Empty,
                IsSystem = false,
                AllowedModules = allowedModules,
                UpdatedAt = DateTime.UtcNow
            };

            _context.RolePermissions.Add(role);
            await _context.SaveChangesAsync();

            return Ok(new RoleDto
            {
                Id = role.Id,
                RoleName = role.RoleName,
                Description = role.Description,
                IsSystem = role.IsSystem,
                AllowedModules = role.AllowedModules,
                UserCount = 0
            });
        }

        /// <summary>
        /// Update permissions and description for an existing role
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<RoleDto>> UpdateRole(string id, [FromBody] UpdateRolePermissionsDto dto)
        {
            var role = await _context.RolePermissions.FindAsync(id);
            if (role == null)
            {
                return NotFound(new { message = $"Role with ID '{id}' was not found." });
            }

            var validModuleIds = AllModules.Select(m => m.Id).ToHashSet();
            var allowedModules = (dto.AllowedModules ?? new List<string>())
                .Where(m => validModuleIds.Contains(m))
                .Distinct()
                .ToList();

            // If it's the Manager/Admin system role, always keep 'roles' permission to prevent lockout
            if (role.IsSystem && (role.RoleName.Equals("Manager", StringComparison.OrdinalIgnoreCase) ||
                                  role.RoleName.Equals("Admin", StringComparison.OrdinalIgnoreCase)))
            {
                if (!allowedModules.Contains("roles"))
                {
                    allowedModules.Add("roles");
                }
            }

            role.AllowedModules = allowedModules;
            if (!string.IsNullOrWhiteSpace(dto.Description))
            {
                role.Description = dto.Description.Trim();
            }
            role.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var userCount = await _context.Users.CountAsync(u => u.Role == role.RoleName);

            return Ok(new RoleDto
            {
                Id = role.Id,
                RoleName = role.RoleName,
                Description = role.Description,
                IsSystem = role.IsSystem,
                AllowedModules = role.AllowedModules,
                UserCount = userCount
            });
        }

        /// <summary>
        /// Delete a custom role (system roles cannot be deleted)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _context.RolePermissions.FindAsync(id);
            if (role == null)
            {
                return NotFound(new { message = $"Role with ID '{id}' was not found." });
            }

            if (role.IsSystem)
            {
                return BadRequest(new { message = $"System role '{role.RoleName}' cannot be deleted." });
            }

            // Check if any users are currently assigned to this role
            var assignedCount = await _context.Users.CountAsync(u => u.Role == role.RoleName);
            if (assignedCount > 0)
            {
                // Reassign users to standard staff or User
                var usersToUpdate = await _context.Users.Where(u => u.Role == role.RoleName).ToListAsync();
                foreach (var u in usersToUpdate)
                {
                    u.Role = "User";
                }
            }

            _context.RolePermissions.Remove(role);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Role '{role.RoleName}' deleted successfully." });
        }

        /// <summary>
        /// Get all staff users and their assigned roles
        /// </summary>
        [HttpGet("staff")]
        public async Task<ActionResult> GetStaffMembers()
        {
            var staff = await _context.Users
                .Where(u => u.Role != "User")
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.MembershipTier,
                    u.CreatedAt
                })
                .OrderBy(u => u.Role)
                .ThenBy(u => u.Name)
                .ToListAsync();

            return Ok(staff);
        }

        /// <summary>
        /// Change a user's role
        /// </summary>
        [HttpPut("users/{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(string userId, [FromBody] UpdateUserRoleDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = $"User with ID '{userId}' was not found." });
            }

            user.Role = dto.Role.Trim();
            if (user.Role.Equals("Manager", StringComparison.OrdinalIgnoreCase) || user.Role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                user.MembershipTier = "Hotel Executive";
            }
            else if (!user.Role.Equals("User", StringComparison.OrdinalIgnoreCase))
            {
                user.MembershipTier = $"Staff ({user.Role})";
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"User role updated to '{user.Role}' successfully.",
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.MembershipTier
                }
            });
        }

        /// <summary>
        /// Create a new staff account directly from the manager dashboard
        /// </summary>
        [HttpPost("staff")]
        public async Task<ActionResult> CreateStaffMember([FromBody] CreateStaffDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "An account with this email address already exists." });
            }

            var (hash, salt) = _passwordHasher.HashPassword(dto.Password);
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = dto.Name.Trim(),
                Email = dto.Email.ToLower().Trim(),
                PasswordHash = hash,
                PasswordSalt = salt,
                MembershipTier = dto.Role.Equals("Manager", StringComparison.OrdinalIgnoreCase) ? "Hotel Executive" : $"Staff ({dto.Role})",
                Role = dto.Role.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Staff member '{user.Name}' with role '{user.Role}' created successfully.",
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.MembershipTier,
                    user.CreatedAt
                }
            });
        }
    }
}
