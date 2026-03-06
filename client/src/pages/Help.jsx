import { Link } from "react-router-dom";
import {
  FaUserPlus,
  FaUserDoctor,
  FaRobot,
  FaCreditCard,
  FaCircleQuestion,
} from "react-icons/fa6";

const sections = [
  {
    icon: <FaUserPlus className="text-2xl text-blue-900" />,
    title: "Getting started",
    items: [
      "Create an account via Sign up or use the magic-link login. You can sign in with email (password or link).",
      "Choose your role: Patient (to book doctors), or register as a Doctor after signing up as a patient.",
      "Once logged in, use the navbar to go to Our Doctors, Dashboard, or the AI Chat.",
    ],
  },
  {
    icon: <FaUserDoctor className="text-2xl text-blue-900" />,
    title: "Finding and booking doctors",
    items: [
      "Go to Our Doctors to browse by specialization, location, and filters.",
      "Open a doctor’s profile to see availability, fee, and clinic details.",
      "Pick a date and time slot, add notes if needed, and complete payment to confirm the appointment.",
      "View and manage your appointments in your Dashboard.",
    ],
  },
  {
    icon: <FaRobot className="text-2xl text-blue-900" />,
    title: "AI health assistant (chatbot)",
    items: [
      "Click the chat icon or go to Chat from the menu (you must be logged in).",
      "Ask health-related questions for general information and guidance.",
      "The chatbot does not replace a doctor—use it to prepare for visits or general wellness. For diagnosis and treatment, always consult a doctor.",
    ],
  },
  {
    icon: <FaCreditCard className="text-2xl text-blue-900" />,
    title: "Payments and appointments",
    items: [
      "Consultation fees are shown on each doctor’s profile. You pay at the time of booking.",
      "Payment is processed securely. You’ll get a confirmation after a successful booking.",
      "If you need to cancel or reschedule, use your Dashboard or contact support.",
    ],
  },
  {
    icon: <FaCircleQuestion className="text-2xl text-blue-900" />,
    title: "Account, dashboard & doctors",
    items: [
      "Dashboard shows your appointments (as patient) or your schedule (as doctor). Admins have extra tools.",
      "Forgot password? Use Forgot password on the login page to reset via email.",
      "Doctors: Register via the Register link, then submit your details. An admin will verify your profile before you appear in the list.",
    ],
  },
];

function Help() {
  return (
    <div className="min-h-[70vh]">
      <section className="bg-blue-900 text-white py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Help center</h1>
          <p className="text-blue-100 text-lg">
            How to use MedTech — from signing up to booking appointments and using the chatbot.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-10">
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex gap-3 items-start mb-4">
                <div className="mt-0.5">{section.icon}</div>
                <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
              </div>
              <ul className="space-y-2 pl-0 list-none">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-gray-600 text-sm leading-relaxed">
                    <span className="text-blue-900 font-medium shrink-0">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center">
          <p className="text-gray-700 mb-2">Still need help?</p>
          <Link
            to="/contact"
            className="inline-block text-blue-900 font-medium hover:underline"
          >
            Contact us →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Help;
