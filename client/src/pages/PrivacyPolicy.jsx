import { Link } from "react-router-dom";

function PrivacyPolicy() {
  const lastUpdated = "February 2026";

  return (
    <div className="min-h-[70vh]">
      <section className="bg-blue-900 text-white py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-blue-100 text-lg">
            How MedTech collects, uses, and protects your information.
          </p>
          <p className="text-blue-200 text-sm mt-2">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-gray max-w-none space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Introduction</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              MedTech (“we”, “our”, or “us”) is committed to protecting your privacy. This policy describes what
              information we collect when you use our platform (website and services), how we use it, and your
              choices. By using MedTech, you agree to this Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Information we collect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">We may collect:</p>
            <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
              <li><strong>Account information:</strong> name, email, password (hashed), and role (patient, doctor, admin).</li>
              <li><strong>Profile and booking data:</strong> for doctors — specialization, clinic details, fees, availability; for patients — appointment history and notes you provide when booking.</li>
              <li><strong>Chat and AI usage:</strong> messages you send to our AI health assistant, which we use to provide the service and may use in anonymized form to improve the product.</li>
              <li><strong>Payment information:</strong> payment is processed by our third-party payment provider; we do not store full card details.</li>
              <li><strong>Technical and usage data:</strong> IP address, device type, browser, and how you use the site (e.g. pages visited) where applicable.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">3. How we use your information</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use the information to provide and improve our services, including: creating and managing your
              account; showing doctor profiles and availability; processing appointments and payments; running the
              AI health assistant; sending confirmations and important service messages; verifying doctor
              credentials; and ensuring security and compliance. We may use anonymized or aggregated data for
              analytics and product improvement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Sharing and disclosure</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We do not sell your personal information. We may share data with: service providers (e.g. hosting,
              email, payment processing) who act on our instructions; doctors and patients as needed to fulfill
              appointments (e.g. doctor sees patient name and booking details); and authorities when required by
              law or to protect rights and safety.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Data security</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use appropriate technical and organizational measures to protect your data (e.g. encryption in
              transit, secure storage, access controls). No system is completely secure; we encourage you to use
              a strong password and keep your login details private.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Your rights</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Depending on where you live, you may have the right to: access your personal data; correct
              inaccuracies; request deletion; restrict or object to certain processing; and data portability. To
              exercise these rights or ask questions, contact us using the details below. You may also have the
              right to lodge a complaint with a supervisory authority.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Cookies and similar technologies</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may use cookies and similar technologies for essential operation (e.g. keeping you logged in),
              security, and to understand how the site is used. You can adjust your browser settings to limit or
              block cookies; some features may not work if you disable them.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Retention</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services,
              comply with legal obligations, resolve disputes, and enforce our agreements. Chat and appointment
              data may be retained for these purposes and for improving our services within legal limits.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">9. Changes to this policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will post the updated version on this page
              and update the “Last updated” date. Continued use of MedTech after changes constitutes acceptance
              of the revised policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">10. Contact us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For privacy-related questions or requests, please{" "}
              <Link to="/contact" className="text-blue-900 font-medium hover:underline">
                contact us
              </Link>
              {" "}or email hello@medtech.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
