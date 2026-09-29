using System;
using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.Models
{
    public class NewsletterSubscriber
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        public DateTime SubscribedAt { get; set; } = DateTime.UtcNow;
    }
}
