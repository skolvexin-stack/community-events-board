import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/community_events_board";

const EventSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    city: String,
    dateTime: Date,
    price: Number,
    description: String,
    imageUrl: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

const Event = mongoose.models.Event ?? mongoose.model("Event", EventSchema);

const events = [
  {
    title: "Bangalore Blues Night",
    category: "Music",
    city: "Bengaluru",
    dateTime: new Date("2026-10-18T18:30:00"),
    price: 50000,
    description:
      "A soulful evening of blues and jazz at the iconic Church Street Social. Featuring local and visiting artists, this is the perfect night out for music lovers.",
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
    isActive: true,
  },
  {
    title: "React & Next.js Workshop",
    category: "Workshop",
    city: "Bengaluru",
    dateTime: new Date("2026-10-22T10:00:00"),
    price: 150000,
    description:
      "A hands-on full-day workshop covering the latest React patterns and Next.js App Router. Ideal for developers with 1-3 years of experience looking to level up.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    isActive: true,
  },
  {
    title: "Coimbatore Street Food Festival",
    category: "Food",
    city: "Coimbatore",
    dateTime: new Date("2026-10-25T11:00:00"),
    price: 20000,
    description:
      "Over 50 local vendors bringing the best of Coimbatore's street food scene together. From kothu parotta to kuzhi paniyaram — come hungry.",
    imageUrl:
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800",
    isActive: true,
  },
  {
    title: "Mumbai Football 5s Tournament",
    category: "Sports",
    city: "Mumbai",
    dateTime: new Date("2026-11-02T08:00:00"),
    price: 80000,
    description:
      "A weekend 5-a-side football tournament open to amateur teams across Mumbai. 32 teams, knockout format, cash prizes for the top 3.",
    imageUrl:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
    isActive: true,
  },
  {
    title: "Kids Science Carnival",
    category: "Kids",
    city: "Chennai",
    dateTime: new Date("2026-11-08T09:00:00"),
    price: 30000,
    description:
      "An interactive science fair for children between 5 and 12 years. Experiments, robotics demos, and a junior quiz competition — all under one roof.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    isActive: true,
  },
  {
    title: "Hyderabad Carnatic Music Evening",
    category: "Music",
    city: "Hyderabad",
    dateTime: new Date("2026-11-14T19:00:00"),
    price: 40000,
    description:
      "A classical Carnatic concert featuring senior disciple musicians. Held at the Ravindra Bharathi auditorium, this is a rare evening of pure classical music.",
    imageUrl:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800",
    isActive: true,
  },
  {
    title: "Product Design Sprint",
    category: "Workshop",
    city: "Mumbai",
    dateTime: new Date("2026-11-20T09:30:00"),
    price: 200000,
    description:
      "A two-day Google Design Sprint facilitated by industry practitioners. Participants leave with a tested prototype and a fresh problem-solving framework.",
    imageUrl:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
    isActive: true,
  },
  {
    title: "Chennai Organic Food Market",
    category: "Food",
    city: "Chennai",
    dateTime: new Date("2026-11-23T08:00:00"),
    price: 0,
    description:
      "A free-entry Sunday market showcasing certified organic produce, homemade condiments, and farm-to-table breakfast options from across Tamil Nadu.",
    imageUrl:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800",
    isActive: true,
  },
  {
    title: "Bengaluru Half Marathon",
    category: "Sports",
    city: "Bengaluru",
    dateTime: new Date("2026-12-07T05:30:00"),
    price: 120000,
    description:
      "One of the city's most popular road races — 21.1 km through the heart of Bengaluru. Open to runners of all levels. Finisher medals and breakfast included.",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    isActive: true,
  },
  {
    title: "Art & Craft Workshop for Kids",
    category: "Kids",
    city: "Hyderabad",
    dateTime: new Date("2026-12-13T10:00:00"),
    price: 25000,
    description:
      "A Saturday morning craft session where kids explore painting, clay modelling, and origami with professional art educators.",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    isActive: true,
  },
  {
    title: "Indie Music Night — Coimbatore",
    category: "Music",
    city: "Coimbatore",
    dateTime: new Date("2026-12-20T20:00:00"),
    price: 35000,
    description:
      "Four indie bands take the stage at The Canopy Rooftop Bar. Tickets include one welcome drink. Doors open at 7:30 PM.",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
    isActive: true,
  },
  {
    title: "Python for Data Science Bootcamp",
    category: "Workshop",
    city: "Chennai",
    dateTime: new Date("2026-11-29T09:00:00"),
    price: 250000,
    description:
      "A three-day intensive bootcamp covering Python, pandas, matplotlib, and machine learning basics with real-world datasets.",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    isActive: false,
  },
  {
    title: "Hyderabad Biryani Fest",
    category: "Food",
    city: "Hyderabad",
    dateTime: new Date("2026-10-05T12:00:00"),
    price: 15000,
    description:
      "A celebration of Hyderabad's most iconic dish — 30 biryani vendors, a cook-off competition, and live music. Entry includes a complimentary serving.",
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
    isActive: false,
  },
  {
    title: "Mumbai Kids Football Camp",
    category: "Kids",
    city: "Mumbai",
    dateTime: new Date("2026-10-04T07:00:00"),
    price: 60000,
    description:
      "A weekend football camp for children aged 6-14, coached by former Santosh Trophy players. Focus on skill development and teamwork.",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    isActive: true,
  },
  {
    title: "Bengaluru Jazz Festival",
    category: "Music",
    city: "Bengaluru",
    dateTime: new Date("2026-09-28T17:00:00"),
    price: 75000,
    description:
      "A two-day outdoor jazz festival featuring 12 national and international acts. Food stalls, art installations, and a dedicated kids zone.",
    imageUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800",
    isActive: true,
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  await Event.deleteMany({});
  await Event.insertMany(events);
  console.log(`Seeded ${events.length} events`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
