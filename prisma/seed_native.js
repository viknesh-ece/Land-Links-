import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const sampleProperties = [
  {
    title: "10 Acres Prime Commercial Land on Devanahalli Highway",
    description: "Ideal for IT park, logistics hub, or commercial development. Direct highway frontage with clean A-Katha deed.",
    price: 45000000,
    location: "Devanahalli, Bangalore North",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    soilReport: "Passed - Clay Loam Load Bearing 250 kN/m²",
    landDeed: "Clear Title (Katha A)",
    pattaDocument: "Verified Patta #84920",
    gisCoordinates: "13.245, 77.712",
    createdAt: new Date()
  },
  {
    title: "25 Acres Industrial & Logistics Hub near Sriperumbudur",
    description: "Zoned Industrial parcel with 4-lane highway access, high power grid availability, and groundwater clearance.",
    price: 120000000,
    location: "Sriperumbudur, Chennai West",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80",
    soilReport: "High Load Bearing Capacity",
    landDeed: "Registered Title Deed",
    pattaDocument: "Patta Registered #9102",
    gisCoordinates: "12.971, 79.942",
    createdAt: new Date()
  },
  {
    title: "5 Acres Fertile Agricultural Land with Active Borewell",
    description: "Rich organic soil, active drip irrigation setup, perimeter fencing, and immediate road access.",
    price: 18000000,
    location: "Hosur Outer Ring Road, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80",
    soilReport: "Rich Alluvial Soil - Borewell Active",
    landDeed: "Ancestral Single Owner Deed",
    pattaDocument: "Chitta & Adangal Clean",
    gisCoordinates: "12.740, 77.825",
    createdAt: new Date()
  },
  {
    title: "12 Acres IT Corridor Commercial Development Plot",
    description: "Prime IT expansion corridor, high FSI rating, close to Metro station and upcoming tech parks.",
    price: 85000000,
    location: "Whitefield Extension, Bangalore East",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
    soilReport: "Rocky Base - Excellent High Rise Foundation",
    landDeed: "BBMP Approved A-Katha",
    pattaDocument: "Mutation Certificate Active",
    gisCoordinates: "12.969, 77.750",
    createdAt: new Date()
  },
  {
    title: "8 Acres Highway Frontage Commercial Zone in Coimbatore",
    description: "Corner plot facing NH-544. Perfect for logistics terminal, manufacturing unit, or warehouse park. Clear DTCP approval.",
    price: 32000000,
    location: "Avinashi Road, Coimbatore",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    soilReport: "Red Soil - Excellent Drainage & High Bearing Strength",
    landDeed: "DTCP Approved Layout Title",
    pattaDocument: "Patta Registered #78190",
    gisCoordinates: "11.016, 76.955",
    createdAt: new Date()
  },
  {
    title: "15 Acres Eco Agricultural Land near Mysore Highway",
    description: "Scenic agricultural parcel with natural stream access, coconut plantation, and active 3-phase power connection.",
    price: 21000000,
    location: "Mandya, Mysore Highway Corridor",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80",
    soilReport: "Black Fertile Loam Soil - 3 Active Wells",
    landDeed: "Clear Ancestral Single Owner Title",
    pattaDocument: "Pahani & RTC Clean Records",
    gisCoordinates: "12.522, 76.897",
    createdAt: new Date()
  }
];

async function run() {
  try {
    await client.connect();
    const db = client.db("landlinkx");
    const coll = db.collection("Property");
    await coll.deleteMany({});
    const res = await coll.insertMany(sampleProperties);
    console.log("SUCCESS! Inserted documents count:", res.insertedCount);
  } finally {
    await client.close();
  }
}
run().catch(console.error);
