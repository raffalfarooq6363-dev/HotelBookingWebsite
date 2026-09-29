using System;
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
    public class NewsletterController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public NewsletterController(HotelDbContext context)
        {
            _context = context;
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] SubscribeNewsletterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            var cleanEmail = dto.Email.Trim().ToLower();
            var existing = await _context.NewsletterSubscribers
                .FirstOrDefaultAsync(s => s.Email == cleanEmail);

            if (existing != null)
            {
                return Ok(new { message = "You are already a privileged member of the LuxeClub newsletter!" });
            }

            var subscriber = new NewsletterSubscriber
            {
                Email = cleanEmail,
                SubscribedAt = DateTime.UtcNow
            };

            _context.NewsletterSubscribers.Add(subscriber);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Welcome to LuxeClub! Your 10% welcome privilege has been transmitted to your inbox." });
        }
    }
}
