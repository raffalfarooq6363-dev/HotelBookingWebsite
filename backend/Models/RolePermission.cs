using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.Models
{
    public class RolePermission
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(60)]
        public string RoleName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string Description { get; set; } = string.Empty;

        public bool IsSystem { get; set; } = false;

        public List<string> AllowedModules { get; set; } = new();

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
