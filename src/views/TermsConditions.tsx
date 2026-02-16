import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms & Conditions | Concept Design Construct"
        description="Review Concept Design Construct terms covering service information, quote guidance, intellectual property, and legal conditions for using this site."
        url="/terms-conditions"
      />
      <Header />
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <h1 className="text-h1 mb-8">Terms & Conditions</h1>
          <p className="text-body text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-neutral max-w-none space-y-8">
            <section>
              <h2 className="text-h3 mb-4">1. Acceptance of Terms</h2>
              <p className="text-body text-muted-foreground">
                By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">2. About Us</h2>
              <p className="text-body text-muted-foreground">
                Concept Design Construct is a QBCC licensed building company operating in the Gold Coast, Queensland, Australia. We specialise in residential renovations including kitchens, bathrooms, and whole-home renovations.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">3. Use of Website</h2>
              <p className="text-body text-muted-foreground mb-4">You agree to use this website only for lawful purposes and in a way that does not:</p>
              <ul className="list-disc pl-6 space-y-2 text-body text-muted-foreground">
                <li>Infringe the rights of others</li>
                <li>Restrict or inhibit anyone else's use of the website</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Transmit harmful, offensive, or illegal content</li>
                <li>Attempt to gain unauthorised access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3 mb-4">4. Information Accuracy</h2>
              <p className="text-body text-muted-foreground">
                While we strive to ensure all information on this website is accurate and up-to-date, we make no warranties or representations about the completeness, accuracy, or reliability of any content. Information is provided for general purposes only and should not be relied upon as professional advice.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">5. Quotes and Estimates</h2>
              <p className="text-body text-muted-foreground">
                Any quotes or estimates provided through this website or our enquiry process are indicative only and subject to change following detailed assessment. Final pricing will be confirmed in a formal written quotation or contract.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">6. Intellectual Property</h2>
              <p className="text-body text-muted-foreground">
                All content on this website, including text, images, graphics, logos, and design elements, is the property of Concept Design Construct or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">7. Project Images</h2>
              <p className="text-body text-muted-foreground">
                Images of completed projects displayed on this website are for illustrative purposes. Actual results may vary based on individual project requirements, materials selected, and site conditions.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">8. Third-Party Links</h2>
              <p className="text-body text-muted-foreground">
                This website may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of linked sites and accept no responsibility for them or any loss or damage arising from your use of them.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">9. Limitation of Liability</h2>
              <p className="text-body text-muted-foreground">
                To the fullest extent permitted by law, Concept Design Construct shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website or our services. Our liability is limited to the maximum extent permitted under Australian Consumer Law.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">10. Indemnification</h2>
              <p className="text-body text-muted-foreground">
                You agree to indemnify and hold harmless Concept Design Construct, its directors, employees, and agents from any claims, damages, or expenses arising from your use of this website or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">11. Governing Law</h2>
              <p className="text-body text-muted-foreground">
                These Terms and Conditions are governed by and construed in accordance with the laws of Queensland, Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Queensland.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">12. Changes to Terms</h2>
              <p className="text-body text-muted-foreground">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to this website. Your continued use of the website constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">13. Severability</h2>
              <p className="text-body text-muted-foreground">
                If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-h3 mb-4">14. Contact Us</h2>
              <p className="text-body text-muted-foreground">
                If you have any questions about these Terms and Conditions, please contact us at:
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

export default TermsConditions;
