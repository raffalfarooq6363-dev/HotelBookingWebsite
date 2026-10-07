using System;
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
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly HotelDbContext _context;

        public ChatController(HotelDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all unique conversations — for manager view (one conversation per customer)
        /// NOTE: This route must be declared BEFORE /{conversationId} to avoid ambiguity.
        /// </summary>
        [HttpGet("conversations/all")]
        public async Task<ActionResult> GetAllConversations()
        {
            var conversations = await _context.ChatMessages
                .GroupBy(m => m.ConversationId)
                .Select(g => new
                {
                    ConversationId = g.Key,
                    LastMessage = g.OrderByDescending(m => m.CreatedAt).Select(m => m.Message).FirstOrDefault(),
                    LastMessageAt = g.Max(m => m.CreatedAt),
                    UnreadCount = g.Count(m => !m.IsReadByManager && m.SenderRole == "User"),
                    CustomerName = g.Where(m => m.SenderRole == "User")
                                    .Select(m => m.SenderName)
                                    .FirstOrDefault() ?? "Guest",
                    CustomerId = g.Where(m => m.SenderRole == "User")
                                  .Select(m => m.SenderId)
                                  .FirstOrDefault() ?? ""
                })
                .OrderByDescending(c => c.LastMessageAt)
                .ToListAsync();

            return Ok(conversations);
        }

        /// <summary>
        /// Get all messages for a specific conversation by conversationId
        /// </summary>
        [HttpGet("messages/{conversationId}")]
        public async Task<ActionResult> GetMessages(string conversationId)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.ConversationId == conversationId)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.ConversationId,
                    m.SenderId,
                    m.SenderName,
                    m.SenderRole,
                    m.Message,
                    m.CreatedAt,
                    m.IsReadByManager,
                    m.IsReadByCustomer
                })
                .ToListAsync();

            return Ok(messages);
        }

        /// <summary>
        /// Send a chat message via REST (fallback when SignalR is unavailable)
        /// </summary>
        [HttpPost("send")]
        public async Task<ActionResult> SendMessage([FromBody] ChatSendMessageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest(new { message = "Message cannot be empty." });

            var chatMsg = new ChatMessage
            {
                ConversationId = dto.ConversationId,
                SenderId = dto.SenderId,
                SenderName = dto.SenderName,
                SenderRole = dto.SenderRole,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow,
                IsReadByManager = dto.SenderRole == "Admin" || dto.SenderRole == "Manager",
                IsReadByCustomer = dto.SenderRole == "User"
            };

            _context.ChatMessages.Add(chatMsg);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                chatMsg.Id,
                chatMsg.ConversationId,
                chatMsg.SenderId,
                chatMsg.SenderName,
                chatMsg.SenderRole,
                chatMsg.Message,
                chatMsg.CreatedAt
            });
        }

        /// <summary>
        /// Mark all messages in a conversation as read by a specific role (Manager or User)
        /// </summary>
        [HttpPut("messages/{conversationId}/read")]
        public async Task<IActionResult> MarkRead(string conversationId, [FromQuery] string role)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.ConversationId == conversationId)
                .ToListAsync();

            bool isManager = role == "Admin" || role == "Manager";
            foreach (var msg in messages)
            {
                if (isManager) msg.IsReadByManager = true;
                else msg.IsReadByCustomer = true;
            }
            await _context.SaveChangesAsync();
            return Ok(new { message = "Marked as read." });
        }
    }

    /// <summary>DTO for sending a chat message via REST</summary>
    public class ChatSendMessageDto
    {
        public string ConversationId { get; set; } = string.Empty;
        public string SenderId { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string SenderRole { get; set; } = "User";
        public string Message { get; set; } = string.Empty;
    }
}
