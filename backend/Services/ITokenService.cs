using hotel_booking_website.Models;

namespace hotel_booking_website.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
