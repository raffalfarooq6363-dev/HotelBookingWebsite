using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using hotel_booking_website.Data;
using hotel_booking_website.Models;

namespace hotel_booking_website.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContentController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public ContentController(HotelDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllContent()
        {
            var contents = await _context.SiteContents.ToListAsync();
            var result = contents.ToDictionary(c => c.Key, c => c.ContentJson);
            return Ok(result);
        }

        [HttpGet("{key}")]
        public async Task<ActionResult> GetContentByKey(string key)
        {
            var item = await _context.SiteContents.FindAsync(key);
            if (item == null)
            {
                return NotFound(new { message = $"Content for key '{key}' not found." });
            }
            return Ok(item);
        }
    }
}
