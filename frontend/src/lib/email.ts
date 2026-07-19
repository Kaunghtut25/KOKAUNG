import { Resend } from "resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "dadkaunghtut@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "bookings@a9travel.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

function getResend(): Resend | null {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not set — email disabled");
    return null;
  }
  return new Resend(RESEND_API_KEY);
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}

/**
 * Send admin notification email when a new booking is submitted
 */
export async function sendBookingEmail(data: {
  fullName: string;
  email: string;
  phone: string;
  travelType: string;
  fromAirport?: string;
  toAirport?: string;
  departDate?: string;
  returnDate?: string;
  passengers?: number;
  travelClass?: string;
  specialRequests?: string;
  contactPreference?: string;
  referenceNumber: string;
  itemName?: string;
  amount?: number;
  currency?: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const subject = `[A9 Booking] ${data.travelType.toUpperCase()} — ${data.referenceNumber} from ${data.fullName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #D4AF37; border-radius: 8px;">
      <h2 style="color: #0A1628; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
        🛎️ New Booking Inquiry — ${data.referenceNumber}
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Travel Type</td><td style="padding: 8px; color: #D4AF37; font-weight: bold;">${data.travelType.toUpperCase()}</td></tr>
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Client Name</td><td style="padding: 8px;">${data.fullName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
        ${data.fromAirport ? `<tr><td style="padding: 8px; font-weight: bold;">From</td><td style="padding: 8px;">${data.fromAirport}</td></tr>` : ""}
        ${data.toAirport ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">To</td><td style="padding: 8px;">${data.toAirport}</td></tr>` : ""}
        ${data.departDate ? `<tr><td style="padding: 8px; font-weight: bold;">Departure</td><td style="padding: 8px;">${data.departDate}</td></tr>` : ""}
        ${data.returnDate ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Return</td><td style="padding: 8px;">${data.returnDate}</td></tr>` : ""}
        ${data.passengers ? `<tr><td style="padding: 8px; font-weight: bold;">Passengers</td><td style="padding: 8px;">${data.passengers}</td></tr>` : ""}
        ${data.travelClass ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Class</td><td style="padding: 8px;">${data.travelClass}</td></tr>` : ""}
        ${data.itemName ? `<tr><td style="padding: 8px; font-weight: bold;">Item</td><td style="padding: 8px;">${data.itemName}</td></tr>` : ""}
        ${data.amount ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Amount</td><td style="padding: 8px; font-weight: bold; color: #D4AF37;">${data.amount} ${data.currency || "MMK"}</td></tr>` : ""}
        ${data.specialRequests ? `<tr><td style="padding: 8px; font-weight: bold;">Special Requests</td><td style="padding: 8px;">${data.specialRequests}</td></tr>` : ""}
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Contact Preference</td><td style="padding: 8px;">${data.contactPreference || "email"}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 15px; background: #0A1628; color: #D4AF37; border-radius: 6px; text-align: center; font-size: 14px;">
        📧 <strong>A9 Global Travel & Tours</strong> — Auto-generated booking notification
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: `A9 Global Travel <${FROM_EMAIL}>`,
      to: [ADMIN_EMAIL],
      reply_to: data.email,
      subject,
      html,
    });
    console.log(`[Email] Admin notification sent ${data.referenceNumber} — Resend ID: ${result.data?.id}`);
    return true;
  } catch (err) {
    console.error("[Email] Resend failed:", (err as any)?.message || err);
    return false;
  }
}

/**
 * Send customer confirmation email with booking reference
 */
export async function sendCustomerConfirmationEmail(data: {
  fullName: string;
  email: string;
  travelType: string;
  referenceNumber: string;
  fromAirport?: string;
  toAirport?: string;
  departDate?: string;
  returnDate?: string;
  passengers?: number;
  travelClass?: string;
  specialRequests?: string;
  itemName?: string;
  amount?: number;
  currency?: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  const bookingTypeLabel = data.travelType.charAt(0).toUpperCase() + data.travelType.slice(1);
  const subject = `Booking Confirmed — ${data.referenceNumber} | A9 Global Travel`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0A1628; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #D4AF37; font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 28px;">A9 Global Travels</h1>
        <p style="color: #fff; opacity: 0.8; margin: 5px 0 0; font-size: 14px;">Booking Confirmation</p>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #eee; border-top: none;">
        <h2 style="color: #0A1628; font-family: 'Playfair Display', Georgia, serif;">Dear ${data.fullName},</h2>
        <p style="color: #333; line-height: 1.6;">Thank you for choosing <strong>A9 Global Travels</strong>! Your booking request has been received and is being processed. Our team will contact you within <strong>24 hours</strong> to confirm the details and finalize your reservation.</p>
        
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <p style="margin: 0 0 12px; font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Your Reference Number</p>
          <p style="margin: 0 0 16px; font-size: 22px; font-weight: bold; color: #D4AF37; font-family: monospace; letter-spacing: 1px;">${data.referenceNumber}</p>
          <div style="border-top: 1px solid #eee; padding-top: 12px;">
            <p style="margin: 0 0 6px; font-size: 14px;"><strong style="color: #0A1628;">Booking Type:</strong> <span style="color: #555;">${bookingTypeLabel}</span></p>
            ${data.itemName ? `<p style="margin: 0 0 6px; font-size: 14px;"><strong style="color: #0A1628;">Item:</strong> <span style="color: #555;">${data.itemName}</span></p>` : ""}
            ${data.fromAirport ? `<p style="margin: 0 0 6px; font-size: 14px;"><strong style="color: #0A1628;">From:</strong> <span style="color: #555;">${data.fromAirport}</span></p>` : ""}
            ${data.toAirport ? `<p style="margin: 0 0 6px; font-size: 14px;"><strong style="color: #0A1628;">To:</strong> <span style="color: #555;">${data.toAirport}</span></p>` : ""}
            ${data.departDate ? `<p style="margin: 0 0 6px; font-size: 14px;"><strong style="color: #0A1628;">Date:</strong> <span style="color: #555;">${data.departDate}</span></p>` : ""}
            ${data.passengers ? `<p style="margin: 0 0 6px; font-size: 14px;"><strong style="color: #0A1628;">Passengers:</strong> <span style="color: #555;">${data.passengers}</span></p>` : ""}
            ${data.travelClass ? `<p style="margin: 0 0 6px; font-size: 14px;"><strong style="color: #0A1628;">Class:</strong> <span style="color: #555;">${data.travelClass}</span></p>` : ""}
            ${data.amount ? `<p style="margin: 0 0 6px; font-size: 14px;"><strong style="color: #0A1628;">Amount:</strong> <span style="color: #D4AF37; font-weight: bold;">${data.amount} ${data.currency || "MMK"}</span></p>` : ""}
          </div>
        </div>
        
        ${data.specialRequests ? `
        <div style="background: #FFF8E1; padding: 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #FFE082;">
          <p style="margin: 0; font-size: 13px; color: #F57F17;"><strong>📝 Your Special Requests:</strong> ${data.specialRequests}</p>
        </div>` : ""}

        <p style="color: #333; margin-top: 20px;">If you have any questions or need to modify your booking, please don't hesitate to contact us:</p>
        <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #eee;">
          <p style="margin: 0 0 6px; font-size: 14px;">📞 <strong>Phone:</strong> <a href="tel:+959694320111" style="color: #0A1628;">959 694 320 111</a></p>
          <p style="margin: 0 0 6px; font-size: 14px;">✉️ <strong>Email:</strong> <a href="mailto:dadkaunghtut@gmail.com" style="color: #0A1628;">dadkaunghtut@gmail.com</a></p>
          <p style="margin: 0; font-size: 14px;">🌐 <strong>Website:</strong> <a href="https://a9travel.com" style="color: #D4AF37;">a9travel.com</a></p>
        </div>
        
        <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
          This is an automated confirmation from A9 Global Travels. Please do not reply directly to this email.<br/>
          Our team will contact you shortly at the phone number or email you provided.
        </p>
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: `A9 Global Travel <${FROM_EMAIL}>`,
      to: [data.email],
      subject,
      html,
    });
    console.log(`[Email] Customer confirmation sent to ${data.email} — Ref: ${data.referenceNumber} — Resend ID: ${result.data?.id}`);
    return true;
  } catch (err) {
    console.error("[Email] Customer confirmation failed:", (err as any)?.message || err);
    return false;
  }
}
