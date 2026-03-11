import React, { useEffect, useState } from "react";
import { getMyAppointmentsForPatient } from "../../services/appointmentService";
import { TableSkeleton } from "../../components/Skeleton";
import jsPDF from "jspdf";

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PatientPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMyAppointmentsForPatient();
        if (!cancelled) {
          // Only show appointments that have an amount and a payment ID
          const history = (Array.isArray(data) ? data : []).filter(
            (apt) => apt.amount != null && apt.razorpayPaymentId
          );
          setPayments(history);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load payment history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleDownloadReceipt = (apt) => {
    const doc = new jsPDF();

    // Colors
    const primaryColor = [41, 128, 185];

    // HEADER BACKGROUND
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 30, "F");

    // TITLE
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("MEDTECH", 105, 15, null, null, "center");

    doc.setFontSize(12);
    doc.text("Payment Receipt", 105, 23, null, null, "center");

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // CLINIC INFO
    doc.setFontSize(10);
    doc.text("MedTech Digital Clinic", 20, 40);
    doc.text("www.medtech.com", 20, 46);

    // RECEIPT DETAILS
    doc.setFontSize(11);
    doc.text(`Receipt ID: ${apt.razorpayPaymentId}`, 140, 40);
    doc.text(`Date: ${formatDate(apt.date)}`, 140, 46);

    // LINE
    doc.line(20, 52, 190, 52);

    // PATIENT SECTION
    doc.setFontSize(14);
    doc.text("Appointment Details", 20, 65);

    doc.setFontSize(11);

    doc.text(`Doctor`, 20, 80);
    doc.text(`Dr. ${apt.doctor?.name ?? "Unknown"}`, 80, 80);

    doc.text(`Specialization`, 20, 90);
    doc.text(`${apt.doctor?.specialization ?? "N/A"}`, 80, 90);

    doc.text(`Consultation Time`, 20, 100);
    doc.text(`${formatDate(apt.date)} at ${apt.timeSlot}`, 80, 100);

    // PAYMENT BOX
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 115, 170, 25, "F");

    doc.setFontSize(13);
    doc.text("Payment Details", 25, 125);

    doc.setFontSize(12);
    doc.text(`Amount Paid:`, 25, 135);
    doc.text(`Rs. ${apt.amount}`, 160, 135, null, null, "right");

    // FOOTER LINE
    doc.line(20, 160, 190, 160);

    // FOOTER TEXT
    doc.setFontSize(10);
    doc.text(
      "Thank you for choosing MedTech. Wishing you good health!",
      105,
      170,
      null,
      null,
      "center"
    );

    doc.text("This is a digitally generated receipt.", 105, 176, null, null, "center");

    doc.save(`MedTech_Receipt_${apt.razorpayPaymentId}.pdf`);
  };

  if (loading) return <TableSkeleton rows={5} cols={4} />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (payments.length === 0) return <p className="text-gray-500">No payment history found.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Appointment Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount Paid
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((apt) => (
              <tr key={apt._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">{apt.doctor?.name ?? "—"}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div>{formatDate(apt.date)}</div>
                  <div className="text-xs text-gray-500">{apt.timeSlot ?? "—"}</div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Rs. {apt.amount}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDownloadReceipt(apt)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
                  >
                    Download Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientPaymentHistory;
