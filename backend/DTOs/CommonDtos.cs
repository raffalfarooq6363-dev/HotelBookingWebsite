using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.DTOs
{
    public class ValidatePromoDto
    {
        [Required]
        public string Code { get; set; } = string.Empty;
    }

    public class PromoResponseDto
    {
        public bool IsValid { get; set; }
        public string Code { get; set; } = string.Empty;
        public int DiscountPercentage { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class CreateReviewDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Title { get; set; } = "Verified Luxury Guest";

        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        public string? HotelStayed { get; set; }

        public string? RoomId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; } = 5;

        [Required]
        [MaxLength(1500)]
        public string Comment { get; set; } = string.Empty;
    }

    public class SubscribeNewsletterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
