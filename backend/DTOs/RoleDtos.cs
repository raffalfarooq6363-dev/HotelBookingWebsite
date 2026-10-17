using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.DTOs
{
    public class RoleDto
    {
        public string Id { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsSystem { get; set; } = false;
        public List<string> AllowedModules { get; set; } = new();
        public int UserCount { get; set; } = 0;
    }

    public class CreateRoleDto
    {
        [Required]
        [MaxLength(60)]
        public string RoleName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string Description { get; set; } = string.Empty;

        public List<string> AllowedModules { get; set; } = new();
    }

    public class UpdateRolePermissionsDto
    {
        [MaxLength(255)]
        public string? Description { get; set; }

        [Required]
        public List<string> AllowedModules { get; set; } = new();
    }

    public class UpdateUserRoleDto
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class CreateStaffDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class ModuleInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
    }
}
