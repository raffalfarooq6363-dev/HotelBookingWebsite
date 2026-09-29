using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.Models
{
    public class SpecialOffer
    {
        [Key]
        [MaxLength(50)]
        public string Id { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Discount { get; set; } = string.Empty;

        public int DiscountPercentage { get; set; } = 0;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ValidUntil { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Accent { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }
}
