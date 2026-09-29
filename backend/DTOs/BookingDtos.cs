using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.DTOs
{
    public class BookingCreateDto
    {
        [Required]
        public string RoomId { get; set; } = string.Empty;

        [Required]
        public string CheckIn { get; set; } = string.Empty;

        [Required]
        public string CheckOut { get; set; } = string.Empty;

        public int Adults { get; set; } = 2;

        public int Children { get; set; } = 0;

        public List<string> SelectedAddons { get; set; } = new();

        public string? PromoCode { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Phone { get; set; }

        [MaxLength(1000)]
        public string? SpecialRequests { get; set; }

        public string PaymentMethod { get; set; } = "card";

        public string Currency { get; set; } = "USD";

        public string CurrencySymbol { get; set; } = "$";

        public decimal CurrencyRate { get; set; } = 1.0m;
    }

    public class BookingStatusUpdateDto
    {
        [Required]
        public string Status { get; set; } = "Confirmed";
    }
}
