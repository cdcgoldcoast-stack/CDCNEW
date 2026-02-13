import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy | Concept Design Construct"
        description="Privacy Policy for Concept Design Construct - Gold Coast Renovations"
        url="/privacy-policy"
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <h1 className="text-h1 mb-8">Privacy Policy</h1>
          <p className="text-body text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-neutral max-w-none space-y-8">
            <section>
              <h2 className="text-h3 mb-4">1. Introduction</h2>
              <p className="text-body text-muted-foreground">
                Concept Design Construct ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">2. Information We Collect</h2>
              <p className="text-body text-muted-foreground mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-body text-muted-foreground">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and postal address when you submit enquiry forms or request quotes.</li>
                <li><strong>Project Information:</strong> Details about your renovation requirements, budget, and property location.</li>
                <li><strong>Communication Data:</strong> Records of conversations through our chat feature or email correspondence.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and browsing patterns collected automatically.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website and services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3 mb-4">3. How We Use Your Information</h2>
              <p className="text-body text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-body text-muted-foreground">
                <li>Respond to your enquiries and provide quotes</li>
                <li>Communicate with you about our services</li>
                <li>Process and manage renovation projects</li>
                <li>Improve our website and services</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3 mb-4">4. Information Sharing</h2>
              <p className="text-body text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements. We may also disclose information when required by law or to protect our rights.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">5. Data Security</h2>
              <p className="text-body text-muted-foreground">
                We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">6. Data Retention</h2>
              <p className="text-body text-muted-foreground">
                We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">7. Your Rights</h2>
              <p className="text-body text-muted-foreground mb-4">Under Australian Privacy Principles, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-body text-muted-foreground">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with the Office of the Australian Information Commissioner</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3 mb-4">8. Cookies</h2>
              <p className="text-body text-muted-foreground">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">9. Third-Party Links</h2>
              <p className="text-body text-muted-foreground">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">10. Changes to This Policy</h2>
              <p className="text-body text-muted-foreground">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">11. Contact Us</h2>
              <p className="text-body text-muted-foreground">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="text-body text-muted-foreground mt-4">
                <strong>Concept Design Construct</strong><br />
                Email: info@cdconstruct.com.au<br />
                Gold Coast, Queensland, Australia
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
