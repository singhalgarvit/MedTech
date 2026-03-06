import { useState } from "react";
import { FaLocationDot, FaPhoneVolume, FaEnvelope } from "react-icons/fa6";
import { submitContactMessage } from "../services/contactService";

const contactInfo = [
  {
    icon: <FaLocationDot className="text-2xl text-blue-900" />,
    title: "Visit us",
    value: "Jaipur, Rajasthan, India",
    href: "https://www.google.com/maps/search/+Jaipur%2C+Rajasthan",
  },
  {
    icon: <FaEnvelope className="text-2xl text-blue-900" />,
    title: "Email",
    value: "hello@medtech.com",
    href: "mailto:hello@medtech.com",
  },
  {
    icon: <FaPhoneVolume className="text-2xl text-blue-900" />,
    title: "Call us",
    value: "+91 6375560097",
    href: "tel:+916375560097",
  },
];

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSubmitError(err.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh]">
      <section className="bg-blue-900 text-white py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Get in touch</h1>
          <p className="text-blue-100 text-lg">
            Have a question or feedback? We’d love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact information</h2>
            <p className="text-gray-600 mb-8">
              Reach out via the details below or send us a message using the form.
            </p>
            <ul className="space-y-6">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <span className="mt-1">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-gray-600 hover:text-blue-900 transition-colors"
                    >
                      {item.value}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Send a message</h2>
            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-green-700 font-medium mb-2">Thank you for your message.</p>
                <p className="text-gray-600 text-sm">We’ll get back to you as soon as we can.</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-blue-900 font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none"
                    placeholder="What is this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none resize-none"
                    placeholder="Your message..."
                  />
                </div>
                {submitError && (
                  <p className="text-red-600 text-sm">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-950 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
