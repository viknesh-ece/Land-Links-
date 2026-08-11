import { prisma } from '../src/lib/prisma.js';

const demoProperties = [
  {
    title: '10.5 Acres Prime Commercial Land on Devanahalli Highway',
    description: 'Ideal for IT park, logistics hub, or commercial development. Direct highway frontage with clean A-Katha deed and verified TamilNilam Patta.',
    price: 45000000,
    location: 'Peelamedu, Coimbatore',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    soilReport: 'Soil_Mechanics_Coimbatore_BH1.pdf',
    landDeed: 'Original_Sale_Deed_Peelamedu.pdf',
    pattaDocument: 'Patta_Chitta_78190_Coimbatore.pdf',
    pattaNumber: '78190',
    surveyNumber: '402/2A',
    extractedOwnerName: 'Rajesh Kumar S/O Sundaram',
    nameMatchScore: 100,
    qrValid: true,
    geoTagVerified: true,
    verificationStatus: 'VERIFIED'
  },
  {
    title: '5.2 Acres IT Corridor Commercial Plot',
    description: 'High-density commercial zone opposite SIPCOT Tech Park. High FSI rating (2.5) with DTCP and RERA approved layout.',
    price: 65000000,
    location: 'Sholinganallur, Chengalpattu',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
    soilReport: 'Geotech_Report_Sholinganallur.pdf',
    landDeed: 'Sale_Deed_Sholinganallur_2025.pdf',
    pattaDocument: 'Patta_Chitta_45210_Tambaram.pdf',
    pattaNumber: '45210',
    surveyNumber: '118/1B',
    extractedOwnerName: 'Anitha Ramanathan W/O Ramanathan',
    nameMatchScore: 98,
    qrValid: true,
    geoTagVerified: true,
    verificationStatus: 'VERIFIED'
  },
  {
    title: '4.5 Acres Flagged Plot - Owner Name Mismatch',
    description: 'Flagged by AI Zero-Trust engine! Deed owner name does not match submitter profile identity.',
    price: 28000000,
    location: 'Thillai Nagar, Tiruchirappalli',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
    soilReport: 'Trichy_Soil_Report.pdf',
    landDeed: 'Trichy_Deed_Draft.pdf',
    pattaDocument: 'Patta_12090_Trichy.pdf',
    pattaNumber: '12090',
    surveyNumber: '312/2B',
    extractedOwnerName: 'Suresh Kumar (Mismatch)',
    nameMatchScore: 42,
    qrValid: false,
    geoTagVerified: false,
    verificationStatus: 'OWNER_MISMATCH_SUSPECTED'
  },
  {
    title: '12 Acres Industrial Land - Flagged Photoshop Forgery',
    description: 'Rejected Upload! PDF metadata indicates creation via graphic editing software (Photoshop/Canva).',
    price: 42000000,
    location: 'Kondalampatti, Salem',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    soilReport: 'Salem_Soil_Draft.pdf',
    landDeed: 'Fake_Photoshop_Deed.pdf',
    pattaDocument: 'Patta_Fake_Edit_Canva.pdf',
    pattaNumber: '66710',
    surveyNumber: '514/1A',
    extractedOwnerName: 'Unknown Forged Owner',
    nameMatchScore: 20,
    qrValid: false,
    geoTagVerified: false,
    verificationStatus: 'REJECTED'
  }
];

async function seedProperties() {
  console.log('Seeding properties into MongoDB...');
  for (const prop of demoProperties) {
    try {
      await prisma.property.create({ data: prop });
      console.log('Seeded:', prop.title);
    } catch (err) {
      console.error(err);
    }
  }
}
seedProperties();
