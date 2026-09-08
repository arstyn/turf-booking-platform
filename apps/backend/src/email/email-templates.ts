/**
 * Lock Kiya Jaye - Email Templates
 * Premium, modern, responsive HTML email templates with bulletproof client compatibility.
 */

export interface BaseEmailOptions {
  title: string;
  previewText: string;
  logoUrl?: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'accent' | 'success' | 'warning';
  };
  content: string;
  frontendUrl?: string;
}

export interface OtpEmailOptions {
  otp: string;
  recipientEmail: string;
  expiresInMinutes?: number;
  frontendUrl?: string;
  logoUrl?: string;
}

export interface ContactNotificationOptions {
  name: string;
  email: string;
  subject: string;
  message: string;
  frontendUrl?: string;
  submittedAt?: Date;
  logoUrl?: string;
}

export interface AdminResponseOptions {
  customerName: string;
  customerEmail: string;
  subject: string;
  adminResponse: string;
  respondedBy: string;
  frontendUrl?: string;
  respondedAt?: Date | string;
  logoUrl?: string;
}

export interface BookingConfirmationOptions {
  bookingId: string;
  customerName: string;
  turfName: string;
  turfLocation?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours?: number;
  totalPrice: number;
  frontendUrl?: string;
  logoUrl?: string;
}

// Brand Colors
const COLORS = {
  primary: '#014d33', // Deep forest turf green
  primaryDark: '#013a26', // Darker turf
  primaryLight: '#f0f9f6', // Soft mint tint
  primaryBorder: '#ccebe1', // Subtle green border
  accent: '#ec494a', // Energetic sport red/coral
  accentLight: '#fef2f2', // Light red tint
  dark: '#111827', // Near black
  textMain: '#1f2937', // Main charcoal text
  textMuted: '#64748b', // Secondary slate
  textLight: '#94a3b8', // Tertiary slate
  border: '#e2e8f0', // Soft border
  bgCanvas: '#f8fafc', // Background canvas
  bgCard: '#ffffff', // Card surface
  warningBg: '#fffbeb', // Warm amber bg
  warningBorder: '#fef3c7', // Warm amber border
  warningText: '#92400e', // Warm amber text
};

/**
 * Convert 24-hour time or time string to 12-hour AM/PM format
 * Examples:
 *   "19:00" -> "7:00 PM"
 *   "09:30" -> "9:30 AM"
 *   "12:00" -> "12:00 PM"
 *   "00:00" -> "12:00 AM"
 *   "7:00 PM" -> "7:00 PM"
 */
export function formatTimeAmPm(timeStr?: string): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();

  // If already contains AM or PM
  if (/am|pm/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // Handle "HH:MM" or "HH:MM:SS"
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  }

  // If parseable as date string
  const parsedDate = new Date(trimmed);
  if (!isNaN(parsedDate.getTime())) {
    return formatDateTimeAmPm(parsedDate);
  }

  return trimmed;
}

/**
 * Format a Date or date string to include date and 12-hour AM/PM time
 * Example: "8 Sep 2026, 7:30 PM"
 */
export function formatDateTimeAmPm(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);

  const datePart = d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const timePart = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart}, ${timePart}`;
}

/**
 * Base layout wrapper for all Lock Kiya Jaye emails
 */
export function baseEmailLayout(options: BaseEmailOptions): string {
  const currentYear = new Date().getFullYear();
  const webUrl = options.frontendUrl || 'https://lockkiyajaye.com';
  const logoSrc = options.logoUrl || `${webUrl}/logo.png`;

  const badgeHtml = options.badge
    ? `
      <div style="margin-bottom: 20px; text-align: center;">
        <span style="display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; background-color: ${
          options.badge.variant === 'accent'
            ? COLORS.accentLight
            : options.badge.variant === 'warning'
              ? COLORS.warningBg
              : COLORS.primaryLight
        }; color: ${
          options.badge.variant === 'accent'
            ? COLORS.accent
            : options.badge.variant === 'warning'
              ? COLORS.warningText
              : COLORS.primary
        }; border: 1px solid ${
          options.badge.variant === 'accent'
            ? '#fecaca'
            : options.badge.variant === 'warning'
              ? COLORS.warningBorder
              : COLORS.primaryBorder
        };">
          ${options.badge.text}
        </span>
      </div>
    `
    : '';

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${options.title}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${COLORS.bgCanvas}; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; margin: 0 auto !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-header-padding { padding: 24px 20px !important; }
      .otp-digit { font-size: 32px !important; letter-spacing: 8px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bgCanvas}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Preview Text (Hidden in email body) -->
  <div style="display: none; font-size: 1px; color: ${COLORS.bgCanvas}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${options.previewText} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCanvas};">
    <tr>
      <td align="center" style="padding: 32px 12px 40px 12px;">
        <!-- Email Container (Max 580px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; width: 100%; background-color: ${COLORS.bgCard}; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); border: 1px solid ${COLORS.border};">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="5" style="background: linear-gradient(90deg, ${COLORS.primary} 0%, #059669 50%, ${COLORS.accent} 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="background-color: ${COLORS.primary}; padding: 32px 24px 28px 24px; text-align: center;" class="mobile-header-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td align="center">
                    <!-- Brand Logo Badge -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #ffffff; width: 62px; height: 62px; border-radius: 16px; border: 2px solid rgba(255, 255, 255, 0.25); vertical-align: middle; text-align: center; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);">
                          <img src="${logoSrc}" alt="Lock Kiya Jaye Logo" width="48" height="48" style="display: block; margin: 0 auto; width: 48px; height: 48px; border-radius: 6px; object-fit: contain;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px;">
                    <span style="color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: block;">
                      Lock Kiya Jaye
                    </span>
                    <span style="color: rgba(255, 255, 255, 0.8); font-size: 11px; font-weight: 500; letter-spacing: 1.2px; text-transform: uppercase; display: block; margin-top: 4px;">
                      Turf & Sports Arena Booking
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Card -->
          <tr>
            <td style="padding: 36px 36px 32px 36px;" class="mobile-padding">
              ${badgeHtml}
              ${options.content}
            </td>
          </tr>

          <!-- Support / Assistance Bar -->
          <tr>
            <td style="padding: 0 36px 28px 36px;" class="mobile-padding">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCanvas}; border-radius: 14px; border: 1px solid ${COLORS.border};">
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px; color: ${COLORS.textMuted}; line-height: 1.5; text-align: center;">
                    Questions or need help? Contact our support at 
                    <a href="mailto:support@lockkiyajaye.com" style="color: ${COLORS.primary}; font-weight: 600; text-decoration: none;">support@lockkiyajaye.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Divider -->
          <tr>
            <td style="padding: 0 36px;" class="mobile-padding">
              <div style="height: 1px; background-color: ${COLORS.border};"></div>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding: 24px 36px 32px 36px; text-align: center;" class="mobile-padding">
              <p style="margin: 0 0 10px 0; font-size: 12px; color: ${COLORS.textLight}; line-height: 1.6;">
                This is an automated notification from <strong>Lock Kiya Jaye</strong>.<br/>
                Please do not reply directly to this email unless specified.
              </p>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: ${COLORS.textLight};">
                <a href="${webUrl}" style="color: ${COLORS.textMuted}; text-decoration: none; margin: 0 8px;">Website</a> &bull;
                <a href="${webUrl}/contact" style="color: ${COLORS.textMuted}; text-decoration: none; margin: 0 8px;">Support</a> &bull;
                <a href="${webUrl}/privacy" style="color: ${COLORS.textMuted}; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: ${COLORS.textLight};">
                &copy; ${currentYear} Lock Kiya Jaye. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * OTP Verification Email Template
 */
export function renderOtpEmail(options: OtpEmailOptions): {
  html: string;
  text: string;
} {
  const expiresInMinutes = options.expiresInMinutes || 10;
  const otpCode = options.otp;

  const content = `
    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: ${COLORS.dark}; text-align: center; letter-spacing: -0.5px;">
      Verification Code
    </h1>
    <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textMuted}; text-align: center;">
      Use the one-time security code below to complete your verification and access your Lock Kiya Jaye account.
    </p>

    <!-- OTP Display Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
      <tr>
        <td align="center" style="background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px dashed #059669; border-radius: 18px; padding: 26px 16px;">
          <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #047857; display: block; margin-bottom: 10px;">
            ONE-TIME PASSWORD (OTP)
          </span>
          <div class="otp-digit" style="font-family: 'Courier New', Courier, Consolas, Monaco, monospace; font-size: 38px; font-weight: 900; letter-spacing: 12px; color: ${COLORS.primary}; text-indent: 12px; line-height: 1.2; user-select: all; -webkit-user-select: all;">
            ${otpCode}
          </div>
          <span style="display: inline-block; margin-top: 14px; font-size: 12px; font-weight: 600; color: #047857; background: #d1fae5; padding: 4px 12px; border-radius: 9999px;">
            ⏱️ Expires in ${expiresInMinutes} minutes
          </span>
          <span style="display: block; margin-top: 8px; font-size: 11px; color: #059669; font-weight: 500;">
            Issued at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
        </td>
      </tr>
    </table>

    <!-- Instructions / Copy Tip -->
    <p style="margin: 0 0 24px 0; font-size: 12px; color: ${COLORS.textLight}; text-align: center;">
      Double-tap or click the code above to copy it quickly.
    </p>

    <!-- Security Warning Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.warningBg}; border-radius: 14px; border: 1px solid ${COLORS.warningBorder}; margin-bottom: 12px;">
      <tr>
        <td style="padding: 16px 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="28" valign="top" style="font-size: 18px; line-height: 22px; padding-right: 8px;">
                🔒
              </td>
              <td style="font-size: 12px; line-height: 1.55; color: ${COLORS.warningText};">
                <strong>Security Reminder:</strong> Never share this code with anyone. Lock Kiya Jaye staff or turf owners will never ask for your verification code.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: ${COLORS.textLight}; text-align: center;">
      If you did not request this verification code, please ignore this email or reach out to our security team.
    </p>
  `;

  const html = baseEmailLayout({
    title: `Your Verification Code: ${otpCode} - Lock Kiya Jaye`,
    previewText: `Your Lock Kiya Jaye verification code is ${otpCode}. Valid for ${expiresInMinutes} minutes.`,
    badge: {
      text: 'SECURE VERIFICATION',
      variant: 'primary',
    },
    content,
    frontendUrl: options.frontendUrl,
    logoUrl: options.logoUrl,
  });

  const text = `
Lock Kiya Jaye - Security Verification

Your One-Time Password (OTP) is: ${otpCode}

This code is valid for ${expiresInMinutes} minutes.
Please do not share this code with anyone. Lock Kiya Jaye representatives will never ask you for your code.

If you did not request this code, you can safely ignore this email.

© ${new Date().getFullYear()} Lock Kiya Jaye. All rights reserved.
  `.trim();

  return { html, text };
}

/**
 * Contact Form Notification Email (Admin)
 */
export function renderContactNotificationEmail(
  options: ContactNotificationOptions,
): { html: string; text: string } {
  const submittedDate = formatDateTimeAmPm(options.submittedAt || new Date());
  const adminUrl = options.frontendUrl
    ? `${options.frontendUrl}/admin/contact`
    : 'https://lockkiyajaye.com/admin/contact';

  const content = `
    <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: ${COLORS.dark};">
      New Customer Inquiry
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textMuted};">
      A user has submitted a new inquiry via the contact form. Details are summarized below:
    </p>

    <!-- Details Table -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCanvas}; border-radius: 14px; border: 1px solid ${COLORS.border}; margin-bottom: 24px; overflow: hidden;">
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid ${COLORS.border}; font-size: 13px; font-weight: 600; color: ${COLORS.textMuted}; width: 28%;">
          From
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid ${COLORS.border}; font-size: 14px; font-weight: 700; color: ${COLORS.dark};">
          ${options.name}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid ${COLORS.border}; font-size: 13px; font-weight: 600; color: ${COLORS.textMuted};">
          Email
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid ${COLORS.border}; font-size: 14px; color: ${COLORS.primary};">
          <a href="mailto:${options.email}" style="color: ${COLORS.primary}; text-decoration: underline; font-weight: 600;">${options.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid ${COLORS.border}; font-size: 13px; font-weight: 600; color: ${COLORS.textMuted};">
          Subject
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid ${COLORS.border}; font-size: 14px; font-weight: 600; color: ${COLORS.dark};">
          ${options.subject}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; font-size: 13px; font-weight: 600; color: ${COLORS.textMuted};">
          Received At
        </td>
        <td style="padding: 14px 18px; font-size: 13px; color: ${COLORS.textMuted};">
          ${submittedDate}
        </td>
      </tr>
    </table>

    <!-- Message Content Box -->
    <span style="display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.textMuted}; margin-bottom: 8px;">
      Message Body:
    </span>
    <div style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-left: 4px solid ${COLORS.primary}; border-radius: 12px; padding: 20px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: ${COLORS.textMain}; white-space: pre-wrap;">${options.message}</p>
    </div>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 12px auto;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: ${COLORS.primary};">
          <a href="${adminUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px; letter-spacing: 0.5px;">
            Open in Admin Panel &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = baseEmailLayout({
    title: `New Inquiry: ${options.subject}`,
    previewText: `New contact message from ${options.name} (${options.email}): "${options.subject}"`,
    badge: {
      text: 'SUPPORT TICKET',
      variant: 'primary',
    },
    content,
    frontendUrl: options.frontendUrl,
    logoUrl: options.logoUrl,
  });

  const text = `
New Contact Inquiry - Lock Kiya Jaye

From: ${options.name} (${options.email})
Subject: ${options.subject}
Date: ${submittedDate}

Message:
${options.message}

View in Admin Panel: ${adminUrl}
  `.trim();

  return { html, text };
}

/**
 * Admin Support Response Email (To Customer)
 */
export function renderAdminResponseEmail(options: AdminResponseOptions): {
  html: string;
  text: string;
} {
  const contactUrl = options.frontendUrl
    ? `${options.frontendUrl}/contact`
    : 'https://lockkiyajaye.com/contact';
  const respondedDate = options.respondedAt
    ? formatDateTimeAmPm(options.respondedAt)
    : formatDateTimeAmPm(new Date());

  const content = `
    <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: ${COLORS.dark};">
      Hello ${options.customerName},
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textMuted};">
      Thank you for contacting Lock Kiya Jaye support. Our team has reviewed your inquiry regarding <strong>"${options.subject}"</strong>:
    </p>

    <!-- Response Box -->
    <div style="background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #bbf7d0; border-left: 5px solid ${COLORS.primary}; border-radius: 14px; padding: 22px; margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #047857; margin-bottom: 12px;">
        SUPPORT RESPONSE
      </div>
      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: ${COLORS.textMain}; white-space: pre-wrap;">
        ${options.adminResponse}
      </p>
    </div>

    <!-- Responder Badge -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCanvas}; border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 28px;">
      <tr>
        <td style="padding: 12px 18px; font-size: 12px; color: ${COLORS.textMuted};">
          <strong>Responded by:</strong> ${options.respondedBy} &bull; Lock Kiya Jaye Support &bull; ${respondedDate}
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: ${COLORS.textMuted}; text-align: center;">
      If you need additional assistance or have follow-up questions, please feel free to reach out again.
    </p>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 12px auto;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: ${COLORS.primary};">
          <a href="${contactUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px;">
            Visit Help & Support
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = baseEmailLayout({
    title: `Response to your inquiry: ${options.subject}`,
    previewText: `Lock Kiya Jaye Support responded to your inquiry: "${options.subject}"`,
    badge: {
      text: 'SUPPORT RESOLUTION',
      variant: 'success',
    },
    content,
    frontendUrl: options.frontendUrl,
    logoUrl: options.logoUrl,
  });

  const text = `
Hello ${options.customerName},

Thank you for reaching out to Lock Kiya Jaye Support.
Regarding: "${options.subject}"

Support Response:
${options.adminResponse}

Responded by: ${options.respondedBy} (Lock Kiya Jaye Support)

If you need any further assistance, feel free to contact us at ${contactUrl}.

© ${new Date().getFullYear()} Lock Kiya Jaye. All rights reserved.
  `.trim();

  return { html, text };
}

/**
 * Booking Confirmation Email Template
 */
export function renderBookingConfirmationEmail(
  options: BookingConfirmationOptions,
): { html: string; text: string } {
  const bookingsUrl = options.frontendUrl
    ? `${options.frontendUrl}/user/bookings`
    : 'https://lockkiyajaye.com/user/bookings';
  const shortId = options.bookingId
    ? options.bookingId.slice(-6).toUpperCase()
    : 'CONFIRMED';

  const formattedStartTime = formatTimeAmPm(options.startTime);
  const formattedEndTime = formatTimeAmPm(options.endTime);
  const formattedTimeSlot =
    formattedStartTime && formattedEndTime
      ? `${formattedStartTime} - ${formattedEndTime}`
      : formattedStartTime || formattedEndTime || options.startTime || '';

  const content = `
    <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: ${COLORS.dark}; text-align: center;">
      Your Turf is Locked! ⚽
    </h1>
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: ${COLORS.textMuted}; text-align: center;">
      Hi ${options.customerName}, your booking has been successfully confirmed. Get ready for an awesome game!
    </p>

    <!-- Booking Summary Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgCanvas}; border-radius: 16px; border: 1px solid ${COLORS.border}; margin-bottom: 24px; overflow: hidden;">
      <tr>
        <td colspan="2" style="background-color: ${COLORS.primary}; padding: 16px 20px; text-align: left;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <span style="color: rgba(255,255,255,0.8); font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">BOOKING REFERENCE</span>
                <span style="color: #ffffff; font-size: 16px; font-weight: 800; display: block; letter-spacing: 1px;">#${shortId}</span>
              </td>
              <td align="right">
                <span style="background: rgba(255,255,255,0.2); color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700;">CONFIRMED</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid ${COLORS.border}; font-size: 13px; font-weight: 600; color: ${COLORS.textMuted}; width: 35%;">
          Turf Arena
        </td>
        <td style="padding: 14px 20px; border-bottom: 1px solid ${COLORS.border}; font-size: 14px; font-weight: 700; color: ${COLORS.dark};">
          ${options.turfName}
          ${options.turfLocation ? `<span style="display: block; font-size: 12px; font-weight: 400; color: ${COLORS.textMuted};">${options.turfLocation}</span>` : ''}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid ${COLORS.border}; font-size: 13px; font-weight: 600; color: ${COLORS.textMuted};">
          Date
        </td>
        <td style="padding: 14px 20px; border-bottom: 1px solid ${COLORS.border}; font-size: 14px; font-weight: 700; color: ${COLORS.dark};">
          📅 ${options.bookingDate}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 20px; border-bottom: 1px solid ${COLORS.border}; font-size: 13px; font-weight: 600; color: ${COLORS.textMuted};">
          Time Slot
        </td>
        <td style="padding: 14px 20px; border-bottom: 1px solid ${COLORS.border}; font-size: 14px; font-weight: 700; color: ${COLORS.primary};">
          ⏰ ${formattedTimeSlot}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 20px; font-size: 13px; font-weight: 600; color: ${COLORS.textMuted};">
          Total Paid
        </td>
        <td style="padding: 14px 20px; font-size: 16px; font-weight: 900; color: ${COLORS.dark};">
          ₹${options.totalPrice}
        </td>
      </tr>
    </table>

    <!-- Quick Guidelines Card -->
    <div style="background-color: ${COLORS.bgCard}; border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px;">
      <span style="display: block; font-size: 12px; font-weight: 700; color: ${COLORS.dark}; margin-bottom: 6px;">
        💡 Important Matchday Reminders:
      </span>
      <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.6; color: ${COLORS.textMuted};">
        <li>Please arrive 10-15 minutes prior to your booked slot.</li>
        <li>Wear appropriate turf footwear or sports sneakers.</li>
        <li>Present this booking confirmation code (#${shortId}) at the venue desk if requested.</li>
      </ul>
    </div>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 12px auto;">
      <tr>
        <td align="center" style="border-radius: 12px; background-color: ${COLORS.primary};">
          <a href="${bookingsUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px;">
            View Booking Details
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = baseEmailLayout({
    title: `Booking Confirmed: ${options.turfName} (#${shortId})`,
    previewText: `Your turf slot at ${options.turfName} is confirmed for ${options.bookingDate} (${formattedTimeSlot})`,
    badge: {
      text: 'BOOKING CONFIRMED',
      variant: 'primary',
    },
    content,
    frontendUrl: options.frontendUrl,
    logoUrl: options.logoUrl,
  });

  const text = `
Booking Confirmed - Lock Kiya Jaye

Hi ${options.customerName}, your booking #${shortId} is confirmed!

Turf Arena: ${options.turfName}
Date: ${options.bookingDate}
Time: ${formattedTimeSlot}
Total Paid: ₹${options.totalPrice}

Manage your booking at: ${bookingsUrl}

© ${new Date().getFullYear()} Lock Kiya Jaye. All rights reserved.
  `.trim();

  return { html, text };
}
