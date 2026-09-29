using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hotel_booking_website.Models
{
    public class Room
    {
        [Key]
        [MaxLength(50)]
        public string Id { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string DestinationId { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string DestinationName { get; set; } = string.Empty;

        public int Stars { get; set; } = 5;

        [Column(TypeName = "decimal(3, 2)")]
        public decimal Rating { get; set; } = 4.9m;

        public int ReviewsCount { get; set; } = 0;

        [Column(TypeName = "decimal(18, 2)")]
        public decimal PricePerNight { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? OriginalPrice { get; set; }

        [MaxLength(50)]
        public string? DiscountBadge { get; set; }

        public bool Featured { get; set; } = false;

        [MaxLength(50)]
        public string? Badge { get; set; }

        public int MaxGuests { get; set; } = 2;

        public int Bedrooms { get; set; } = 1;

        public int Bathrooms { get; set; } = 1;

        public int SizeSqM { get; set; }

        [MaxLength(100)]
        public string BedType { get; set; } = "1 King Bed";

        [MaxLength(200)]
        public string View { get; set; } = string.Empty;

        public List<string> Images { get; set; } = new();

        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        public List<string> Amenities { get; set; } = new();

        public List<string> Highlights { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
