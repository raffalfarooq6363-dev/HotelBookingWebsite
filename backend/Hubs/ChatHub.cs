using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using hotel_booking_website.Data;
using hotel_booking_website.Models;

namespace hotel_booking_website.Hubs
{
    public class ChatHub : Hub
    {
        private readonly HotelDbContext _context;

        public ChatHub(HotelDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Join a specific conversation room
        /// </summary>
        public async Task JoinConversation(string conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        }

        /// <summary>
        /// Leave a conversation room
        /// </summary>
        public async Task LeaveConversation(string conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId);
        }

        /// <summary>
        /// Send a message to a conversation group (both manager and customer see it)
        /// </summary>
        public async Task SendMessage(string conversationId, string senderId, string senderName, string senderRole, string message)
        {
            if (string.IsNullOrWhiteSpace(message)) return;

            var chatMsg = new ChatMessage
            {
                ConversationId = conversationId,
                SenderId = senderId,
                SenderName = senderName,
                SenderRole = senderRole,
                Message = message,
                CreatedAt = DateTime.UtcNow,
                IsReadByManager = senderRole == "Admin" || senderRole == "Manager",
                IsReadByCustomer = senderRole == "User"
            };

            _context.ChatMessages.Add(chatMsg);
            await _context.SaveChangesAsync();

            // Broadcast to everyone in the conversation group
            await Clients.Group(conversationId).SendAsync("ReceiveMessage", new
            {
                chatMsg.Id,
                chatMsg.ConversationId,
                chatMsg.SenderId,
                chatMsg.SenderName,
                chatMsg.SenderRole,
                chatMsg.Message,
                chatMsg.CreatedAt,
                chatMsg.IsReadByManager,
                chatMsg.IsReadByCustomer
            });
        }

        /// <summary>
        /// Mark messages in a conversation as read by a specific role
        /// </summary>
        public async Task MarkAsRead(string conversationId, string role)
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
        }
    }
}
