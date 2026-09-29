using System;
using System.Collections.Generic;
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
    public class OffersController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public OffersController(HotelDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecialOffer>>> GetOffers()
        {
            var offers = await _context.SpecialOffers
                .Where(o => o.IsActive)
                .ToListAsync();

            return Ok(offers);
        }

        [HttpPost("validate")]
        public async Task<ActionResult<PromoResponseDto>> ValidatePromo([FromBody] ValidatePromoDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Code))
            {
                return BadRequest(new PromoResponseDto
                {
                    IsValid = false,
                    Message = "Please enter a valid promotional code."
                });
            }

            var cleanCode = dto.Code.Trim().ToUpper();
            var offer = await _context.SpecialOffers
                .FirstOrDefaultAsync(o => o.Code.ToUpper() == cleanCode && o.IsActive);

            if (offer == null)
            {
                return Ok(new PromoResponseDto
                {
                    IsValid = false,
                    Code = cleanCode,
                    DiscountPercentage = 0,
                    Message = "Invalid or expired promotional code."
                });
            }

            return Ok(new PromoResponseDto
            {
                IsValid = true,
                Code = offer.Code,
                DiscountPercentage = offer.DiscountPercentage,
                Message = $"{offer.DiscountPercentage}% discount applied: {offer.Title}!"
            });
        }

        [HttpGet("addons")]
        public async Task<ActionResult<IEnumerable<LuxuryAddon>>> GetAddons()
        {
            var addons = await _context.LuxuryAddons.ToListAsync();
            return Ok(addons);
        }
    }
}
