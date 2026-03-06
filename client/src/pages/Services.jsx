import { Link } from "react-router-dom";
import {
  FaUserDoctor,
  FaCalendarCheck,
  FaRobot,
  FaCreditCard,
  FaShieldHalved,
  FaComments,
} from "react-icons/fa6";

const services = [
  {
    icon: <FaUserDoctor className="text-3xl text-blue-900" />,
    title: "Find verified doctors",
    description:
      "Browse doctors by specialization, location, and availability. Every listed doctor is verified with credentials and experience before joining the platform.",
    cta: "Browse doctors",
    to: "/doctors",
  },
  {
    icon: <FaCalendarCheck className="text-3xl text-blue-900" />,
    title: "Book appointments online",
    description:
      "Choose a date and time slot that works for you. Pay securely online and receive confirmation and reminders so you never miss an appointment.",
    cta: "Book now",
    to: "/doctors",
  },
  {
    icon: <FaRobot className="text-3xl text-blue-900" />,
    title: "AI health assistant",
    description:
      "Get quick, reliable health information and guidance from our AI-powered chatbot. Use it to understand symptoms, prepare for visits, or find general wellness tips.",
    cta: "Try chatbot",
    to: "/chat",
  },
  {
    icon: <FaCreditCard className="text-3xl text-blue-900" />,
    title: "Secure payments",
    description:
      "Pay consultation fees safely through our integrated payment system. Transparent pricing and instant confirmation for a hassle-free experience.",
    cta: null,
    to: null,
  },
  {
    icon: <FaShieldHalved className="text-3xl text-blue-900" />,
    title: "Doctor registration & verification",
    description:
      "If you’re a doctor, you can register on MedTech. Our admin team verifies credentials so patients can trust every profile on the platform.",
    cta: "Register as doctor",
    to: "/register",
  },
  {
    icon: <FaComments className="text-3xl text-blue-900" />,
    title: "Support & contact",
    description:
      "Have questions or feedback? Reach out through our contact form or use the details in the footer. We’re here to help.",
    cta: "Contact us",
    to: "/contact",
  },
];

function Services() {
  return (
    <div className="min-h-[70vh]">
      <section className="bg-blue-900 text-white py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Our services</h1>
          <p className="text-blue-100 text-lg">
            Everything you need to connect with doctors and manage your healthcare in one place.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="mb-3">{item.icon}</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.description}</p>
              {item.cta && item.to && (
                <Link
                  to={item.to}
                  className="mt-4 inline-block text-blue-900 font-medium hover:underline text-sm"
                >
                  {item.cta} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;
