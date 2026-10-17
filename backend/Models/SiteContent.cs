using System;
using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.Models
{
    public class SiteContent
    {
        [Key]
        public string Key { get; set; } = string.Empty;
        public string ContentJson { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
