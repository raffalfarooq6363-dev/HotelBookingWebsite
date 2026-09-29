using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.DTOs
{
    public class RoomFilterDto
    {
        public string? Destination { get; set; } = "all";
        public string? Category { get; set; } = "All";
        public decimal? MaxPrice { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MinRating { get; set; }
        public int? Guests { get; set; }
        public string? Amenities { get; set; } // Comma-separated
        public string? SortBy { get; set; } = "featured"; // "featured", "price-asc", "price-desc", "rating", "reviews"
        public string? SearchTerm { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class RoomCreateUpdateDto
    {
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

        public decimal Rating { get; set; } = 4.9m;

        public int ReviewsCount { get; set; } = 0;

        [Required]
        public decimal PricePerNight { get; set; }

        public decimal? OriginalPrice { get; set; }

        public string? DiscountBadge { get; set; }

        public bool Featured { get; set; } = false;

        public string? Badge { get; set; }

        public int MaxGuests { get; set; } = 2;

        public int Bedrooms { get; set; } = 1;

        public int Bathrooms { get; set; } = 1;

        public int SizeSqM { get; set; } = 50;

        public string BedType { get; set; } = "1 King Bed";

        public string View { get; set; } = string.Empty;

        public List<string> Images { get; set; } = new();

        public string Description { get; set; } = string.Empty;

        public List<string> Amenities { get; set; } = new();

        public List<string> Highlights { get; set; } = new();
    }
}
