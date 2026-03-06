import { Link } from "react-router-dom";

function TermsOfService() {
  const lastUpdated = "March 2025";

  return (
    <div className="min-h-[70vh]">
      <section className="bg-blue-900 text-white py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-blue-100 text-lg">
            The terms that govern your use of the MedTech platform.
          </p>
          <p className="text-blue-200 text-sm mt-2">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-gray max-w-none space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              By accessing or using MedTech (“the platform”, “our services”), you agree to be bound by these
              Terms of Service and our Privacy Policy. If you do not agree, do not use the platform. We may
              update these terms from time to time; continued use after changes constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Description of service</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              MedTech provides an online platform that connects patients with verified doctors for booking
              consultations, and offers an AI-powered health assistant (chatbot) for general health information.
              We facilitate discovery, booking, and payments; we do not employ the doctors or provide medical
              care ourselves. The AI assistant is for informational purposes only and is not a substitute for
              professional medical advice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Accounts and eligibility</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You must be at least 18 years old (or the age of majority in your jurisdiction) and able to
              form a binding contract to use the platform. You are responsible for keeping your account
              credentials secure and for all activity under your account. You must provide accurate and
              complete information when registering. Doctors must meet our verification requirements before
              their profiles are listed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">4. User obligations</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
              <li>Use the platform only for lawful purposes and in accordance with these terms.</li>
              <li>Not impersonate others, misrepresent your identity, or provide false information.</li>
              <li>Not misuse, disrupt, or attempt to gain unauthorized access to the platform or others’ accounts.</li>
              <li>Not use the AI assistant to seek or rely on it for emergency or life-threatening situations; seek emergency services when needed.</li>
              <li>Comply with applicable laws, including those related to healthcare and data protection.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Appointments and payments</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Booking an appointment creates a relationship between you and the doctor; MedTech is not a party
              to that relationship. Consultation fees are set by doctors and displayed before booking. Payment
              is processed through our payment provider. Cancellation and refund policies may apply; check
              the booking flow and contact support for specific cases. We are not responsible for the quality
              of medical care provided by doctors.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">6. AI health assistant</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The chatbot provides general health information and guidance only. It does not provide medical
              advice, diagnosis, or treatment. Do not rely on it for emergency care or as a substitute for a
              qualified healthcare provider. Always consult a doctor for medical decisions. We do not guarantee
              the accuracy or completeness of the AI’s responses.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Prohibited use</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You may not use the platform to violate any law, infringe others’ rights, transmit harmful or
              illegal content, scrape or automate access without permission, or use the service in any way that
              could harm MedTech, users, or third parties. We may suspend or terminate accounts that breach
              these terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Intellectual property</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              MedTech and its content (including design, text, logos, and software) are owned by us or our
              licensors. You may not copy, modify, or distribute our content without permission. You retain
              rights to content you submit; you grant us a license to use it as needed to provide and improve
              the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">9. Disclaimers</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The platform and content are provided “as is”. We disclaim all warranties, express or implied,
              including merchantability and fitness for a particular purpose. We do not guarantee uninterrupted
              or error-free service. We are not responsible for the conduct of doctors, patients, or third
              parties, or for any health outcomes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">10. Limitation of liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              To the fullest extent permitted by law, MedTech and its affiliates shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data,
              or use, arising from your use of the platform. Our total liability for any claims related to
              the service shall not exceed the amount you paid to us in the twelve months preceding the claim
              (or one hundred dollars if greater).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">11. Indemnification</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You agree to indemnify and hold MedTech, its affiliates, and their officers, directors, and
              employees harmless from any claims, damages, or expenses (including reasonable legal fees)
              arising from your use of the platform, your breach of these terms, or your violation of any
              law or third-party rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">12. Termination</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may suspend or terminate your account and access at any time for breach of these terms or for
              any other reason. You may stop using the platform at any time. Provisions that by their nature
              should survive (e.g. disclaimers, limitation of liability, indemnity) will survive termination.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">13. Changes to the terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may modify these terms at any time. We will post the updated terms on this page and update
              the “Last updated” date. Your continued use of the platform after changes constitutes
              acceptance. For material changes, we may provide additional notice where appropriate.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">14. General</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              These terms constitute the entire agreement between you and MedTech regarding the platform. If
              any provision is held invalid, the remainder remains in effect. Our failure to enforce a right
              does not waive it. These terms are governed by the laws of India, and any disputes shall be
              subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan, unless otherwise
              required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">15. Contact</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For questions about these Terms of Service, please{" "}
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

export default TermsOfService;
