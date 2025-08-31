import Link from "next/link";

export default function ConsentCard({
  consent,
  setConsent,
}: {
  consent: boolean;
  setConsent: (v: boolean) => void;
}) {
  return (
    <section className="card">
      <h2 className="text-xl md:text-2xl font-bold">Privacy & Consent Notice</h2>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
        “This questionnaire collects some personal details, such as your name, age, and contact
        information, as well as health and fitness information. Because health data is classed as
        special category data, we require your explicit consent to process it. We use the information
        you provide to personalise your workout recommendations, support your onboarding, and improve our
        services. If you choose, we may also contact you with early access opportunities or updates about the app.
        <br />
        <br />
        Your data will be stored securely, will not be shared with third parties for marketing without your consent,
        and will be kept for no longer than 12 months unless you continue using the app. You may access, update, delete,
        or withdraw your consent at any time by contacting us at{" "}
        <a href="mailto:contact@ettle.app" className="underline">contact@ettle.app</a>.
        For more information, please read our{" "}
        <Link href="/privacy" className="underline text-[var(--color-primary)]">Privacy Policy</Link>.
        ”
      </p>

      <label className="mt-6 flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
          required
        />
        <span>
          By confirming below, you agree that you are 18 or over, that you consent to Ettle processing your personal
          information for the purposes described above, and that you give your explicit consent for us to process the
          health and fitness information you provide.
        </span>
      </label>
    </section>
  );
}
