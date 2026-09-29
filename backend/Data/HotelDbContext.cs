using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using hotel_booking_website.Models;

namespace hotel_booking_website.Data
{
    public class HotelDbContext : DbContext
    {
        public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Destination> Destinations => Set<Destination>();
        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<SpecialOffer> SpecialOffers => Set<SpecialOffer>();
        public DbSet<LuxuryAddon> LuxuryAddons => Set<LuxuryAddon>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure JSON serialization converter & comparer for List<string>
            var listConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<List<string>, string>(
                v => JsonSerializer.Serialize(v ?? new List<string>(), (JsonSerializerOptions?)null),
                v => string.IsNullOrWhiteSpace(v) 
                    ? new List<string>() 
                    : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
            );

            var listComparer = new ValueComparer<List<string>>(
                (c1, c2) => JsonSerializer.Serialize(c1, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(c2, (JsonSerializerOptions?)null),
                c => c == null ? 0 : JsonSerializer.Serialize(c, (JsonSerializerOptions?)null).GetHashCode(),
                c => c == null ? new List<string>() : new List<string>(c)
            );

            // User constraints
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // Room JSON columns
            modelBuilder.Entity<Room>(entity =>
            {
                entity.Property(r => r.Images)
                    .HasConversion(listConverter)
                    .Metadata.SetValueComparer(listComparer);

                entity.Property(r => r.Amenities)
                    .HasConversion(listConverter)
                    .Metadata.SetValueComparer(listComparer);

                entity.Property(r => r.Highlights)
                    .HasConversion(listConverter)
                    .Metadata.SetValueComparer(listComparer);
            });

            // Booking JSON column
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.Property(b => b.SelectedAddons)
                    .HasConversion(listConverter)
                    .Metadata.SetValueComparer(listComparer);
            });

            // Unique promo code
            modelBuilder.Entity<SpecialOffer>(entity =>
            {
                entity.HasIndex(o => o.Code).IsUnique();
            });
        }
    }
}
