import React, { useEffect, useState, useContext } from "react";
import { getMyAppointmentsForPatient } from "../../services/appointmentService";
import { TableSkeleton } from "../../components/Skeleton";
import {AuthContext} from "../../context/authContext";
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
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Failed to parse token", e);
    }
  }

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

    const teal = [18, 140, 145];

    /* ---------- HEADER ---------- */

    doc.setFillColor(...teal);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("MEDTECH", 20, 22);

    doc.setFontSize(11);
    doc.text("Digital Healthcare Platform", 20, 30);

    doc.text("https://medtech.garvitsinghal.in", 140, 22);
    doc.text("finance@medtech.com", 140, 30);

    /* ---------- TITLE ---------- */

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(22);
    doc.text("Medical Payment Receipt", 105, 60, { align: "center" });

    /* ---------- RECEIPT INFO ---------- */

    doc.setFontSize(12);

    doc.text("Receipt ID:", 20, 80);
    doc.text(apt.razorpayPaymentId, 60, 80);

    doc.text("Date:", 20, 90);
    doc.text(formatDate(apt.date), 60, 90);

    doc.text("Payment Method:", 20, 100);
    doc.text("Online (Razorpay)", 60, 100);

    /* ---------- PATIENT DETAILS ---------- */

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 110, 170, 10, "F");

    doc.setFontSize(13);
    doc.text("Patient Details", 22, 117);

    doc.setFontSize(11);

    doc.text("Name:", 20, 130);
    doc.text(user?.name ?? "Patient", 60, 130);

    doc.text("Email:", 20, 140);
    doc.text(user?.email ?? "N/A", 60, 140);

    /* ---------- APPOINTMENT DETAILS ---------- */

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 150, 170, 10, "F");

    doc.setFontSize(13);
    doc.text("Appointment Details", 22, 157);

    doc.setFontSize(11);

    doc.text("Doctor:", 20, 170);
    doc.text(`Dr. ${apt.doctor?.name ?? "Unknown"}`, 60, 170);

    doc.text("Specialization:", 20, 180);
    doc.text(apt.doctor?.specialization ?? "N/A", 60, 180);

    doc.text("Consultation Time:", 20, 190);
    doc.text(`${formatDate(apt.date)} | ${apt.timeSlot}`, 60, 190);

    /* ---------- PAYMENT SUMMARY ---------- */

    doc.setFillColor(240, 240, 240);
    doc.rect(20, 205, 170, 10, "F");

    doc.setFontSize(13);
    doc.text("Payment Summary", 22, 212);

    doc.setFontSize(12);

    doc.text("Consultation Fee:", 120, 230);
    doc.text(`${apt.amount}`, 190, 230, { align: "right" });

    doc.text("Tax:", 120, 240);
    doc.text("0", 190, 240, { align: "right" });

    doc.setFontSize(14);
    doc.text("Total Paid:", 120, 255);
    doc.text(`Rs. ${apt.amount}`, 190, 255, { align: "right" });

    /* ---------- FOOTER ---------- */

    doc.setFontSize(10);

    doc.text(
      "This is a digitally generated receipt and does not require a signature.",
      105,
      275,
      { align: "center" }
    );

    doc.text(
      "Thank you for choosing MedTech. Wishing you good health!",
      105,
      282,
      { align: "center" }
    );

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
                Appointment Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Appointment Time
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
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="text-xs text-gray-500">{apt.timeSlot ?? "—"}</div>
                </td> 
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Rs. {apt.amount}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDownloadReceipt(apt)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none cursor-pointer"
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
