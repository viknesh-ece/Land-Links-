// Helper utility to generate unique, deterministic TamilNilam government records for each property parcel

export function getTNLandData(property) {
  if (!property) {
    return {
      district: "Coimbatore (கோயம்புத்தூர்)",
      taluk: "Coimbatore South (தெற்கு)",
      village: "Peelamedu (பீளமேடு)",
      surveyNo: "402",
      subDivisionNo: "2A",
      pattaNo: "78190",
      ecDocNo: "EC-2026-TN-98142",
      regDocNo: "Reg-Doc-4521/2025",
      ownerName: "Rajesh Kumar S/O Sundaram",
      guidelineValue: 1850,
      marketValue: 3200,
      soilType: "Red Loamy Soil",
      landType: "Punjai (Dry Agricultural / Commercial Zone)",
      dtcpApproval: "DTCP/L/004521/2025",
      reraApproval: "TN/21/Layout/0189/2025"
    };
  }

  // If property already has custom values from database
  if (property.district && property.pattaNo) {
    return {
      district: property.district,
      taluk: property.taluk || "Coimbatore South",
      village: property.village || "Peelamedu",
      surveyNo: property.surveyNo || "402",
      subDivisionNo: property.subDivisionNo || "2A",
      pattaNo: property.pattaNo,
      ecDocNo: property.ecDocNo || `EC-2026-TN-${Math.floor(10000 + Math.random() * 89999)}`,
      regDocNo: property.regDocNo || `Reg-Doc-${Math.floor(1000 + Math.random() * 8999)}/2025`,
      ownerName: property.ownerName || "Vetted Principal Owner",
      guidelineValue: property.guidelineValue || 1850,
      marketValue: property.marketValue || 3200,
      soilType: property.soilType || "Red Loamy Soil",
      landType: property.landType || "Punjai (Commercial Development)",
      dtcpApproval: property.dtcpApproval || "DTCP/L/004521/2025",
      reraApproval: property.reraApproval || "TN/21/Layout/0189/2025"
    };
  }

  // Generate deterministic unique records derived from property ID / Location / Title
  const idStr = String(property.id || "101");
  const numId = idStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const districts = [
    { name: "Coimbatore (கோயம்புத்தூர்)", taluk: "Coimbatore South (தெற்கு)", village: "Peelamedu (பீளமேடு)" },
    { name: "Chengalpattu (செங்கல்பட்டு)", taluk: "Tambaram (தாம்பரம்)", village: "Sholinganallur (சோழிங்கநல்லூர்)" },
    { name: "Madurai (மதுரை)", taluk: "Madurai East (கிழக்கு)", village: "Othakadai (ஒத்தக்கடை)" },
    { name: "Kanchipuram (காஞ்சிபுரம்)", taluk: "Sriperumbudur (ஸ்ரீபெரும்புதூர்)", village: "Irungattukottai (இருங்காட்டுக்கோட்டை)" },
    { name: "Tiruchirappalli (திருச்சிராப்பள்ளி)", taluk: "Tiruchirappalli West (மேற்கு)", village: "Thillai Nagar (தில்லை நகர்)" },
    { name: "Salem (சேலம்)", taluk: "Salem South (தெற்கு)", village: "Kondalampatti (கொண்டலாம்பட்டி)" },
    { name: "Erode (ஈரோடு)", taluk: "Perundurai (பெருந்துறை)", village: "SIPCOT Complex (சிப்காட்)" },
    { name: "Tiruppur (திருப்பூர்)", taluk: "Avinashi (அவிநாசி)", village: "Tiruppur North (வடக்கு)" }
  ];

  const owners = [
    "Rajesh Kumar S/O Sundaram",
    "Anitha Ramanathan W/O Ramanathan",
    "Muruganathan P S/O Palanisamy",
    "Kavitha Selvam W/O Selvaraj",
    "Dr. Senthil Nathan S/O Natarajan",
    "Venkatesh Iyer S/O Subramaniam",
    "Balamurugan K S/O Kandasamy",
    "Dhanalakshmi Ammal W/O Duraisamy"
  ];

  const distObj = districts[numId % districts.length];
  const owner = owners[numId % owners.length];

  const surveyNo = `${(numId % 400) + 101}`;
  const subDivisionNo = ["1A", "2B", "3C", "1B", "4A", "2C"][numId % 6];
  const pattaNo = `${(numId % 80000) + 12000}`;
  const ecDocNo = `EC-2026-TN-${(numId % 89999) + 10000}`;
  const regDocNo = `Reg-Doc-${(numId % 8999) + 1000}/2025`;
  const glv = 1200 + (numId % 1500);
  const mkt = glv + 1100 + (numId % 800);

  return {
    district: distObj.name,
    taluk: distObj.taluk,
    village: distObj.village,
    surveyNo,
    subDivisionNo,
    pattaNo,
    ecDocNo,
    regDocNo,
    ownerName: owner,
    guidelineValue: glv,
    marketValue: mkt,
    soilType: ["Red Loamy Soil", "Black Cotton Soil", "Alluvial Clay Loam", "Sandy Gravel Soil"][numId % 4],
    landType: ["Punjai (Dry Land Zone)", "Nanjai (Wet Agricultural)", "Commercial IT Zone", "Industrial Estate"][numId % 4],
    dtcpApproval: `DTCP/L/00${(numId % 8999) + 1000}/2025`,
    reraApproval: `TN/21/Layout/0${(numId % 899) + 100}/2025`
  };
}
