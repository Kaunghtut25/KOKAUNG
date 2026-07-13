import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'a9ticketing@a9globaltravel.com.mm';

// SMTP transporter — configure with your email provider
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  // Try Gmail SMTP (uses app password)
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER || 'dadkaunghtut@gmail.com';
  const smtpPass = process.env.SMTP_PASS || '';

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  return transporter;
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}

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
  const transporter = getTransporter();
  const adminEmail = getAdminEmail();
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
        ${data.fromAirport ? `<tr><td style="padding: 8px; font-weight: bold;">From</td><td style="padding: 8px;">${data.fromAirport}</td></tr>` : ''}
        ${data.toAirport ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">To</td><td style="padding: 8px;">${data.toAirport}</td></tr>` : ''}
        ${data.departDate ? `<tr><td style="padding: 8px; font-weight: bold;">Departure</td><td style="padding: 8px;">${data.departDate}</td></tr>` : ''}
        ${data.returnDate ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Return</td><td style="padding: 8px;">${data.returnDate}</td></tr>` : ''}
        ${data.passengers ? `<tr><td style="padding: 8px; font-weight: bold;">Passengers</td><td style="padding: 8px;">${data.passengers}</td></tr>` : ''}
        ${data.travelClass ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Class</td><td style="padding: 8px;">${data.travelClass}</td></tr>` : ''}
        ${data.itemName ? `<tr><td style="padding: 8px; font-weight: bold;">Item</td><td style="padding: 8px;">${data.itemName}</td></tr>` : ''}
        ${data.amount ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Amount</td><td style="padding: 8px; font-weight: bold; color: #D4AF37;">${data.amount} ${data.currency || 'MMK'}</td></tr>` : ''}
        ${data.specialRequests ? `<tr><td style="padding: 8px; font-weight: bold;">Special Requests</td><td style="padding: 8px;">${data.specialRequests}</td></tr>` : ''}
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Contact Preference</td><td style="padding: 8px;">${data.contactPreference || 'email'}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 15px; background: #0A1628; color: #D4AF37; border-radius: 6px; text-align: center; font-size: 14px;">
        📧 <strong>A9 Global Travel & Tours</strong> — Auto-generated booking notification
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"A9 Global Booking" <${adminEmail}>`,
      to: adminEmail,
      replyTo: data.email,
      subject,
      html,
    });
    console.log(`[Email] Sent booking ${data.referenceNumber} to ${adminEmail}`);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send:', err);
    return false;
  }
}
