using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hotel_booking_website.Models
{
    public class Booking
    {
        [Key]
        [MaxLength(50)]
        public string Id { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string RoomId { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string RoomName { get; set; } = string.Empty;

        [MaxLength(150)]
        public string DestinationName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? RoomImage { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal PricePerNight { get; set; }

        [Required]
        [MaxLength(20)]
        public string CheckIn { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string CheckOut { get; set; } = string.Empty;

        public int Nights { get; set; } = 1;

        [MaxLength(100)]
        public string Guests { get; set; } = "2 Adults";

        public List<string> SelectedAddons { get; set; } = new();

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

        [MaxLength(50)]
        public string PaymentMethod { get; set; } = "card";

        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalAmountUSD { get; set; }

        [MaxLength(10)]
        public string Currency { get; set; } = "USD";

        [MaxLength(10)]
        public string CurrencySymbol { get; set; } = "$";

        [Column(TypeName = "decimal(18, 2)")]
        public decimal ConvertedTotal { get; set; }

        [MaxLength(30)]
        public string Status { get; set; } = "Confirmed";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        public string? UserId { get; set; }
    }
}
