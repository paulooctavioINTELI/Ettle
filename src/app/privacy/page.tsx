"use client"
// app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  // TODO: personalize these placeholders
  const EFFECTIVE_DATE = "Insert Date"; // e.g., "21 August 2025"
  const LAST_UPDATED = "Insert Date"; // e.g., "21 August 2025"
  const COMPANY_NAME_AND_ADDRESS = "[Your Company Name & Registered Address]";
  const CONTACT_EMAIL = "contact@ettle.app"; // from your notice

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-light)] px-6 py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="rounded-md px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:opacity-90"
            type="button"
          >
            ← Back to Home
          </button>
        </div>
        <h1 className="text-3xl font-bold">
          Ettle Fitness App – Privacy Policy
        </h1>
        <p className="mt-4 text-[var(--color-muted)] text-sm">
          Effective Date: {EFFECTIVE_DATE} • Last Updated: {LAST_UPDATED}
        </p>

        {/* 1. Who We Are */}
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">1. Who We Are</h2>
          <p className="text-white/90">
            Ettle Fitness App is operated by {COMPANY_NAME_AND_ADDRESS}, who
            acts as the Data Controller for the personal data collected through
            this form and related services.
          </p>
          <p className="text-white/90">
            If you have any questions about this policy or your data, contact:
            <br />
            Email:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        {/* 2. What Data We Collect */}
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">2. What Data We Collect</h2>

          <h3 className="mt-2 font-medium">A. Personal Data</h3>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>
              Name, email address, age, gender, nationality, employment status
            </li>
            <li>
              Your preferences and feedback related to fitness apps and training
              services
            </li>
          </ul>

          <h3 className="mt-4 font-medium">
            B. Special Category Data (requires explicit consent)
          </h3>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>
              Health and fitness history (e.g., injuries, medical conditions,
              medication use, training experience)
            </li>
          </ul>
        </section>

        {/* 3. How We Use Your Data */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>
              <span className="font-medium">Service delivery</span> — setting up
              your profile, tailoring workout plans, and contacting you for
              onboarding if you opt into early access
            </li>
            <li>
              <span className="font-medium">Market research</span> —
              understanding user needs to improve the app
            </li>
            <li>
              <span className="font-medium">Marketing (optional)</span> —
              sending offers, updates, and news, only if you have opted in
            </li>
            <li>
              <span className="font-medium">Safety &amp; compliance</span> —
              ensuring your training programme is appropriate for your health
              needs
            </li>
          </ul>
        </section>

        {/* 4. Lawful Bases for Processing */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">
            4. Lawful Bases for Processing
          </h2>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>
              <span className="font-medium">Consent</span> — for marketing and
              for processing special category data
            </li>
            <li>
              <span className="font-medium">Contractual necessity</span> — where
              processing is needed to provide the service you requested (e.g.,
              contacting you for early access)
            </li>
            <li>
              <span className="font-medium">Legitimate interests</span> — for
              aggregated, anonymised analytics
            </li>
          </ul>
        </section>

        {/* 5. Data Sharing */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">5. Data Sharing</h2>
          <p className="text-white/90">
            We do not sell your data. Your information will only be shared with:
          </p>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>Our authorised staff who need access to deliver the service</li>
            <li>
              Service providers (e.g., Google Workspace) who process data on our
              behalf under strict contractual terms
            </li>
          </ul>
        </section>

        {/* 6. International Transfers */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">6. International Transfers</h2>
          <p className="text-white/90">
            Your data may be stored on Google servers located outside the UK.
            Google is certified under the EU–US Data Privacy Framework, ensuring
            adequate protection.
          </p>
        </section>

        {/* 7. Data Retention */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">7. Data Retention</h2>
          <p className="text-white/90">
            We will keep your personal data for 12 months after collection
            unless you become a paying user, in which case it will be retained
            for the duration of your account plus 12 months after closure.
            Special category data will be deleted as soon as it is no longer
            needed for the purpose collected.
          </p>
        </section>

        {/* 8. Your Rights */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">8. Your Rights</h2>
          <p className="text-white/90">You have the right to:</p>
          <ul className="list-disc pl-5 text-white/90 space-y-1">
            <li>Access a copy of your data</li>
            <li>Request correction or deletion of your data</li>
            <li>
              Withdraw consent at any time (this will not affect prior lawful
              processing)
            </li>
            <li>Request restriction or object to certain processing</li>
            <li>Data portability in a commonly used format</li>
          </ul>
          <p className="text-white/90">
            To exercise your rights, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        {/* 9. Marketing Communications */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">9. Marketing Communications</h2>
          <p className="text-white/90">
            We will only send you marketing emails if you have explicitly opted
            in via a clear checkbox in our form. You can unsubscribe at any time
            via the link in our emails.
          </p>
        </section>

        {/* 10. Data Security */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">10. Data Security</h2>
          <p className="text-white/90">
            We store all data securely and restrict access to authorised staff
            only. Special category data is subject to additional safeguards.
          </p>
        </section>

        {/* 11. Complaints */}
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">11. Complaints</h2>
          <p className="text-white/90">
            If you are unhappy with how we handle your data, contact us first.
            You also have the right to lodge a complaint with the UK Information
            Commissioner’s Office (ICO) at{" "}
            <a
              href="https://ico.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              ico.org.uk
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
