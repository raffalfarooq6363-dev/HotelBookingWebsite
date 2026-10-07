using System;

namespace hotel_booking_website.Models
{
    public class SiteContent
    {
        public string Key { get; set; } = string.Empty;
        public string ContentJson { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
