namespace hotel_booking_website.DTOs
{
    public class SiteContentUpdateDto
    {
        public string ContentJson { get; set; } = string.Empty;
    }

    public class DestinationUpdateDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
    }
}
