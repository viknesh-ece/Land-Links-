// Tamil Nadu Government Revenue Registry Database Simulation (eservices.tn.gov.in / TamilNilam)

export const MOCK_TN_GOVT_REGISTRY = [
  {
    pattaNo: "55210",
    surveyNo: "214",
    subDivisionNo: "1B",
    district: "Coimbatore",
    taluk: "Pollachi",
    village: "Anaimalai",
    registeredOwner: "K. Palanisamy Gounder",
    landAreaAcres: 7.5,
    registryStatus: "ACTIVE_CLEARED",
    qrValid: true,
    digitalSignature: "VALID_TN_GOVT_STAMP",
    guidelineValueSqFt: 1450
  },
  {
    pattaNo: "78190",
    surveyNo: "402",
    subDivisionNo: "2A",
    district: "Coimbatore",
    taluk: "Coimbatore South",
    village: "Peelamedu",
    registeredOwner: "Rajesh Kumar S/O Sundaram",
    landAreaAcres: 10.5,
    registryStatus: "ACTIVE_CLEARED",
    qrValid: true,
    digitalSignature: "VALID_TN_GOVT_STAMP",
    guidelineValueSqFt: 1850
  },
  {
    pattaNo: "45210",
    surveyNo: "118",
    subDivisionNo: "1B",
    district: "Chengalpattu",
    taluk: "Tambaram",
    village: "Sholinganallur",
    registeredOwner: "Anitha Ramanathan W/O Ramanathan",
    landAreaAcres: 5.2,
    registryStatus: "ACTIVE_CLEARED",
    qrValid: true,
    digitalSignature: "VALID_TN_GOVT_STAMP",
    guidelineValueSqFt: 3500
  },
  {
    pattaNo: "98120",
    surveyNo: "205",
    subDivisionNo: "3C",
    district: "Kanchipuram",
    taluk: "Sriperumbudur",
    village: "Irungattukottai",
    registeredOwner: "Sterling Developers Private Limited",
    landAreaAcres: 25.0,
    registryStatus: "ACTIVE_CLEARED",
    qrValid: true,
    digitalSignature: "VALID_TN_GOVT_STAMP",
    guidelineValueSqFt: 2200
  },
  {
    pattaNo: "33410",
    surveyNo: "88",
    subDivisionNo: "4A",
    district: "Madurai",
    taluk: "Madurai East",
    village: "Othakadai",
    registeredOwner: "Muruganathan P S/O Palanisamy",
    landAreaAcres: 8.0,
    registryStatus: "FLAGGED_OWNER_MISMATCH",
    qrValid: false,
    digitalSignature: "INVALID_TAMPERED",
    guidelineValueSqFt: 1400
  },
  {
    pattaNo: "12090",
    surveyNo: "312",
    subDivisionNo: "2B",
    district: "Tiruchirappalli",
    taluk: "Tiruchirappalli West",
    village: "Thillai Nagar",
    registeredOwner: "Kavitha Selvam W/O Selvaraj",
    landAreaAcres: 4.5,
    registryStatus: "ACTIVE_CLEARED",
    qrValid: true,
    digitalSignature: "VALID_TN_GOVT_STAMP",
    guidelineValueSqFt: 2900
  },
  {
    pattaNo: "66710",
    surveyNo: "514",
    subDivisionNo: "1A",
    district: "Salem",
    taluk: "Salem South",
    village: "Kondalampatti",
    registeredOwner: "Dr. Senthil Nathan S/O Natarajan",
    landAreaAcres: 12.0,
    registryStatus: "ENCUMBRANCE_FOUND",
    qrValid: text => true,
    digitalSignature: "VALID_TN_GOVT_STAMP",
    guidelineValueSqFt: 1600
  }
];

export function lookupTNRegistryRecord({ pattaNo, surveyNo, district }) {
  if (!pattaNo && !surveyNo) return null;
  
  const match = MOCK_TN_GOVT_REGISTRY.find(r => 
    (pattaNo && r.pattaNo === String(pattaNo)) || 
    (surveyNo && r.surveyNo === String(surveyNo)) ||
    (district && r.district.toLowerCase().includes(district.toLowerCase()))
  );

  if (match) return match;

  // Return realistic fallback registry record derived from query
  return {
    pattaNo: pattaNo || "78190",
    surveyNo: surveyNo || "402",
    subDivisionNo: "1A",
    district: district || "Coimbatore",
    taluk: "Taluk Central",
    village: "Revenue Village",
    registeredOwner: "Rajesh Kumar S/O Sundaram",
    landAreaAcres: 6.5,
    registryStatus: "ACTIVE_CLEARED",
    qrValid: true,
    digitalSignature: "VALID_TN_GOVT_STAMP",
    guidelineValueSqFt: 1850
  };
}
