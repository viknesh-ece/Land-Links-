import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing

public_dir = r"C:\Users\Gokul K\.gemini\antigravity\scratch\Land-Links\public\demo_documents"
dl_dir = r"C:\Users\Gokul K\Downloads\LandLinkX_Sample_Documents"

os.makedirs(public_dir, exist_ok=True)
os.makedirs(dl_dir, exist_ok=True)

styles = getSampleStyleSheet()
title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=15, alignment=1, textColor=colors.HexColor('#0f172a'), spaceAfter=4)
subtitle_style = ParagraphStyle('Sub', parent=styles['Normal'], fontSize=10, alignment=1, textColor=colors.HexColor('#334155'), spaceAfter=12)
label_style = ParagraphStyle('Label', parent=styles['Normal'], fontSize=9, fontName='Helvetica-Bold', textColor=colors.HexColor('#1e293b'))
val_style = ParagraphStyle('Val', parent=styles['Normal'], fontSize=9, fontName='Helvetica', textColor=colors.HexColor('#0f172a'))

def create_original_pollachi_pdf(out_path):
    doc = SimpleDocTemplate(out_path, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    elements = []
    
    elements.append(Paragraph("GOVERNMENT OF TAMIL NADU", title_style))
    elements.append(Paragraph("Department of Revenue &amp; Disaster Management - e-Services", subtitle_style))
    elements.append(Paragraph("<b>Form 10(1) - TamilNilam Land Record Extract (Patta / Chitta Copy)</b>", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=14))
    
    info_data = [
        [Paragraph("District:", label_style), Paragraph("Coimbatore (12)", val_style), Paragraph("Taluk:", label_style), Paragraph("Pollachi (04)", val_style)],
        [Paragraph("Revenue Village:", label_style), Paragraph("Anaimalai (018)", val_style), Paragraph("Patta Number:", label_style), Paragraph("<b>55210</b>", val_style)],
        [Paragraph("Registered Owner:", label_style), Paragraph("<b>K. Palanisamy Gounder</b>", val_style), Paragraph("Survey No / Sub-Div:", label_style), Paragraph("<b>214 / 1B</b>", val_style)],
        [Paragraph("Land Classification:", label_style), Paragraph("Dry Agricultural (Punsei)", val_style), Paragraph("Total Extent:", label_style), Paragraph("<b>7.50 Acres (3.035 Hectares)</b>", val_style)],
        [Paragraph("Annual Land Tax (Teervai):", label_style), Paragraph("INR 18.50", val_style), Paragraph("STAR 2.0 Reg Ref:", label_style), Paragraph("DOC-2024-POLLACHI-441", val_style)]
    ]
    
    t = Table(info_data, colWidths=[120, 140, 120, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 16))
    
    elements.append(Paragraph("<b>GOVERNMENT REVENUE VERIFICATION LEDGER</b>", label_style))
    ledger_data = [
        ["Survey No", "Sub-Div", "Dry Land (Ha-Ares)", "Wet Land", "Encumbrance / Court Remarks", "Tahsildar E-Sign"],
        ["214", "1B", "3 - 03.50", "--", "NIL (0 Encumbrance / Clear Title)", "Digitally Signed: S. MUTHUVEL P (Tahsildar)"]
    ]
    lt = Table(ledger_data, colWidths=[65, 55, 100, 70, 130, 100])
    lt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0284c7')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#0284c7')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(lt)
    elements.append(Spacer(1, 20))
    
    qr_code = qr.QrCodeWidget("https://eservices.tn.gov.in/verify?ref=12/04/018/055210/99812")
    d = Drawing(60, 60)
    d.add(qr_code)
    
    foot_data = [
        [d, Paragraph("<b>OFFICIAL VALIDATION CODE: 12/04/018/055210/99812</b><br/>1. This is a computer generated certified extract issued under Tamil Nadu Revenue Act.<br/>2. Authenticate online at https://eservices.tn.gov.in<br/>3. Cryptographic Signature: SHA256-TN-REVENUE-CLEARED-AUTHENTIC", val_style)]
    ]
    ft = Table(foot_data, colWidths=[70, 450])
    ft.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(ft)
    doc.build(elements)

def create_fake_photoshop_pdf(out_path):
    doc = SimpleDocTemplate(out_path, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    red_title = ParagraphStyle('RTitle', parent=styles['Heading1'], fontSize=14, alignment=1, textColor=colors.HexColor('#dc2626'), spaceAfter=4)
    red_sub = ParagraphStyle('RSub', parent=styles['Normal'], fontSize=10, alignment=1, textColor=colors.HexColor('#7f1d1d'), spaceAfter=12)
    
    elements = []
    elements.append(Paragraph("[SIMULATED FORGERY TEST CASE] TAMIL NADU REVENUE EXTRACT", red_title))
    elements.append(Paragraph("<b>FORGERY TYPE: ADOBE PHOTOSHOP ALTERED TITLE DEED</b>", red_sub))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#dc2626'), spaceAfter=14))
    
    info_data = [
        [Paragraph("District:", label_style), Paragraph("Coimbatore", val_style), Paragraph("Taluk:", label_style), Paragraph("Coimbatore South", val_style)],
        [Paragraph("Revenue Village:", label_style), Paragraph("Peelamedu", val_style), Paragraph("Patta Number:", label_style), Paragraph("<b>99999 (Altered Text)</b>", val_style)],
        [Paragraph("Claimed Owner:", label_style), Paragraph("<b>Fake Seller</b>", val_style), Paragraph("Survey No:", label_style), Paragraph("<b>402 / 99 (Fake)</b>", val_style)],
        [Paragraph("Metadata Tag:", label_style), Paragraph("<font color='red'><b>Adobe Photoshop 2024</b></font>", val_style), Paragraph("Tamper State:", label_style), Paragraph("<font color='red'><b>LAYER_FORGED</b></font>", val_style)]
    ]
    t = Table(info_data, colWidths=[120, 140, 120, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef2f2')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#f87171')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fecaca')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 16))
    
    elements.append(Paragraph("<b>ANTI-FRAUD AI ENGINE DETECTION SUMMARY:</b>", label_style))
    diag_data = [
        ["Detection Layer", "Inspected Value", "AI Fraud Engine Verdict"],
        ["Layer 1: EXIF Forensics", "Producer: Adobe Photoshop 2024", "TAMPERING DETECTED (Graphic Editor Signatures)"],
        ["Layer 2: Perceptual Hash", "pHash: ff88aa1100bbcc44", "DUPLICATE MODIFIED PDF TEMPLATE"],
        ["Layer 3: TamilNilam Match", "Patta #99999 / Survey #402/99", "RECORD NOT FOUND IN A-REGISTER"],
        ["Layer 5: Digital Stamp", "QR Signature: CORRUPTED_FAKE", "INVALID CRYPTOGRAPHIC SIGNATURE"]
    ]
    dt = Table(diag_data, colWidths=[130, 190, 200])
    dt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#991b1b')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#991b1b')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fca5a5')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(dt)
    doc.build(elements)

def create_fake_salem_disputed_pdf(out_path):
    doc = SimpleDocTemplate(out_path, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    amber_title = ParagraphStyle('ATitle', parent=styles['Heading1'], fontSize=14, alignment=1, textColor=colors.HexColor('#b45309'), spaceAfter=4)
    amber_sub = ParagraphStyle('ASub', parent=styles['Normal'], fontSize=10, alignment=1, textColor=colors.HexColor('#78350f'), spaceAfter=12)
    
    elements = []
    elements.append(Paragraph("[DISPUTED PROPERTY TEST CASE] SALEM LAND RECORD", amber_title))
    elements.append(Paragraph("<b>CASE: ENCUMBERED / ACTIVE CIVIL COURT SUIT (OS/2024)</b>", amber_sub))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#f59e0b'), spaceAfter=14))
    
    info_data = [
        [Paragraph("District:", label_style), Paragraph("Salem (14)", val_style), Paragraph("Taluk:", label_style), Paragraph("Salem South (03)", val_style)],
        [Paragraph("Revenue Village:", label_style), Paragraph("Kondalampatti", val_style), Paragraph("Patta Number:", label_style), Paragraph("<b>66710</b>", val_style)],
        [Paragraph("Registered Owner:", label_style), Paragraph("<b>Dr. Senthil Nathan S/O Natarajan</b>", val_style), Paragraph("Survey No / Sub-Div:", label_style), Paragraph("<b>514 / 1A</b>", val_style)],
        [Paragraph("EC Status (STAR 2.0):", label_style), Paragraph("<font color='red'><b>ENCUMBERED: Mortgage + Court Suit</b></font>", val_style), Paragraph("Court Injunction:", label_style), Paragraph("<font color='red'><b>OS/2024 Salem Sub-Court</b></font>", val_style)]
    ]
    t = Table(info_data, colWidths=[120, 140, 120, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fffbeb')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#fcd34d')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#fef3c7')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 16))
    
    elements.append(Paragraph("<b>WARNING: This parcel is locked under active civil litigation. The Zero-Trust Anti-Fraud Engine will automatically intercept and block this parcel from being listed or verified on the marketplace.</b>", label_style))
    doc.build(elements)

def create_fake_madurai_mismatch_pdf(out_path):
    doc = SimpleDocTemplate(out_path, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    purp_title = ParagraphStyle('PTitle', parent=styles['Heading1'], fontSize=14, alignment=1, textColor=colors.HexColor('#9333ea'), spaceAfter=4)
    purp_sub = ParagraphStyle('PSub', parent=styles['Normal'], fontSize=10, alignment=1, textColor=colors.HexColor('#581c87'), spaceAfter=12)
    
    elements = []
    elements.append(Paragraph("[IDENTITY MISMATCH TEST CASE] MADURAI STOLEN DEED", purp_title))
    elements.append(Paragraph("<b>CASE: BENAMI / STOLEN DEED (OWNER NAME VS E-KYC MISMATCH)</b>", purp_sub))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#9333ea'), spaceAfter=14))
    
    info_data = [
        [Paragraph("District:", label_style), Paragraph("Madurai (19)", val_style), Paragraph("Taluk:", label_style), Paragraph("Madurai East (01)", val_style)],
        [Paragraph("Revenue Village:", label_style), Paragraph("Othakadai", val_style), Paragraph("Patta Number:", label_style), Paragraph("<b>33410</b>", val_style)],
        [Paragraph("Owner on Deed (OCR):", label_style), Paragraph("<b>Muruganathan P S/O Palanisamy</b>", val_style), Paragraph("Survey No / Sub-Div:", label_style), Paragraph("<b>88 / 4A</b>", val_style)],
        [Paragraph("Submitter eKYC Profile:", label_style), Paragraph("<font color='red'><b>Suresh Kumar M (Aadhaar KYC)</b></font>", val_style), Paragraph("Fuzzy Match Ratio:", label_style), Paragraph("<font color='red'><b>38% (&lt; 85% threshold)</b></font>", val_style)]
    ]
    t = Table(info_data, colWidths=[120, 140, 120, 140])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#faf5ff')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#d8b4fe')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#f3e8ff')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 16))
    
    elements.append(Paragraph("<b>ZERO-TRUST IDENTITY MISMATCH: The uploader does not own this property. The system intercepts the upload and engages a security hold to protect the legitimate landowner.</b>", label_style))
    doc.build(elements)

files = [
    ("1_ORIGINAL_TamilNilam_Patta_Pollachi_55210.pdf", create_original_pollachi_pdf),
    ("2_FAKE_Photoshop_Forged_Patta.pdf", create_fake_photoshop_pdf),
    ("3_FAKE_Salem_Court_Injunction_Disputed_Deed.pdf", create_fake_salem_disputed_pdf),
    ("4_FAKE_Madurai_Stolen_Identity_Deed.pdf", create_fake_madurai_mismatch_pdf)
]

for filename, generator in files:
    pub_path = os.path.join(public_dir, filename)
    dl_path = os.path.join(dl_dir, filename)
    generator(pub_path)
    generator(dl_path)
    print(f"Generated: {filename}")

print("All sample documents successfully generated!")
