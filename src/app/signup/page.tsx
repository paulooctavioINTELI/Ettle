/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import type React from "react";
import Link from "next/link";
import questionsData from "../forms.json";
/* === supabase client === */
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { PostgrestError } from "@supabase/supabase-js";
const supabase = supabaseBrowser; // ✅ objeto do cliente

/* === PHONE: lib responsiva com todos os países === */
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"; // se preferir, mova para app/layout.tsx
import { isValidPhoneNumber } from "libphonenumber-js";

/** ===============================
 *  Tipos
 *  =============================== */
type QType =
  | "dropdown"
  | "paragraph"
  | "shortAnswer"
  | "checkbox"
  | "multipleChoice"
  | "phoneNumber"
  | "email";

type ChoiceObj = {
  choice: string;
  nextQuestion: number;
};

type Question = {
  id: number;
  question: string;
  type: QType;
  choices: ChoiceObj[] | null;
  placeholder: string;
  optional: boolean;
  nextQuestion?: number;
  other?: boolean;
};

// respostas: string (textos/seleções únicas) ou string[] (checkbox)
type AnswerValue = string | string[];
type Answers = Record<number | string, AnswerValue>;
type PartialSignup = { email?: string; phone_e164?: string };

const QUESTIONS: Question[] = (questionsData as unknown) as Question[];

/** =======================
 *  Helpers
 *  ======================= */
function generateUUIDFallback() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getRunId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "ettle_mvp_run_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = globalThis.crypto?.randomUUID?.() ?? generateUUIDFallback();
    localStorage.setItem(KEY, id);
  }
  return id;
}

function getQuestionById(id: number) {
  return QUESTIONS.find((q) => q.id === id) || null;
}
function getFirstQuestionId() {
  return QUESTIONS[0]?.id ?? -1;
}
function normalizeDigits(input: string) {
  return input.replace(/[^\d]/g, "");
}
function isE164(e164: string) {
  return /^\+\d{8,15}$/.test(e164);
}

/* === localStorage helpers === */
function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** =======================
 *  Inputs
 *  ======================= */
function ShortAnswerField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white placeholder:text-[var(--color-muted)] outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)]"
    />
  );
}

function ParagraphField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white placeholder:text-[var(--color-muted)] outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)]"
    />
  );
}

function DropdownField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)]"
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function MultipleChoiceField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3">
          <input
            type="radio"
            name="mc"
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxField({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: string[];
}) {
  function toggle(choice: string) {
    if (value.includes(choice)) onChange(value.filter((c) => c !== choice));
    else onChange([...value, choice]);
  }
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3">
          <input
            type="checkbox"
            value={opt}
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

/** =======================
 *  Phone input (RESPONSIVO + TODOS OS PAÍSES)
 *  ======================= */
function PhoneNumberField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState<string>(value || "");

  useEffect(() => {
    // mantém sincronizado caso venha do LS ou navegação
    setLocal((prev) => (prev !== value ? (value || "") : prev));
  }, [value]);

  const valid = local ? isValidPhoneNumber(local) : false;

  return (
    <div className="w-full">
      <PhoneInput
        defaultCountry="gb"          // 🇬🇧 padrão (pode trocar)
        value={local}
        onChange={(v) => {
          const next = v || "";
          setLocal(next);
          onChange(next);            // salva em E.164 (ex.: +447... quando válido)
        }}
        // Melhora de responsividade: ocupa 100% e adapta o dropdown
        className="w-full"
        inputClassName="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)] placeholder:text-[var(--color-muted)]"
        countrySelectorStyleProps={{
          className: "rounded-[var(--radius-soft)] bg-[#2A2A2F] ring-1 ring-white/10",
          buttonClassName:
            "h-full w-auto px-3 py-3 text-white hover:bg-white/5 rounded-[var(--radius-soft)]",
          dropdownArrowClassName:
            "max-h-72 overflow-auto bg-[#1f1f23] text-white ring-1 ring-white/10 rounded-[var(--radius-soft)]",
        }}
        inputProps={{
          placeholder: placeholder || "Enter your phone number",
          name: "phone",
          autoComplete: "tel",
          "aria-invalid": !!local && !valid,
        }}
        forceDialCode
        showDisabledDialCodeAndPrefix
        // mobile-friendly
        
      />

      <div className="mt-2 text-xs">
        {local ? (
          <span className={valid ? "text-emerald-400/90" : "text-red-400/90"}>
            {valid ? "Valid number" : "Please enter a valid number"}
          </span>
        ) : (
          <span className="text-[var(--color-muted)]">
            Include country code. Example: +44 7123 456789
          </span>
        )}
      </div>
    </div>
  );
}

/** =======================
 *  Validação
 *  ======================= */
function isAnswerProvided(q: Question, val: AnswerValue, all?: Answers) {
  if (q.optional) return true;

  switch (q.type) {
    case "shortAnswer":
    case "paragraph":
    case "dropdown":
    case "multipleChoice": {
      if (typeof val === "string" && val.trim().length > 0) {
        if (q.other && val === "Other") {
          return !!String(all?.[`${q.id}_other`] ?? "").trim();
        }
        return true;
      }
      return false;
    }

    case "checkbox": {
      if (Array.isArray(val) && val.length > 0) {
        if (q.other && val.includes("Other")) {
          return !!String(all?.[`${q.id}_other`] ?? "").trim();
        }
        return true;
      }
      return false;
    }

    case "phoneNumber": {
      if (typeof val !== "string") return false;
      // garante validade real com libphonenumber
      return isValidPhoneNumber(val);
    }

    case "email":
      return typeof val === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

    default:
      return false;
  }
}

/** =======================
 *  Roteamento
 *  ======================= */
function getNextQuestionId(q: Question, answer: AnswerValue): number {
  if (q.choices && (q.type === "multipleChoice" || q.type === "dropdown")) {
    const selected = String(answer ?? "");
    const hit = q.choices.find((c) => c.choice === selected);
    if (hit) return hit.nextQuestion;
    return q.nextQuestion ?? -1;
  }

  if (q.choices && q.type === "checkbox" && Array.isArray(answer)) {
    const selected: string[] = answer;
    const selectedChoices = q.choices.filter((c) => selected.includes(c.choice));
    if (selectedChoices.length > 0) {
      const distinctNexts = Array.from(new Set(selectedChoices.map((c) => c.nextQuestion)));
      if (distinctNexts.length === 1) return distinctNexts[0];
      return selectedChoices[0].nextQuestion ?? (q.nextQuestion ?? -1);
    }
    return q.nextQuestion ?? -1;
  }

  return q.nextQuestion ?? -1;
}

/** =======================
 *  Mapeamento -> colunas da tabela
 *  ======================= */
function mapAnswersToColumns(all: Answers) {
  const get = (id: number) => all[id];
  const getOther = (id: number) => all[`${id}_other`];

  const yesNoBool = (id: number): boolean | null => {
    const v = String(get(id) ?? "").toLowerCase();
    if (v === "yes") return true;
    if (v === "no") return false;
    return null;
  };

  const emailQ = QUESTIONS.find((x) => x.type === "email");
  const phoneQ = QUESTIONS.find((x) => x.type === "phoneNumber");

  return {
    full_name: String(get(2) ?? "") || null,
    age_group: String(get(3) ?? "") || null,
    gender: String(get(4) ?? (getOther(4) ? `Other: ${getOther(4)}` : "")) || null,

    email: emailQ ? String(all[emailQ.id] ?? "").trim() || null : null,
    phone_e164: phoneQ ? String(all[phoneQ.id] ?? "") || null : null,

    nationality: String(get(7) ?? (getOther(7) ? `Other: ${getOther(7)}` : "")) || null,
    employment_status: String(get(8) ?? (getOther(8) ? `Other: ${getOther(8)}` : "")) || null,
    activity_level: String(get(10) ?? "") || null,
    primary_goal: String(get(11) ?? (getOther(11) ? `Other: ${getOther(11)}` : "")) || null,
    training_environment: String(get(12) ?? "") || null,
    weight_training_experience: String(get(13) ?? "") || null,
    greatest_challenge: String(get(14) ?? (getOther(14) ? `Other: ${getOther(14)}` : "")) || null,
    details_general: String(get(15) ?? "") || null,

    sports_participation: yesNoBool(16),
    sports_list: String(get(17) ?? "") || null,
    sports_context: String(get(18) ?? (getOther(18) ? `Other: ${getOther(18)}` : "")) || null,

    trainer_experience: String(get(19) ?? "") || null,
    trainer_benefits: Array.isArray(get(20)) ? (get(20) as string[]) : null,
    trainer_benefits_details: String(get(21) ?? "") || null,
    trainer_challenges: Array.isArray(get(22)) ? (get(22) as string[]) : null,
    trainer_challenges_details: String(get(23) ?? "") || null,
    trainer_stop_reasons: Array.isArray(get(24)) ? (get(24) as string[]) : null,
    trainer_stop_details: String(get(25) ?? "") || null,

    trainer_past_benefits: Array.isArray(get(41)) ? (get(41) as string[]) : null,
    trainer_past_benefits_details: String(get(42) ?? "") || null,

    future_trainer_intent: String(get(26) ?? "") || null,
    future_trainer_details: String(get(27) ?? "") || null,

    apps_used: yesNoBool(28),
    apps_list: String(get(29) ?? "") || null,
    apps_improvements: Array.isArray(get(30)) ? (get(30) as string[]) : null,
    apps_improvements_details: String(get(31) ?? "") || null,

    subscription_intent: String(get(33) ?? "") || null,
    features_important: Array.isArray(get(34)) ? (get(34) as string[]) : null,
    features_details: String(get(35) ?? "") || null,

    price_expectation: String(get(32) ?? "") || null,
    injuries: String(get(36) ?? "") || null,
    medication: String(get(37) ?? "") || null,
    limitations: String(get(38) ?? "") || null,

    early_access_choice: String(get(39) ?? "") || null,
    marketing_opt_in: Array.isArray(get(40)) ? (get(40) as string[]).length > 0 : null,

    answers: all,
    run_id: getRunId(),
    consent_given_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/** =======================
 *  Logger de erro tipado
 *  ======================= */
function logSbError(where: string, error: PostgrestError | null) {
  if (!error) return;
  console.error(where, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

/** =======================
 *  Página
 *  ======================= */
export default function SignupPage() {
  const firstId = getFirstQuestionId();
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentId, setCurrentId] = useState<number>(firstId);
  const [history, setHistory] = useState<number[]>(currentId !== -1 ? [currentId] : []);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>(""); // mantém (não usado no upsert)

  const currentQuestion = useMemo(() => getQuestionById(currentId), [currentId]);

  const progress = useMemo(() => {
    const total = QUESTIONS.length;
    const answered = Object.keys(answers)
      .filter((k) => !Number.isNaN(Number(k))) // apenas ids numéricos (ignora "_other")
      .length;
    const pct = Math.min(100, Math.round((answered / total) * 100));
    return Number.isNaN(pct) ? 0 : pct;
  }, [answers]);

  useEffect(() => {
    const savedAnswers = lsGet<Answers>("ettle_answers", {});
    const savedConsent = lsGet<boolean>("ettle_consent", false);
    const savedCurrentId = lsGet<number>("ettle_currentId", firstId);
    const savedHistory = lsGet<number[]>("ettle_history", savedCurrentId !== -1 ? [savedCurrentId] : []);
    let sid = lsGet<string>("ettle_submission_id", "");

    if (Object.keys(savedAnswers).length) setAnswers(savedAnswers);
    setConsent(!!savedConsent);

    if (typeof savedCurrentId === "number" && getQuestionById(savedCurrentId)) {
      setCurrentId(savedCurrentId);
      setHistory(savedHistory);
    }

    if (!sid) {
      sid =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      lsSet("ettle_submission_id", sid);
    }
    setSubmissionId(sid);
  }, [firstId]);

  useEffect(() => {
    lsSet("ettle_consent", consent);
  }, [consent]);

  function setAnswer(questionId: number | string, value: AnswerValue) {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      lsSet("ettle_answers", next);
      return next;
    });
  }

  /** ====== ENVIO PARCIAL (email / telefone) ====== */
  async function upsertPartial(partial: PartialSignup) {
    const payload = {
      run_id: getRunId(),
      ...partial,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("signup_submissions")
      .upsert(payload, { onConflict: "run_id" });

    logSbError("Supabase partial upsert error", error);
  }

  async function sendPartialIfNeeded(q: Question, val: AnswerValue) {
    if (!isAnswerProvided(q, val, answers)) return;

    if (q.type === "email" && typeof val === "string") {
      await upsertPartial({ email: val.trim() });
    }
    if (q.type === "phoneNumber" && typeof val === "string") {
      await upsertPartial({ phone_e164: val });
    }
  }

  /** ====== Próxima pergunta / envio final ====== */
  async function goNext() {
    if (!currentQuestion) return;
    const val = answers[currentQuestion.id];

    if (!isAnswerProvided(currentQuestion, val, answers)) {
      alert(
        currentQuestion.type === "phoneNumber"
          ? "Please enter a valid phone number in international format."
          : "Please answer this question to continue."
      );
      return;
    }

    // Envio parcial quando for email/telefone
    await sendPartialIfNeeded(currentQuestion, val);

    const nextId = getNextQuestionId(currentQuestion, val);

    if (nextId === -1) {
      // Mapeia todas as respostas para as colunas e faz upsert final
      const finalPayload = mapAnswersToColumns(answers);

      const { error } = await supabase
        .from("signup_submissions")
        .upsert(finalPayload, { onConflict: "run_id" })
        .select("id")
        .single();

      logSbError("Supabase final upsert error", error);

      if (error) {
        alert("There was an error saving your responses. Please try again.");
        return;
      }

      setSubmitted(true);
      return;
    }

    setCurrentId(nextId);
    setHistory((h) => {
      const nh = [...h, nextId];
      lsSet("ettle_history", nh);
      return nh;
    });
    lsSet("ettle_currentId", nextId);
  }

  function goBack() {
    if (history.length <= 1) return;
    const newHist = [...history];
    newHist.pop();
    const prevId = newHist[newHist.length - 1];
    setHistory(newHist);
    setCurrentId(prevId);
    lsSet("ettle_currentId", prevId);
    lsSet("ettle_history", newHist);
  }

  if (currentId === -1) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-light)] flex items-center justify-center px-6">
        <div className="card w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">No questions configured</h1>
          <p className="mt-2 text-[var(--color-muted)]">Please add questions to the JSON schema.</p>
          <div className="mt-6">
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-light)] flex items-center justify-center px-6">
        <div className="card w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Thank you!</h1>
          <p className="mt-2 text-[var(--color-muted)]">We’ve received your information and will be in touch soon.</p>
          <div className="mt-6">
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
      </main>
    );
  }

  // Render
  const q = currentQuestion!;
  const defaultVal = q.type === "checkbox" ? ([] as string[]) : "";
  const val = answers[q.id] ?? defaultVal;
  const optionLabels = (q.choices ?? []).map((c) => c.choice);
  const computedNextId = getNextQuestionId(q, val);
  const nextBtnLabel = computedNextId === -1 ? "Submit" : "Next";

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-light)] flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-3xl space-y-8">
        <div className={`h-2 w-full overflow-hidden rounded-full ${!consent ? "bg-white/5" : "bg-white/10"}`} aria-hidden>
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          />
        </div>

        {!consent ? (
          <section className="card">
            <h2 className="text-xl md:text-2xl font-bold">Privacy & Consent Notice</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
              “This questionnaire collects some personal details, such as your
              name, age, and contact information, as well as health and fitness
              information. Because health data is classed as special category
              data, we require your explicit consent to process it. We use the
              information you provide to personalise your workout
              recommendations, support your onboarding, and improve our
              services. If you choose, we may also contact you with early access
              opportunities or updates about the app.
              <br />
              <br />
              Your data will be stored securely, will not be shared with third
              parties for marketing without your consent, and will be kept for
              no longer than 12 months unless you continue using the app. You
              may access, update, delete, or withdraw your consent at any time
              by contacting us at{" "}
              <a href="mailto:contact@ettle.app" className="underline">
                contact@ettle.app
              </a>
              . For more information, please read our{" "}
              <Link href="/privacy" className="underline text-[var(--color-primary)]">
                Privacy Policy
              </Link>
              .”
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
                By confirming below, you agree that you are 18 or over, that you
                consent to Ettle processing your personal information for the
                purposes described above, and that you give your explicit
                consent for us to process the health and fitness information you
                provide.
              </span>
            </label>
          </section>
        ) : (
          <div className="card">
            <h1 className="text-xl md:text-2xl font-bold">{q.question}</h1>
            {q.optional && <p className="mt-1 text-xs text-[var(--color-muted)]">Optional</p>}

            <div className="mt-5">
              {q.type === "shortAnswer" && (
                <ShortAnswerField value={val as string} onChange={(v) => setAnswer(q.id, v)} placeholder={q.placeholder} />
              )}

              {q.type === "paragraph" && (
                <ParagraphField value={val as string} onChange={(v) => setAnswer(q.id, v)} placeholder={q.placeholder} />
              )}

              {q.type === "dropdown" && (
                <>
                  <DropdownField
                    value={(val as string) ?? ""}
                    onChange={(v) => setAnswer(q.id, v)}
                    options={optionLabels}
                    placeholder={q.placeholder}
                  />
                  {q.other && (val as string) === "Other" && (
                    <div className="mt-4">
                      <ShortAnswerField
                        value={answers[`${q.id}_other`] as string ?? ""}
                        onChange={(v) => setAnswer(`${q.id}_other`, v)}
                        placeholder="Please specify..."
                      />
                    </div>
                  )}
                </>
              )}

              {q.type === "multipleChoice" && (
                <>
                  <MultipleChoiceField
                    value={(val as string) ?? ""}
                    onChange={(v) => setAnswer(q.id, v)}
                    options={optionLabels}
                  />
                  {q.other && (val as string) === "Other" && (
                    <div className="mt-4">
                      <ShortAnswerField
                        value={answers[`${q.id}_other`] as string ?? ""}
                        onChange={(v) => setAnswer(`${q.id}_other`, v)}
                        placeholder="Please specify..."
                      />
                    </div>
                  )}
                </>
              )}

              {q.type === "checkbox" && (
                <>
                  <CheckboxField
                    value={(val as string[]) ?? []}
                    onChange={(v) => setAnswer(q.id, v)}
                    options={optionLabels}
                  />
                  {q.other && Array.isArray(val) && val.includes("Other") && (
                    <div className="mt-4">
                      <ShortAnswerField
                        value={answers[`${q.id}_other`] as string ?? ""}
                        onChange={(v) => setAnswer(`${q.id}_other`, v)}
                        placeholder="Please specify..."
                      />
                    </div>
                  )}
                </>
              )}

              {q.type === "phoneNumber" && (
                <PhoneNumberField
                  value={(val as string) ?? ""}
                  onChange={(v) => setAnswer(q.id, v)}
                  placeholder={q.placeholder}
                />
              )}

              {q.type === "email" && (
                <input
                  type="email"
                  value={(val as string) ?? ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder || "name@example.com"}
                  className="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white placeholder:text-[var(--color-muted)] outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)]"
                />
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="rounded-[var(--radius-soft)] px-4 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/5 disabled:opacity-40"
                disabled={history.length <= 1}
              >
                Back
              </button>

              <button
                type="button"
                onClick={goNext}
                className="btn-primary"
              >
                {nextBtnLabel}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-[var(--color-muted)]">
          Ettle Ltd (“Ettle”) is committed to protecting your privacy and handling your information in line with UK data protection law (UK GDPR).
        </p>
      </div>
    </main>
  );
}
