import { NextResponse } from "next/server";
import { processDocumentAntiFraudPipeline } from "@/lib/antiFraudEngine";

export async function POST(req) {
  try {
    const body = await req.json();
    const { propertyId, docType, pattaNo, surveyNo, district, userProfile } = body;

    const result = await processDocumentAntiFraudPipeline({
      propertyId,
      file: { name: "Patta_Deed_Verification.pdf" },
      docType: docType || "Land Patta Deed",
      pattaNo: pattaNo || "78190",
      surveyNo: surveyNo || "402/1A",
      district: district || "Kanchipuram",
      userProfile: userProfile || { name: "Rajesh Kumar", kycVerified: true, kycType: "AADHAAR" }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Anti-fraud verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
