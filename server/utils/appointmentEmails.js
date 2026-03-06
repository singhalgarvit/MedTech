/**
 * Appointment confirmation emails: patient (receipt-style) and doctor (booking notice).
 */
import { sendEmail } from "./sendEmail.js";

function formatDate(d) {
  if (!d) return "—";
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Patient email: receipt-style with doctor details, venue, and payment info.
 */
function buildPatientEmailHtml({ patientName, doctorName, doctorEmail, doctorDoc, dateStr, timeSlot, notes, amountPaid, paymentId, orderId }) {
  const dateFormatted = formatDate(new Date(dateStr));
  const feeDisplay = amountPaid != null ? `₹ ${Number(amountPaid).toFixed(2)}` : "—";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmed</title>
</head>
<body style="margin:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f4f4f5; padding:24px;">
  <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding:28px 24px; text-align:center;">
      <h1 style="margin:0; color:#fff; font-size:22px; font-weight:700;">Appointment Confirmed</h1>
      <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">Thank you for booking with MedTech</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 20px; color:#374151; font-size:15px;">Hi ${patientName || "there"},</p>
      <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.5;">Your consultation has been confirmed. Here are the details and your payment receipt.</p>

      <div style="background:#f8fafc; border-radius:8px; padding:20px; margin-bottom:20px; border-left:4px solid #3b82f6;">
        <h2 style="margin:0 0 12px; font-size:14px; color:#1e40af; text-transform:uppercase; letter-spacing:0.5px;">Appointment details</h2>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#374151;">
          <tr><td style="padding:6px 0; color:#6b7280;">Date</td><td style="padding:6px 0; font-weight:500;">${dateFormatted}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Time</td><td style="padding:6px 0; font-weight:500;">${timeSlot || "—"}</td></tr>
          ${notes ? `<tr><td style="padding:6px 0; color:#6b7280;">Notes</td><td style="padding:6px 0;">${notes}</td></tr>` : ""}
        </table>
      </div>

      <div style="background:#f8fafc; border-radius:8px; padding:20px; margin-bottom:20px;">
        <h2 style="margin:0 0 12px; font-size:14px; color:#1e40af; text-transform:uppercase; letter-spacing:0.5px;">Doctor &amp; clinic</h2>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#374151;">
          <tr><td style="padding:6px 0; color:#6b7280;">Doctor</td><td style="padding:6px 0; font-weight:500;">${doctorName || "—"}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Specialization</td><td style="padding:6px 0;">${doctorDoc?.specialization || "—"}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Clinic</td><td style="padding:6px 0;">${doctorDoc?.clinicName || "—"}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Address</td><td style="padding:6px 0;">${doctorDoc?.clinicAddress || "—"}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Location</td><td style="padding:6px 0;">${doctorDoc?.clinicLocation || "—"}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Contact</td><td style="padding:6px 0;"><a href="mailto:${doctorEmail || ''}" style="color:#3b82f6;">${doctorEmail || "—"}</a></td></tr>
        </table>
      </div>

      <div style="background:#ecfdf5; border-radius:8px; padding:20px; border:1px solid #a7f3d0;">
        <h2 style="margin:0 0 12px; font-size:14px; color:#047857; text-transform:uppercase; letter-spacing:0.5px;">Payment receipt</h2>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#374151;">
          <tr><td style="padding:6px 0; color:#6b7280;">Amount paid</td><td style="padding:6px 0; font-weight:600; color:#059669;">${feeDisplay}</td></tr>
          ${orderId ? `<tr><td style="padding:6px 0; color:#6b7280;">Order ID</td><td style="padding:6px 0; font-family:monospace; font-size:12px;">${orderId}</td></tr>` : ""}
          ${paymentId ? `<tr><td style="padding:6px 0; color:#6b7280;">Payment ID</td><td style="padding:6px 0; font-family:monospace; font-size:12px;">${paymentId}</td></tr>` : ""}
        </table>
      </div>

      <p style="margin:24px 0 0; color:#9ca3af; font-size:12px;">If you need to reschedule or cancel, please contact the clinic or visit your dashboard.</p>
    </div>
    <div style="padding:16px 24px; background:#f8fafc; text-align:center;">
      <p style="margin:0; color:#6b7280; font-size:12px;">MedTech — Your health, our care.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Doctor email: new booking notice with patient and appointment details.
 */
function buildDoctorEmailHtml({ doctorName, patientName, patientEmail, dateStr, timeSlot, notes, doctorDoc }) {
  const dateFormatted = formatDate(new Date(dateStr));
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Appointment Booking</title>
</head>
<body style="margin:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f4f4f5; padding:24px;">
  <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg, #047857 0%, #10b981 100%); padding:28px 24px; text-align:center;">
      <h1 style="margin:0; color:#fff; font-size:22px; font-weight:700;">New Appointment Booked</h1>
      <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">A patient has booked a consultation with you</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 20px; color:#374151; font-size:15px;">Dr. ${doctorName || "there"},</p>
      <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.5;">You have a new confirmed appointment. Details are below.</p>

      <div style="background:#f0fdf4; border-radius:8px; padding:20px; margin-bottom:20px; border-left:4px solid #10b981;">
        <h2 style="margin:0 0 12px; font-size:14px; color:#047857; text-transform:uppercase; letter-spacing:0.5px;">Patient details</h2>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#374151;">
          <tr><td style="padding:6px 0; color:#6b7280;">Name</td><td style="padding:6px 0; font-weight:500;">${patientName || "—"}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${patientEmail || ''}" style="color:#059669;">${patientEmail || "—"}</a></td></tr>
        </table>
      </div>

      <div style="background:#f8fafc; border-radius:8px; padding:20px; margin-bottom:20px;">
        <h2 style="margin:0 0 12px; font-size:14px; color:#1e40af; text-transform:uppercase; letter-spacing:0.5px;">Appointment</h2>
        <table style="width:100%; border-collapse:collapse; font-size:14px; color:#374151;">
          <tr><td style="padding:6px 0; color:#6b7280;">Date</td><td style="padding:6px 0; font-weight:500;">${dateFormatted}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Time</td><td style="padding:6px 0; font-weight:500;">${timeSlot || "—"}</td></tr>
          <tr><td style="padding:6px 0; color:#6b7280;">Clinic</td><td style="padding:6px 0;">${doctorDoc?.clinicName || "—"} — ${doctorDoc?.clinicAddress || ""}</td></tr>
          ${notes ? `<tr><td style="padding:6px 0; color:#6b7280;">Patient notes</td><td style="padding:6px 0;">${notes}</td></tr>` : ""}
        </table>
      </div>

      <p style="margin:24px 0 0; color:#9ca3af; font-size:12px;">View and manage this appointment in your dashboard.</p>
    </div>
    <div style="padding:16px 24px; background:#f8fafc; text-align:center;">
      <p style="margin:0; color:#6b7280; font-size:12px;">MedTech — Your health, our care.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send confirmation to patient (receipt-style).
 */
export async function sendAppointmentConfirmationToPatient(options) {
  const {
    patientEmail,
    patientName,
    doctorName,
    doctorEmail,
    doctorDoc,
    dateStr,
    timeSlot,
    notes,
    amountPaid,
    paymentId,
    orderId,
  } = options;
  if (!patientEmail) return;
  const html = buildPatientEmailHtml({
    patientName,
    doctorName,
    doctorEmail,
    doctorDoc,
    dateStr,
    timeSlot,
    notes,
    amountPaid,
    paymentId,
    orderId,
  });
  await sendEmail({
    to: patientEmail,
    subject: "Appointment confirmed – Your consultation receipt | MedTech",
    html,
  });
}

/**
 * Send confirmation to doctor (new booking notice).
 */
export async function sendAppointmentConfirmationToDoctor(options) {
  const {
    doctorEmail,
    doctorName,
    doctorDoc,
    patientName,
    patientEmail,
    dateStr,
    timeSlot,
    notes,
  } = options;
  if (!doctorEmail) return;
  const html = buildDoctorEmailHtml({
    doctorName,
    patientName,
    patientEmail,
    dateStr,
    timeSlot,
    notes,
    doctorDoc,
  });
  await sendEmail({
    to: doctorEmail,
    subject: "New appointment booked – " + (patientName || "Patient") + " | MedTech",
    html,
  });
}
