using System;
using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Title { get; set; } = "Verified Luxury Guest";

        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Avatar { get; set; }

        [MaxLength(200)]
        public string HotelStayed { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? RoomId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; } = 5;

        [MaxLength(50)]
        public string Date { get; set; } = string.Empty;

        [Required]
        [MaxLength(1500)]
        public string Comment { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
