// Dynamic Government Land Account & TamilNilam Rotation Engine

export const DYNAMIC_GOV_ACCOUNTS = [
  {
    id: "acc_pollachi_clean",
    accountType: "VERIFIED_ORIGINAL",
    personaName: "Palanisamy Gounder (Pollachi Farmer)",
    district: "Coimbatore (கோயம்புத்தூர்)",
    taluk: "Pollachi (பொள்ளாச்சி)",
    village: "Anaimalai (ஆனைமலை)",
    surveyNo: "214",
    subDivision: "1B",
    pattaNo: "55210",
    ownerName: "K. Palanisamy Gounder",
    ecDocNo: "EC-2026-POL-8821",
    regDocNo: "DOC-2024-POLLACHI-441",
    landArea: "7.5 Acres",
    zoning: "Agricultural",
    marketValueEstimate: "₹ 2.80 Crores",
    verificationResult: {
      status: "SUCCESS_VERIFIED",
      trustScore: 99,
      badge: "VERIFIED_CLEAR_TITLE",
      headline: "✅ 100% Genuine Title Verified on TamilNilam Portal",
      logs: [
        "Connecting to TamilNilam Revenue Gateway (eservices.tn.gov.in)...",
        "Polling Pollachi Taluk Revenue A-Register for Patta #55210...",
        "Survey #214/1B confirmed in Anaimalai Revenue Village.",
        "0 Encumbrance / 0 Court Injunctions recorded.",
        "Aadhaar eKYC Name perfectly matches registered deed owner.",
        "✅ 100% TITLE AUTHENTICATED BY TN REVENUE DEPT. LAND LISTING AUTHORIZED."
      ]
    }
  },
  {
    id: "acc_salem_disputed",
    accountType: "FAKE_DISPUTED_DEMO",
    personaName: "Dr. Senthil Nathan (Litigated Listing)",
    district: "Salem (சேலம்)",
    taluk: "Salem South (தெற்கு)",
    village: "Kondalampatti (கொண்டலாம்பட்டி)",
    surveyNo: "514",
    subDivision: "1A",
    pattaNo: "66710",
    ownerName: "Dr. Senthil Nathan S/O Natarajan",
    ecDocNo: "EC-2026-SLM-9912",
    regDocNo: "DOC-2023-SALEM-112",
    landArea: "12.0 Acres",
    zoning: "Industrial",
    marketValueEstimate: "₹ 4.20 Crores",
    verificationResult: {
      status: "FAILED_ENCUMBRANCE",
      trustScore: 24,
      badge: "FLAGGED_COURT_INJUNCTION",
      headline: "❌ Verification Failed: Civil Court Injunction Found on Land",
      logs: [
        "Connecting to TamilNilam Revenue Gateway (eservices.tn.gov.in)...",
        "Polling Salem South Taluk Registry for Patta #66710...",
        "⚠️ ENCUMBRANCE WARNING: OS/2024 Civil Suit & Bank Mortgage attached to Survey #514/1A.",
        "❌ TITLE REJECTED: Litigated or encumbered properties cannot be listed on LandLinkX.",
        "🔒 Zero-Trust Security Lock Engaged."
      ]
    }
  },
  {
    id: "acc_peelamedu_commercial",
    accountType: "VERIFIED_ORIGINAL",
    personaName: "Rajesh Kumar (Commercial Developer)",
    district: "Coimbatore (கோயம்புத்தூர்)",
    taluk: "Coimbatore South (தெற்கு)",
    village: "Peelamedu (பீளமேடு)",
    surveyNo: "402",
    subDivision: "2A",
    pattaNo: "78190",
    ownerName: "Rajesh Kumar S/O Sundaram",
    ecDocNo: "EC-2026-CBE-7711",
    regDocNo: "DOC-2025-CBE-980",
    landArea: "10.5 Acres",
    zoning: "Commercial",
    marketValueEstimate: "₹ 4.50 Crores",
    verificationResult: {
      status: "SUCCESS_VERIFIED",
      trustScore: 98,
      badge: "VERIFIED_CLEAR_TITLE",
      headline: "✅ 100% Genuine Commercial Title Verified",
      logs: [
        "Connecting to TamilNilam Revenue Gateway (eservices.tn.gov.in)...",
        "Polling Coimbatore South A-Register for Patta #78190...",
        "Survey #402/2A confirmed in Peelamedu Village.",
        "0 Encumbrance / Clean A-Katha title.",
        "Digital State Stamp Authenticated: SHA256-TN-STAMP-VALID.",
        "✅ 100% TITLE AUTHENTICATED BY TN REVENUE DEPT. LAND LISTING AUTHORIZED."
      ]
    }
  },
  {
    id: "acc_madurai_mismatch",
    accountType: "FAKE_DISPUTED_DEMO",
    personaName: "Muruganathan P (Stolen Deed / Name Mismatch)",
    district: "Madurai (மதுரை)",
    taluk: "Madurai East (கிழக்கு)",
    village: "Othakadai (ஒத்தக்கடை)",
    surveyNo: "88",
    subDivision: "4A",
    pattaNo: "33410",
    ownerName: "Muruganathan P S/O Palanisamy",
    ecDocNo: "EC-2025-MDU-4431",
    regDocNo: "DOC-2022-MDU-771",
    landArea: "8.0 Acres",
    zoning: "Agricultural",
    marketValueEstimate: "₹ 1.80 Crores",
    verificationResult: {
      status: "FAILED_MISMATCH",
      trustScore: 42,
      badge: "REJECTED_IDENTITY_MISMATCH",
      headline: "❌ Zero-Trust Mismatch: Submitter Identity Does Not Match Deed Owner",
      logs: [
        "Connecting to TamilNilam Revenue Gateway (eservices.tn.gov.in)...",
        "Extracting Owner Name via Deed OCR: 'Muruganathan P'...",
        "Comparing with submitter logged-in profile identity...",
        "❌ IDENTITY MISMATCH: Levenshtein match score 42% (< 85% required threshold).",
        "❌ TITLE REJECTED: Stolen deed protection triggered. User profile flagged for audit."
      ]
    }
  },
  {
    id: "acc_sholinganallur_it",
    accountType: "VERIFIED_ORIGINAL",
    personaName: "Anitha Ramanathan (IT Zone Landowner)",
    district: "Chengalpattu (செங்கல்பட்டு)",
    taluk: "Tambaram (தாம்பரம்)",
    village: "Sholinganallur (சோழிங்கநல்லூர்)",
    surveyNo: "118",
    subDivision: "1B",
    pattaNo: "45210",
    ownerName: "Anitha Ramanathan W/O Ramanathan",
    ecDocNo: "EC-2026-CHG-1029",
    regDocNo: "DOC-2025-TAMB-302",
    landArea: "5.2 Acres",
    zoning: "Commercial",
    marketValueEstimate: "₹ 6.50 Crores",
    verificationResult: {
      status: "SUCCESS_VERIFIED",
      trustScore: 100,
      badge: "VERIFIED_CLEAR_TITLE",
      headline: "✅ 100% High-Density Commercial Title Verified",
      logs: [
        "Connecting to TamilNilam Revenue Gateway (eservices.tn.gov.in)...",
        "Polling Tambaram Taluk Chitta Ledger for Patta #45210...",
        "Survey #118/1B confirmed with DTCP/RERA approval approval.",
        "0 Encumbrance found in 30-year Sub-Registrar search.",
        "✅ 100% TITLE AUTHENTICATED BY TN REVENUE DEPT. LAND LISTING AUTHORIZED."
      ]
    }
  }
];

// Returns account index based on current time (rotates every 5 seconds)
export function getRotatingAccountByTime(userOverride = null) {
  if (userOverride) {
    // Deterministic lookup based on user name/id
    const charCodeSum = String(userOverride.id || userOverride.username || userOverride.name || "user")
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DYNAMIC_GOV_ACCOUNTS[charCodeSum % DYNAMIC_GOV_ACCOUNTS.length];
  }

  // 5-second interval cycle
  const currentSlot = Math.floor(Date.now() / 5000);
  const accountIndex = currentSlot % DYNAMIC_GOV_ACCOUNTS.length;
  return DYNAMIC_GOV_ACCOUNTS[accountIndex];
}
