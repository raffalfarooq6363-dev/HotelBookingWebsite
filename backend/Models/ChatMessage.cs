using System;
using System.ComponentModel.DataAnnotations;

namespace hotel_booking_website.Models
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// The conversation/session ID (one per customer-manager pair or per user)
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string ConversationId { get; set; } = string.Empty;

        /// <summary>
        /// Sender user ID
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string SenderId { get; set; } = string.Empty;

        /// <summary>
        /// Sender display name
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string SenderName { get; set; } = string.Empty;

        /// <summary>
        /// Sender role: "User" or "Admin"/"Manager"
        /// </summary>
        [MaxLength(30)]
        public string SenderRole { get; set; } = "User";

        /// <summary>
        /// The message text content
        /// </summary>
        [Required]
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Whether the manager has read this message
        /// </summary>
        public bool IsReadByManager { get; set; } = false;

        /// <summary>
        /// Whether the customer has read this message
        /// </summary>
        public bool IsReadByCustomer { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
