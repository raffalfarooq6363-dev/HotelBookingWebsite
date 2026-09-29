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
    public class RoomsController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public RoomsController(HotelDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms([FromQuery] RoomFilterDto filter)
        {
            var query = _context.Rooms.AsQueryable();

            // Destination filter
            if (!string.IsNullOrWhiteSpace(filter.Destination) && filter.Destination.ToLower() != "all")
            {
                query = query.Where(r => r.DestinationId.ToLower() == filter.Destination.ToLower());
            }

            // Category filter
            if (!string.IsNullOrWhiteSpace(filter.Category) && filter.Category.ToLower() != "all")
            {
                query = query.Where(r => r.Category.ToLower() == filter.Category.ToLower());
            }

            // Price filters
            if (filter.MinPrice.HasValue)
            {
                query = query.Where(r => r.PricePerNight >= filter.MinPrice.Value);
            }
            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(r => r.PricePerNight <= filter.MaxPrice.Value);
            }

            // Rating filter
            if (filter.MinRating.HasValue && filter.MinRating.Value > 0)
            {
                query = query.Where(r => r.Rating >= filter.MinRating.Value);
            }

            // Guests filter
            if (filter.Guests.HasValue && filter.Guests.Value > 0)
            {
                query = query.Where(r => r.MaxGuests >= filter.Guests.Value);
            }

            // Text search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var term = filter.SearchTerm.ToLower();
                query = query.Where(r => 
                    r.Name.ToLower().Contains(term) || 
                    r.DestinationName.ToLower().Contains(term) ||
                    r.Description.ToLower().Contains(term)
                );
            }

            var rooms = await query.ToListAsync();

            // Amenity filter in memory (since amenities list is JSON-stored)
            if (!string.IsNullOrWhiteSpace(filter.Amenities))
            {
                var requiredAmenities = filter.Amenities
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .ToList();

                if (requiredAmenities.Count > 0)
                {
                    rooms = rooms.Where(r => requiredAmenities.All(a => r.Amenities.Any(ra => ra.Equals(a, StringComparison.OrdinalIgnoreCase)))).ToList();
                }
            }

            // Sorting
            rooms = (filter.SortBy?.ToLower()) switch
            {
                "price-asc" => rooms.OrderBy(r => r.PricePerNight).ToList(),
                "price-desc" => rooms.OrderByDescending(r => r.PricePerNight).ToList(),
                "rating" => rooms.OrderByDescending(r => r.Rating).ToList(),
                "reviews" => rooms.OrderByDescending(r => r.ReviewsCount).ToList(),
                _ => rooms.OrderByDescending(r => r.Featured).ThenByDescending(r => r.Rating).ToList()
            };

            return Ok(rooms);
        }

        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<Room>>> GetFeaturedRooms()
        {
            var featured = await _context.Rooms
                .Where(r => r.Featured)
                .OrderByDescending(r => r.Rating)
                .ToListAsync();

            return Ok(featured);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(string id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = $"Room with ID '{id}' was not found." });
            }

            return Ok(room);
        }

        [HttpPost]
        public async Task<ActionResult<Room>> CreateRoom([FromBody] RoomCreateUpdateDto dto)
        {
            var room = new Room
            {
                Id = "room-" + Guid.NewGuid().ToString().Substring(0, 8),
                Name = dto.Name,
                Category = dto.Category,
                DestinationId = dto.DestinationId,
                DestinationName = dto.DestinationName,
                Stars = dto.Stars,
                Rating = dto.Rating,
                ReviewsCount = dto.ReviewsCount,
                PricePerNight = dto.PricePerNight,
                OriginalPrice = dto.OriginalPrice,
                DiscountBadge = dto.DiscountBadge,
                Featured = dto.Featured,
                Badge = dto.Badge,
                MaxGuests = dto.MaxGuests,
                Bedrooms = dto.Bedrooms,
                Bathrooms = dto.Bathrooms,
                SizeSqM = dto.SizeSqM,
                BedType = dto.BedType,
                View = dto.View,
                Images = dto.Images ?? new List<string>(),
                Description = dto.Description,
                Amenities = dto.Amenities ?? new List<string>(),
                Highlights = dto.Highlights ?? new List<string>(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(string id, [FromBody] RoomCreateUpdateDto dto)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = $"Room with ID '{id}' was not found." });
            }

            room.Name = dto.Name;
            room.Category = dto.Category;
            room.DestinationId = dto.DestinationId;
            room.DestinationName = dto.DestinationName;
            room.Stars = dto.Stars;
            room.Rating = dto.Rating;
            room.ReviewsCount = dto.ReviewsCount;
            room.PricePerNight = dto.PricePerNight;
            room.OriginalPrice = dto.OriginalPrice;
            room.DiscountBadge = dto.DiscountBadge;
            room.Featured = dto.Featured;
            room.Badge = dto.Badge;
            room.MaxGuests = dto.MaxGuests;
            room.Bedrooms = dto.Bedrooms;
            room.Bathrooms = dto.Bathrooms;
            room.SizeSqM = dto.SizeSqM;
            room.BedType = dto.BedType;
            room.View = dto.View;
            if (dto.Images != null) room.Images = dto.Images;
            room.Description = dto.Description;
            if (dto.Amenities != null) room.Amenities = dto.Amenities;
            if (dto.Highlights != null) room.Highlights = dto.Highlights;

            await _context.SaveChangesAsync();

            return Ok(room);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(string id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = $"Room with ID '{id}' was not found." });
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
