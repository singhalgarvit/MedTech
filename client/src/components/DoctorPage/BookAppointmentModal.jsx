import React, { useState, useEffect, useCallback } from "react";
import { getSlots, createOrder, verifyPayment } from "../../services/appointmentService";
import { SlotsSkeleton } from "../Skeleton";

function formatDateForInput(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayStr() {
  return formatDateForInput(new Date());
}

/** "14:30" -> "2:30 PM"; "09:00" -> "9:00 AM" */
function formatSlot12h(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? "AM" : "PM";
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Group slots by hour: { "10": ["10:00", "10:05", ...], "11": [...] } */
function groupSlotsByHour(slots) {
  const byHour = {};
  for (const s of slots) {
    const hour = s.slice(0, 2);
    if (!byHour[hour]) byHour[hour] = [];
    byHour[hour].push(s);
  }
  return byHour;
}

function BookAppointmentModal({ doctor, onClose, onSuccess }) {
  const [date, setDate] = useState(todayStr());
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsError, setSlotsError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchSlots = useCallback(async () => {
    if (!doctor?._id || !date) return;
    setLoadingSlots(true);
    setSlotsError("");
    setTimeSlot("");
    try {
      const data = await getSlots(doctor._id, date);
      setAvailableSlots(data.availableSlots || []);
      setBookedSlots(data.bookedSlots || []);
    } catch (err) {
      setSlotsError(err.message || "Could not load slots");
      setAvailableSlots([]);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [doctor?._id, date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handlePayAndBook = async () => {
    if (!timeSlot) {
      setError("Please select a time slot");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const orderData = await createOrder(doctor._id, date, timeSlot, notes);
      await loadRazorpayScript();

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "MedTech",
        description: `Appointment with Dr. ${doctor.name}`,
        handler: async (response) => {
          try {
            await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            onSuccess();
            alert("Appointment booked successfully!");
          } catch (err) {
            setError(err.message || "Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setError("Payment failed or was cancelled");
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  const fee = doctor?.consultationFee ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book Appointment</h2>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-gray-500 hover:text-black">
            &times;
          </button>
        </div>
        <p className="text-gray-600 mb-4">Dr. {doctor?.name} · ₹{fee} consultation fee</p>

        <label className="block font-medium mb-1">Date</label>
        <input
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4"
        />

        <label className="block font-medium mb-1">Time</label>
        {loadingSlots ? (
          <SlotsSkeleton />
        ) : slotsError ? (
          <p className="text-amber-600 mb-4">{slotsError}</p>
        ) : (() => {
            const bookedSet = new Set(bookedSlots);
            const allByHour = groupSlotsByHour([...availableSlots, ...bookedSlots]);
            const hours = Object.keys(allByHour).sort((a, b) => Number(a) - Number(b));
            if (hours.length === 0) {
              return <p className="text-gray-500 mb-4">No slots for this day</p>;
            }
            return (
              <div className="mb-4 max-h-[220px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                {hours.map((hour) => {
                  const slotsInHour = allByHour[hour].sort();
                  const firstSlot = slotsInHour[0];
                  const hourLabel = firstSlot ? formatSlot12h(firstSlot).replace(/:.*\s/, " ") : `${hour}:00`;
                  return (
                    <div key={hour} className="mb-3 last:mb-0">
                      <p className="text-xs font-medium text-gray-500 mb-1.5">{hourLabel} – {formatSlot12h(String((Number(hour) + 1) % 24).padStart(2, "0") + ":00")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {slotsInHour.map((slot) => {
                          const isBooked = bookedSet.has(slot);
                          return isBooked ? (
                            <span
                              key={slot}
                              className="px-2.5 py-1 rounded-md border border-gray-200 bg-white text-gray-400 text-xs cursor-not-allowed line-through"
                              title="Booked"
                            >
                              {formatSlot12h(slot)}
                            </span>
                          ) : (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`px-2.5 py-1 rounded-md border text-xs transition-colors ${
                                timeSlot === slot
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                              }`}
                            >
                              {formatSlot12h(slot)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

        <label className="block font-medium mb-1">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes for the doctor"
          className="border rounded px-3 py-2 w-full mb-4 min-h-[80px]"
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePayAndBook}
            disabled={submitting || !timeSlot || loadingSlots}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Opening payment..." : `Pay ₹${fee} & Book`}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2.5 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookAppointmentModal;
