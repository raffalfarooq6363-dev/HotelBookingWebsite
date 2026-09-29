using System;
using System.Collections.Generic;
using System.Linq;
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
    public class ReviewsController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public ReviewsController(HotelDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews([FromQuery] string? roomId)
        {
            var query = _context.Reviews.AsQueryable();

            if (!string.IsNullOrWhiteSpace(roomId))
            {
                query = query.Where(r => r.RoomId == roomId);
            }

            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPost]
        public async Task<ActionResult<Review>> SubmitReview([FromBody] CreateReviewDto dto)
        {
            var review = new Review
            {
                Name = dto.Name,
                Title = dto.Title ?? "Verified Luxury Guest",
                Location = dto.Location ?? "Global Traveler",
                Avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                HotelStayed = dto.HotelStayed ?? "LuxeHaven Suite",
                RoomId = dto.RoomId,
                Rating = dto.Rating,
                Date = DateTime.UtcNow.ToString("MMMM yyyy"),
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(review);
        }
    }
}
