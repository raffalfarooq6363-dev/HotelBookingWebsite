using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.Models
{
    public class Destination
    {
        [Key]
        [MaxLength(50)]
        public string Id { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Image { get; set; }
    }
}
