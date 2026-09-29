using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hotel_booking_website.Data;
using hotel_booking_website.DTOs;
using hotel_booking_website.Models;

namespace hotel_booking_website.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public BookingsController(HotelDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings([FromQuery] string? email)
        {
            var query = _context.Bookings.AsQueryable();

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(currentUserId))
            {
                query = query.Where(b => b.UserId == currentUserId || (email != null && b.Email.ToLower() == email.ToLower()));
            }
            else if (!string.IsNullOrWhiteSpace(email))
            {
                query = query.Where(b => b.Email.ToLower() == email.ToLower());
            }

            var bookings = await query
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(string id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = $"Booking '{id}' was not found." });
            }

            return Ok(booking);
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking([FromBody] BookingCreateDto dto)
        {
            var room = await _context.Rooms.FindAsync(dto.RoomId);
            if (room == null)
            {
                return BadRequest(new { message = $"Selected room '{dto.RoomId}' does not exist." });
            }

            // Calculate nights
            int nights = 1;
            if (DateTime.TryParse(dto.CheckIn, out var d1) && DateTime.TryParse(dto.CheckOut, out var d2))
            {
                var diff = (d2 - d1).Days;
                nights = diff > 0 ? diff : 1;
            }

            // Calculate base rate
            decimal baseTotal = room.PricePerNight * nights;

            // Calculate addons
            decimal addonsTotal = 0;
            var availableAddons = await _context.LuxuryAddons.ToListAsync();
            var matchedAddonsNames = new List<string>();

            if (dto.SelectedAddons != null && dto.SelectedAddons.Count > 0)
            {
                foreach (var addonIdOrName in dto.SelectedAddons)
                {
                    var found = availableAddons.FirstOrDefault(a => 
                        a.Id.Equals(addonIdOrName, StringComparison.OrdinalIgnoreCase) || 
                        a.Name.Equals(addonIdOrName, StringComparison.OrdinalIgnoreCase));
                    if (found != null)
                    {
                        addonsTotal += found.Price;
                        matchedAddonsNames.Add(found.Name);
                    }
                    else
                    {
                        matchedAddonsNames.Add(addonIdOrName);
                    }
                }
            }

            decimal subtotal = baseTotal + addonsTotal;

            // Apply promotional discount if valid
            decimal discountPercentage = 0;
            if (!string.IsNullOrWhiteSpace(dto.PromoCode))
            {
                var offer = await _context.SpecialOffers
                    .FirstOrDefaultAsync(o => o.Code.ToUpper() == dto.PromoCode.Trim().ToUpper() && o.IsActive);
                if (offer != null)
                {
                    discountPercentage = offer.DiscountPercentage;
                }
            }

            decimal discountAmount = (subtotal * discountPercentage) / 100m;
            decimal discountedSubtotal = subtotal - discountAmount;
            decimal taxesUSD = Math.Round(discountedSubtotal * 0.12m, 2); // 12% luxury tax
            decimal totalAmountUSD = Math.Round(discountedSubtotal + taxesUSD, 2);

            decimal rate = dto.CurrencyRate > 0 ? dto.CurrencyRate : 1.0m;
            decimal convertedTotal = Math.Round(totalAmountUSD * rate, 2);

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var booking = new Booking
            {
                Id = $"LXH-{new Random().Next(100000, 999999)}",
                RoomId = room.Id,
                RoomName = room.Name,
                DestinationName = room.DestinationName,
                RoomImage = room.Images.FirstOrDefault() ?? string.Empty,
                PricePerNight = room.PricePerNight,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                Nights = nights,
                Guests = $"{dto.Adults} Adults, {dto.Children} Children",
                SelectedAddons = matchedAddonsNames,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                SpecialRequests = dto.SpecialRequests,
                PaymentMethod = dto.PaymentMethod ?? "card",
                TotalAmountUSD = totalAmountUSD,
                Currency = dto.Currency ?? "USD",
                CurrencySymbol = dto.CurrencySymbol ?? "$",
                ConvertedTotal = convertedTotal,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow,
                UserId = currentUserId
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(string id, [FromBody] BookingStatusUpdateDto dto)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = $"Booking '{id}' was not found." });
            }

            booking.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(booking);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(string id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = $"Booking '{id}' was not found." });
            }

            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Booking '{id}' has been successfully cancelled with full refund guarantee.", booking });
        }
    }
}
