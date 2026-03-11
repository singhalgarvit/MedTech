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
    
    doc.setFontSize(22);
    doc.text("Payment Receipt", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.text("MedTech Clinic", 105, 30, null, null, "center");
    
    doc.line(20, 35, 190, 35);
    
    doc.text(`Receipt ID: ${apt.razorpayPaymentId}`, 20, 50);
    doc.text(`Consultation Date: ${formatDate(apt.date)} at ${apt.timeSlot}`, 20, 60);
    
    doc.text(`Doctor: Dr. ${apt.doctor?.name ?? "Unknown"}`, 20, 80);
    doc.text(`Specialization: ${apt.doctor?.specialization ?? "N/A"}`, 20, 90);
    
    doc.setFontSize(14);
    doc.text(`Amount Paid: Rs. ${apt.amount}`, 20, 110);
    
    doc.setFontSize(10);
    doc.text("Thank you for choosing MedTech.", 105, 130, null, null, "center");
    
    doc.save(`receipt_${apt.razorpayPaymentId}.pdf`);
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
