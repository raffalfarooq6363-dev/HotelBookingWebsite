using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hotel_booking_website.Data;
using hotel_booking_website.DTOs;
using hotel_booking_website.Models;

namespace hotel_booking_website.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public AdminController(HotelDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get dashboard statistics for manager/admin
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult> GetDashboardStats()
        {
            var totalBookings = await _context.Bookings.CountAsync();
            var confirmedBookings = await _context.Bookings.CountAsync(b => b.Status == "Confirmed");
            var cancelledBookings = await _context.Bookings.CountAsync(b => b.Status == "Cancelled");
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == "Confirmed")
                .SumAsync(b => b.TotalAmountUSD);
            var totalRooms = await _context.Rooms.CountAsync();
            var totalUsers = await _context.Users.CountAsync();
            var totalReviews = await _context.Reviews.CountAsync();
            var totalSubscribers = await _context.NewsletterSubscribers.CountAsync();
            var avgRating = await _context.Reviews.AnyAsync()
                ? await _context.Reviews.AverageAsync(r => (decimal)r.Rating)
                : 0;

            return Ok(new
            {
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                totalRevenue,
                totalRooms,
                totalUsers,
                totalReviews,
                totalSubscribers,
                averageRating = Math.Round(avgRating, 2)
            });
        }

        /// <summary>
        /// Get all bookings for manager view
        /// </summary>
        [HttpGet("bookings")]
        public async Task<ActionResult> GetAllBookings()
        {
            var bookings = await _context.Bookings
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(bookings);
        }

        /// <summary>
        /// Get all users for manager view
        /// </summary>
        [HttpGet("users")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.MembershipTier,
                    u.Role,
                    u.CreatedAt
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Get all reviews for manager view
        /// </summary>
        [HttpGet("reviews")]
        public async Task<ActionResult> GetAllReviews()
        {
            var reviews = await _context.Reviews
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }

        /// <summary>
        /// Get all newsletter subscribers
        /// </summary>
        [HttpGet("subscribers")]
        public async Task<ActionResult> GetAllSubscribers()
        {
            var subscribers = await _context.NewsletterSubscribers
                .OrderByDescending(s => s.SubscribedAt)
                .ToListAsync();

            return Ok(subscribers);
        }

        /// <summary>
        /// Update booking status
        /// </summary>
        [HttpPut("bookings/{id}/status")]
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

        /// <summary>
        /// Delete a room
        /// </summary>
        [HttpDelete("rooms/{id}")]
        public async Task<IActionResult> DeleteRoom(string id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = $"Room '{id}' was not found." });
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Room '{id}' has been deleted." });
        }
    }
}
