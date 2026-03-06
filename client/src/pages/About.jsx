import { Link } from "react-router-dom";
import { FaStethoscope, FaUserDoctor, FaRobot, FaHeartPulse } from "react-icons/fa6";

const values = [
  {
    icon: <FaUserDoctor className="text-3xl text-blue-900" />,
    title: "Verified doctors",
    description: "Every doctor on MedTech is verified with credentials and experience, so you can book with confidence.",
  },
  {
    icon: <FaHeartPulse className="text-3xl text-blue-900" />,
    title: "Patient-first",
    description: "We focus on making it easy to find the right doctor, book appointments, and manage your health.",
  },
  {
    icon: <FaRobot className="text-3xl text-blue-900" />,
    title: "AI-assisted insights",
    description: "Our chatbot helps you get quick, reliable health information and guidance before or alongside consultations.",
  },
  {
    icon: <FaStethoscope className="text-3xl text-blue-900" />,
    title: "Seamless consultations",
    description: "Book online, pay securely, and get reminders — all in one place for a smooth healthcare experience.",
  },
];

function About() {
  return (
    <div className="min-h-[70vh]">
      <section className="bg-blue-900 text-white py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">About MedTech</h1>
          <p className="text-blue-100 text-lg">
            Connecting patients and doctors through technology for better healthcare access.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Who we are</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            MedTech is a healthcare platform that brings patients and doctors together online. We believe everyone
            deserves easy access to quality medical care. Whether you’re looking for a specialist, want to book an
            appointment, or need quick health information, we’re here to help.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our mission</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            To make healthcare more accessible and convenient by combining verified doctors, online booking and
            payments, and AI-powered tools. We aim to reduce the friction between patients and providers so that
            more people can get the care they need, when they need it.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">What we offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {values.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-600 leading-relaxed">
            Thank you for trusting MedTech. If you have any questions or feedback, please{" "}
            <Link to="/contact" className="text-blue-900 font-medium hover:underline">
              get in touch
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
