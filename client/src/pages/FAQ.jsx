import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "Go to Our Doctors, search by specialization or location, and open a doctor’s profile. Choose an available date and time slot, add notes if needed, and complete payment to confirm your appointment. You can view and manage bookings in your Dashboard.",
  },
  {
    question: "Is my health data secure?",
    answer:
      "Yes. We use secure connections and follow good practices to protect your information. Your data is used only to provide the service and is not shared with third parties for marketing.",
  },
  {
    question: "How does the AI health assistant work?",
    answer:
      "Our chatbot lets you ask health-related questions and get general information and guidance. You can describe symptoms and get possible causes and suggestions for the type of specialist to see. It’s for support only—always consult a doctor for diagnosis and treatment.",
  },
  {
    question: "Do I need to download an app to use MedTech?",
    answer:
      "No. You can use MedTech in your browser on any device. Sign up, log in, book appointments, and use the AI chat directly on the website.",
  },
  {
    question: "Is the AI a replacement for a doctor?",
    answer:
      "No. The AI gives general guidance and information only. It does not replace professional medical advice, diagnosis, or treatment. Always see a certified doctor for health concerns.",
  },
  {
    question: "How do I pay for an appointment?",
    answer:
      "Consultation fees are shown on each doctor’s profile. When you book, you pay online through our secure payment flow. You’ll get a confirmation once payment is successful.",
  },
  {
    question: "How can I register as a doctor on MedTech?",
    answer:
      "Sign up as a patient first, then use the Register link to submit your doctor profile (credentials, specialization, clinic details, etc.). Our team will verify your profile; once approved, you’ll appear in the doctor list and can receive bookings.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-[70vh]">
      <section className="bg-blue-900 text-white py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Frequently asked questions</h1>
          <p className="text-blue-100 text-lg">
            Quick answers to common questions about MedTech.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center gap-4 focus:outline-none focus:ring-inset rounded-xl"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <span className="text-xl text-blue-900 shrink-0" aria-hidden>
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`px-6 transition-all duration-300 ease-in-out ${
                  openIndex === index ? "pb-4" : "overflow-hidden"
                }`}
                style={{
                  maxHeight: openIndex === index ? "500px" : "0",
                  opacity: openIndex === index ? 1 : 0,
                }}
              >
                <p className="text-gray-600 text-sm leading-relaxed pt-0">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm mb-2">Can’t find your answer?</p>
          <Link to="/contact" className="text-blue-900 font-medium hover:underline">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FAQ;
