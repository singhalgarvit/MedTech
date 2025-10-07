import { useState } from "react";

function FAQs() {
  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "Simply search for a doctor by specialization or location, choose an available time slot, and confirm your appointment online.",
    },
    {
      question: "Is My Health Data Secure?",
      answer:
        "Absolutely! We use end-to-end encryption and comply with medical-grade security standards to keep your information safe.",
    },
    {
      question: "How Does the AI Health Assistant Work?",
      answer:
        "You can enter your symptoms, and our AI assistant provides possible causes and suggests the right type of specialist for consultation.",
    },
    {
      question: "Do I Need to Download an App to Use MedTech?",
      answer:
        "No, you can access all features through our website, but a mobile app is available for added convenience.",
    },
    {
      question: "Is the AI Diagnosis a Replacement for a Doctor?",
      answer:
        "No, the AI provides guidance and suggestions, but it does not replace professional medical advice. Always consult a certified doctor for diagnosis and treatment.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 px-6 md:px-20 bg-gray-100 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-8">FAQs</h2>
      <div className="max-w-3xl mx-auto text-left">
           {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden my-3"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                <span className="text-2xl text-gray-800">
                  {openIndex === index ? "-" : "+"}
                </span>
              </button>
              <div
                className={`px-6 text-gray-700 transition-all duration-300 ease-in-out max-h-96 mt-0 ${
                  openIndex === index ? "h-auto pb-4" : "h-0 overflow-hidden"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default FAQs;
