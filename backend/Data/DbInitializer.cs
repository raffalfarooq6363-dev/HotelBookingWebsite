using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using hotel_booking_website.Models;
using hotel_booking_website.Services;

namespace hotel_booking_website.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<HotelDbContext>();
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<HotelDbContext>>();

            try
            {
                logger.LogInformation("Ensuring SQL Server database and schema are created...");
                await context.Database.EnsureCreatedAsync();

                // 1. Seed Destinations
                if (!await context.Destinations.AnyAsync())
                {
                    logger.LogInformation("Seeding Destinations...");
                    var destinations = new List<Destination>
                    {
                        new() { Id = "bali", Name = "Bali, Indonesia", Country = "Indonesia", Image = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80" },
                        new() { Id = "maldives", Name = "Malé Atoll, Maldives", Country = "Maldives", Image = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80" },
                        new() { Id = "paris", Name = "Paris, France", Country = "France", Image = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
                        new() { Id = "swiss-alps", Name = "Zermatt, Switzerland", Country = "Switzerland", Image = "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80" },
                        new() { Id = "tokyo", Name = "Tokyo, Japan", Country = "Japan", Image = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" },
                        new() { Id = "santorini", Name = "Santorini, Greece", Country = "Greece", Image = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80" },
                        new() { Id = "new-york", Name = "Manhattan, New York", Country = "USA", Image = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" }
                    };
                    await context.Destinations.AddRangeAsync(destinations);
                    await context.SaveChangesAsync();
                }

                // 2. Seed Luxury Rooms
                if (!await context.Rooms.AnyAsync())
                {
                    logger.LogInformation("Seeding Luxury Rooms and Suites...");
                    var rooms = new List<Room>
                    {
                        new()
                        {
                            Id = "room-1",
                            Name = "Presidential Oceanfront Villa",
                            Category = "Villas",
                            DestinationId = "maldives",
                            DestinationName = "Malé Atoll, Maldives",
                            Stars = 5,
                            Rating = 4.98m,
                            ReviewsCount = 142,
                            PricePerNight = 890m,
                            OriginalPrice = 1100m,
                            DiscountBadge = "Save 20%",
                            Featured = true,
                            Badge = "Luxury Pick",
                            MaxGuests = 4,
                            Bedrooms = 2,
                            Bathrooms = 2,
                            SizeSqM = 185,
                            BedType = "2 King Beds",
                            View = "Unobstructed Panoramic Ocean View",
                            Images = new List<string>
                            {
                                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
                            },
                            Description = "Perched over crystalline turquoise waters with direct lagoon access, this villa features an expansive private infinity pool, sunset sun-deck, personal butler service, and an outdoor rain shower.",
                            Amenities = new List<string>
                            {
                                "Private Infinity Pool",
                                "Free High-speed Wi-Fi",
                                "Ocean View",
                                "Complimentary Gourmet Breakfast",
                                "24/7 Butler Service",
                                "Spa Tub / Jacuzzi",
                                "Airport Speedboat Transfer",
                                "Mini Bar & Wine Cellar",
                                "Air Conditioning",
                                "Espresso Machine"
                            },
                            Highlights = new List<string>
                            {
                                "Direct Lagoon Staircase",
                                "Floating Breakfast Included",
                                "Private Sunset Deck"
                            }
                        },
                        new()
                        {
                            Id = "room-2",
                            Name = "Grand Royal Eiffel Suite",
                            Category = "Luxury Suite",
                            DestinationId = "paris",
                            DestinationName = "Paris, France",
                            Stars = 5,
                            Rating = 4.95m,
                            ReviewsCount = 118,
                            PricePerNight = 720m,
                            OriginalPrice = 850m,
                            DiscountBadge = "Save 15%",
                            Featured = true,
                            Badge = "Most Romantic",
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            SizeSqM = 95,
                            BedType = "1 Emperor King Bed",
                            View = "Direct Eiffel Tower View",
                            Images = new List<string>
                            {
                                "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
                            },
                            Description = "Overlooking the iconic Champ de Mars, this classical Parisian suite boasts high ceilings, Versailles-style parquet floors, velvet furnishings, and a private stone balcony with front-row views of the Eiffel Tower sparkle.",
                            Amenities = new List<string>
                            {
                                "Balcony with Monument View",
                                "Free High-speed Wi-Fi",
                                "Complimentary Gourmet Breakfast",
                                "Marble Bath & Soaking Tub",
                                "Champagne Welcome Bottle",
                                "Valet Parking",
                                "Hermès Bath Amenities",
                                "Air Conditioning"
                            },
                            Highlights = new List<string>
                            {
                                "Direct Eiffel Tower View",
                                "Evening Turn-down Service",
                                "Chilled Vintage Champagne"
                            }
                        },
                        new()
                        {
                            Id = "room-3",
                            Name = "Santorini Cliffside Cave Sanctuary",
                            Category = "Villas",
                            DestinationId = "santorini",
                            DestinationName = "Santorini, Greece",
                            Stars = 5,
                            Rating = 4.97m,
                            ReviewsCount = 96,
                            PricePerNight = 640m,
                            OriginalPrice = 750m,
                            DiscountBadge = "Popular",
                            Featured = true,
                            Badge = "Breathtaking View",
                            MaxGuests = 3,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            SizeSqM = 80,
                            BedType = "1 King Bed + 1 Daybed",
                            View = "Caldera Sunset & Aegean Sea",
                            Images = new List<string>
                            {
                                "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                            },
                            Description = "Chiseled into the dramatic caldera cliff of Oia, this whitewashed sanctuary provides an outdoor heated jacuzzi overlooking the volcano and world-famous Aegean sunsets.",
                            Amenities = new List<string>
                            {
                                "Heated Cliffside Jacuzzi",
                                "Free High-speed Wi-Fi",
                                "Ocean View",
                                "Complimentary Gourmet Breakfast",
                                "Greek Wine Tasting Platter",
                                "Air Conditioning",
                                "Espresso Machine"
                            },
                            Highlights = new List<string>
                            {
                                "Heated Caldera Jacuzzi",
                                "Oia Sunset Front-row",
                                "Traditional Architecture"
                            }
                        },
                        new()
                        {
                            Id = "room-4",
                            Name = "Alpine Matterhorn Panorama Chalet",
                            Category = "Mountain Chalet",
                            DestinationId = "swiss-alps",
                            DestinationName = "Zermatt, Switzerland",
                            Stars = 5,
                            Rating = 4.96m,
                            ReviewsCount = 88,
                            PricePerNight = 820m,
                            OriginalPrice = 980m,
                            DiscountBadge = "Save 16%",
                            Featured = false,
                            Badge = "Ski-in / Ski-out",
                            MaxGuests = 6,
                            Bedrooms = 3,
                            Bathrooms = 3,
                            SizeSqM = 210,
                            BedType = "3 King Beds",
                            View = "Direct Matterhorn Peak View",
                            Images = new List<string>
                            {
                                "https://images.unsplash.com/photo-1517840905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80"
                            },
                            Description = "A genuine luxury timber chalet situated at the base of the Matterhorn. Includes a private wood-burning fireplace, Finnish cedar sauna, outdoor heated hot tub, and ski-in / ski-out access.",
                            Amenities = new List<string>
                            {
                                "Private Cedar Sauna",
                                "Outdoor Hot Tub",
                                "Ski Storage & Boot Warmers",
                                "Wood-Burning Fireplace",
                                "Free High-speed Wi-Fi",
                                "Mountain View",
                                "Complimentary Gourmet Breakfast",
                                "Airport Helicopter Shuttle Available"
                            },
                            Highlights = new List<string>
                            {
                                "Matterhorn Facing Terrace",
                                "Private In-Chalet Sauna",
                                "Log Fireplace"
                            }
                        },
                        new()
                        {
                            Id = "room-5",
                            Name = "Ubud Rainforest Zen Retreat",
                            Category = "Villas",
                            DestinationId = "bali",
                            DestinationName = "Bali, Indonesia",
                            Stars = 5,
                            Rating = 4.93m,
                            ReviewsCount = 164,
                            PricePerNight = 430m,
                            OriginalPrice = 520m,
                            DiscountBadge = "Best Value",
                            Featured = true,
                            Badge = "Wellness Retreat",
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            SizeSqM = 120,
                            BedType = "1 Four-Poster King Bed",
                            View = "Lush Ayung River Jungle Valley",
                            Images = new List<string>
                            {
                                "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"
                            },
                            Description = "Immerse in tranquility among the mist and lush jungle canopy of Ubud. Highlights include a private plunge pool cantilevered over the ravine, open-concept marble bath, and daily private yoga sessions.",
                            Amenities = new List<string>
                            {
                                "Private Plunge Pool",
                                "Daily Sunrise Yoga Classes",
                                "Free High-speed Wi-Fi",
                                "Complimentary Gourmet Breakfast",
                                "Holistic Spa Access",
                                "Ayurvedic Afternoon Tea",
                                "Free Shuttle to Ubud Center"
                            },
                            Highlights = new List<string>
                            {
                                "Jungle Plunge Pool",
                                "Flower Bath Experience",
                                "Daily Sound Healing"
                            }
                        },
                        new()
                        {
                            Id = "room-6",
                            Name = "Tokyo Sky Tower Executive Suite",
                            Category = "Luxury Suite",
                            DestinationId = "tokyo",
                            DestinationName = "Tokyo, Japan",
                            Stars = 5,
                            Rating = 4.94m,
                            ReviewsCount = 103,
                            PricePerNight = 580m,
                            OriginalPrice = 650m,
                            DiscountBadge = "Exclusive",
                            Featured = false,
                            Badge = "Skyline Panorama",
                            MaxGuests = 3,
                            Bedrooms = 1,
                            Bathrooms = 2,
                            SizeSqM = 110,
                            BedType = "1 King Bed + Tatami Lounge",
                            View = "Tokyo Tower & Mt. Fuji Skyline",
                            Images = new List<string>
                            {
                                "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80"
                            },
                            Description = "Located on the 48th floor in Roppongi, featuring floor-to-ceiling glass wrapping around the sparkling metropolis. Blends minimalist Japanese craftsmanship with high-tech acoustic isolation.",
                            Amenities = new List<string>
                            {
                                "Floor-to-Ceiling Skyline Views",
                                "Hinoki Cypress Deep Soak Tub",
                                "Free High-speed Wi-Fi",
                                "Club Lounge Access & Cocktails",
                                "Complimentary Gourmet Breakfast",
                                "Smart Room Automation",
                                "Nespresso & Premium Matcha Bar"
                            },
                            Highlights = new List<string>
                            {
                                "48th Floor Horizon View",
                                "Japanese Onsen Style Bath",
                                "Executive Club Privileges"
                            }
                        },
                        new()
                        {
                            Id = "room-7",
                            Name = "Manhattan Central Park Penthouse",
                            Category = "Penthouse",
                            DestinationId = "new-york",
                            DestinationName = "Manhattan, New York",
                            Stars = 5,
                            Rating = 4.91m,
                            ReviewsCount = 79,
                            PricePerNight = 950m,
                            OriginalPrice = 1200m,
                            DiscountBadge = "Save 21%",
                            Featured = true,
                            Badge = "Celebrity Choice",
                            MaxGuests = 5,
                            Bedrooms = 2,
                            Bathrooms = 3,
                            SizeSqM = 230,
                            BedType = "2 King Beds",
                            View = "Central Park & 5th Avenue",
                            Images = new List<string>
                            {
                                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
                            },
                            Description = "An architectural marvel above Central Park. Features a wraparound private terrace, grand piano, curated modern art, private elevator access, and a master bathroom clad in Calacatta marble.",
                            Amenities = new List<string>
                            {
                                "Wraparound Park Terrace",
                                "Private Direct Elevator",
                                "Free High-speed Wi-Fi",
                                "Complimentary Gourmet Breakfast",
                                "Chauffeur Mercedes S-Class Service",
                                "Wine Cellar & Wet Bar",
                                "Pet Friendly"
                            },
                            Highlights = new List<string>
                            {
                                "Central Park Birds-Eye View",
                                "Private Concierge Team",
                                "Calacatta Marble Bath"
                            }
                        },
                        new()
                        {
                            Id = "room-8",
                            Name = "Seminyak Azure Beachfront Suite",
                            Category = "Luxury Suite",
                            DestinationId = "bali",
                            DestinationName = "Bali, Indonesia",
                            Stars = 4,
                            Rating = 4.88m,
                            ReviewsCount = 135,
                            PricePerNight = 320m,
                            OriginalPrice = 390m,
                            DiscountBadge = "Special Offer",
                            Featured = false,
                            Badge = "Beachfront",
                            MaxGuests = 2,
                            Bedrooms = 1,
                            Bathrooms = 1,
                            SizeSqM = 75,
                            BedType = "1 King Bed",
                            View = "Seminyak Beach & Surf",
                            Images = new List<string>
                            {
                                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
                                "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80"
                            },
                            Description = "Step directly from your sun terrace onto warm golden sands. Close to Seminyak’s premier culinary scene, this chic suite offers tropical modern decor and unobstructed Indian Ocean sunsets.",
                            Amenities = new List<string>
                            {
                                "Direct Beach Access",
                                "Free High-speed Wi-Fi",
                                "Complimentary Gourmet Breakfast",
                                "Infinity Pool Access",
                                "Sunset Cocktail Bar Voucher",
                                "Air Conditioning"
                            },
                            Highlights = new List<string>
                            {
                                "Direct Sand Access",
                                "Cocktails at Sunset",
                                "Rain Shower"
                            }
                        }
                    };
                    await context.Rooms.AddRangeAsync(rooms);
                    await context.SaveChangesAsync();
                }

                // 3. Seed Luxury Addons
                if (!await context.LuxuryAddons.AnyAsync())
                {
                    logger.LogInformation("Seeding Luxury Addons...");
                    var addons = new List<LuxuryAddon>
                    {
                        new()
                        {
                            Id = "addon-vip-transfer",
                            Name = "VIP Private Chauffeur / Speedboat Transfer",
                            Description = "Round-trip private luxury vehicle or executive speedboat transfer with champagne greet.",
                            Price = 95m
                        },
                        new()
                        {
                            Id = "addon-spa-treatment",
                            Name = "Couples Holistic Spa & Aromatherapy (90 Min)",
                            Description = "Deep relaxation massage, organic botanical facials, and private steam suite access.",
                            Price = 180m
                        },
                        new()
                        {
                            Id = "addon-romantic-dinner",
                            Name = "5-Course Candlelit Beachfront / Terrace Dinner",
                            Description = "Curated tasting menu prepared by our Executive Chef with sommelier wine pairing.",
                            Price = 150m
                        },
                        new()
                        {
                            Id = "addon-early-late",
                            Name = "Guaranteed Early Check-in & Late 4 PM Check-out",
                            Description = "Arrive early at 10 AM and stay relaxed up to 4 PM on your day of departure.",
                            Price = 50m
                        }
                    };
                    await context.LuxuryAddons.AddRangeAsync(addons);
                    await context.SaveChangesAsync();
                }

                // 4. Seed Special Offers
                if (!await context.SpecialOffers.AnyAsync())
                {
                    logger.LogInformation("Seeding Special Offers...");
                    var offers = new List<SpecialOffer>
                    {
                        new()
                        {
                            Id = "offer-1",
                            Code = "HONEYMOON25",
                            Title = "The Romantic Haven Escape",
                            Discount = "25% OFF + Champagne",
                            DiscountPercentage = 25,
                            Description = "Complimentary vintage champagne upon arrival, candlelit beach dinner, and daily breakfast in bed.",
                            ValidUntil = "Valid through 2026",
                            Accent = "from-amber-600 to-rose-600"
                        },
                        new()
                        {
                            Id = "offer-2",
                            Code = "EXTENDSTAY",
                            Title = "Stay 5 Nights, Pay For 4",
                            Discount = "1 Complimentary Night",
                            DiscountPercentage = 20,
                            Description = "Extend your relaxation. Enjoy a free night on stays of 5 nights or more, plus $150 resort spa credit.",
                            ValidUntil = "All Year Round",
                            Accent = "from-blue-600 to-indigo-700"
                        },
                        new()
                        {
                            Id = "offer-3",
                            Code = "EARLYBIRD",
                            Title = "Early Bird Prestige Privilege",
                            Discount = "20% OFF Advance Booking",
                            DiscountPercentage = 20,
                            Description = "Book at least 30 days ahead and unlock complimentary round-trip VIP airport transfer & room upgrade.",
                            ValidUntil = "Limited Availability",
                            Accent = "from-emerald-600 to-teal-700"
                        },
                        new()
                        {
                            Id = "offer-4",
                            Code = "LUXE10",
                            Title = "Member Welcome Privilege",
                            Discount = "10% OFF First Reservation",
                            DiscountPercentage = 10,
                            Description = "Special welcome privilege for registered LuxeClub members on their first booking.",
                            ValidUntil = "Ongoing",
                            Accent = "from-amber-500 to-yellow-600"
                        }
                    };
                    await context.SpecialOffers.AddRangeAsync(offers);
                    await context.SaveChangesAsync();
                }

                // 5. Seed Guest Reviews
                if (!await context.Reviews.AnyAsync())
                {
                    logger.LogInformation("Seeding Guest Reviews...");
                    var reviews = new List<Review>
                    {
                        new()
                        {
                            Name = "Sophia Montgomery",
                            Title = "Verified Luxury Guest",
                            Location = "London, UK",
                            Avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                            HotelStayed = "Presidential Oceanfront Villa, Maldives",
                            RoomId = "room-1",
                            Rating = 5,
                            Date = "February 2026",
                            Comment = "The most extraordinary resort experience of our lives. From the personal butler greeting us on the speedboat to the unforgettable sunset over our private infinity pool, LuxeHaven delivered sheer perfection."
                        },
                        new()
                        {
                            Name = "Alexander & Elena Vance",
                            Title = "Honeymooners",
                            Location = "Geneva, Switzerland",
                            Avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                            HotelStayed = "Grand Royal Eiffel Suite, Paris",
                            RoomId = "room-2",
                            Rating = 5,
                            Date = "January 2026",
                            Comment = "Having breakfast on the private balcony while watching the Eiffel Tower shimmer was pure magic. The concierge team secured reservations at three Michelin-starred spots with zero hassle."
                        },
                        new()
                        {
                            Name = "Hiroshi Tanaka",
                            Title = "Architectural Designer",
                            Location = "Tokyo, Japan",
                            Avatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
                            HotelStayed = "Santorini Cliffside Cave Sanctuary",
                            RoomId = "room-3",
                            Rating = 5,
                            Date = "March 2026",
                            Comment = "The attention to craftsmanship, acoustic silence inside the cave structure, and the unobstructed Caldera sunset jacuzzi make this an architectural triumph. Will return every year."
                        }
                    };
                    await context.Reviews.AddRangeAsync(reviews);
                    await context.SaveChangesAsync();
                }

                // 6. Seed Users
                if (!await context.Users.AnyAsync())
                {
                    logger.LogInformation("Seeding Default Users...");
                    var (demoHash, demoSalt) = passwordHasher.HashPassword("Password123!");
                    var demoUser = new User
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = "Victoria Sterling",
                        Email = "victoria.sterling@luxehaven.com",
                        PasswordHash = demoHash,
                        PasswordSalt = demoSalt,
                        MembershipTier = "Diamond Ambassador",
                        Role = "User"
                    };

                    var (adminHash, adminSalt) = passwordHasher.HashPassword("Admin123!");
                    var adminUser = new User
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = "LuxeHaven Concierge Admin",
                        Email = "admin@luxehaven.com",
                        PasswordHash = adminHash,
                        PasswordSalt = adminSalt,
                        MembershipTier = "Imperial Founder",
                        Role = "Admin"
                    };

                    await context.Users.AddRangeAsync(demoUser, adminUser);
                    await context.SaveChangesAsync();
                }

                // 7. Seed Initial Sample Booking
                if (!await context.Bookings.AnyAsync())
                {
                    logger.LogInformation("Seeding Initial Booking...");
                    var sampleBooking = new Booking
                    {
                        Id = "LXH-829140",
                        RoomId = "room-1",
                        RoomName = "Presidential Oceanfront Villa",
                        DestinationName = "Malé Atoll, Maldives",
                        RoomImage = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
                        PricePerNight = 890m,
                        CheckIn = DateTime.UtcNow.AddDays(7).ToString("yyyy-MM-dd"),
                        CheckOut = DateTime.UtcNow.AddDays(11).ToString("yyyy-MM-dd"),
                        Nights = 4,
                        Guests = "2 Adults",
                        SelectedAddons = new List<string>
                        {
                            "VIP Private Chauffeur / Speedboat Transfer",
                            "Couples Holistic Spa & Aromatherapy (90 Min)"
                        },
                        FirstName = "Alexander",
                        LastName = "Vance",
                        Email = "alexander.vance@luxury.com",
                        Phone = "+1 555-0199",
                        PaymentMethod = "card",
                        TotalAmountUSD = 3980m,
                        Currency = "USD",
                        CurrencySymbol = "$",
                        ConvertedTotal = 3980m,
                        Status = "Confirmed",
                        CreatedAt = DateTime.UtcNow
                    };
                    await context.Bookings.AddAsync(sampleBooking);
                    await context.SaveChangesAsync();
                }

                logger.LogInformation("Database seeding completed successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while initializing and seeding the database.");
                throw;
            }
        }
    }
}
