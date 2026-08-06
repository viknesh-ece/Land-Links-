import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count === 0) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    await prisma.user.create({
      data: { name: "Rajesh Kumar", email: "owner@landlinks.com", password: hashedPassword, role: "Landowner", verified: true }
    });
    await prisma.user.create({
      data: { name: "Priya Sharma", email: "investor@landlinks.com", password: hashedPassword, role: "Investor", verified: true }
    });
    await prisma.user.create({
      data: { name: "Sterling Developers", email: "builder@landlinks.com", password: hashedPassword, role: "Builder", verified: true }
    });

    await prisma.property.create({
      data: {
        title: "10 Acres Prime Commercial Land on Devanahalli Highway",
        description: "Ideal for IT park, logistics hub, or commercial development. Direct highway frontage with clean A-Katha deed.",
        price: 45000000,
        location: "Devanahalli, Bangalore North",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
        soilReport: "Passed - Clay Loam Load Bearing 250 kN/m²",
        landDeed: "Clear Title (Katha A)",
        pattaDocument: "Verified Patta #84920",
        gisCoordinates: "13.245, 77.712"
      }
    });

    await prisma.property.create({
      data: {
        title: "25 Acres Industrial & Logistics Hub near Sriperumbudur",
        description: "Zoned Industrial parcel with 4-lane highway access, high power grid availability, and groundwater clearance.",
        price: 120000000,
        location: "Sriperumbudur, Chennai West",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80",
        soilReport: "High Load Bearing Capacity",
        landDeed: "Registered Title Deed",
        pattaDocument: "Patta Registered #9102",
        gisCoordinates: "12.971, 79.942"
      }
    });

    console.log("Seeded MongoDB database successfully!");
  } else {
    console.log("Database already contains records.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
