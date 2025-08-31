/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import questionsData from "../forms.json";
/* === supabase client === */
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import type { PostgrestError } from "@supabase/supabase-js";
const supabase = supabaseBrowser;

/* === tipos === */
import type { Answers, AnswerValue, PartialSignup, Question } from "@/types/forms";

/* === components === */
import ProgressBar from "@/components/ProgressBar";
import ConsentCard from "@/components/ConsentCard";
import QuestionCard from "@/components/QuestionCard";

/* === helpers === */
import { getRunId } from "@/lib/runId";
import { lsGet, lsSet } from "@/lib/storage";
import { isAnswerProvided } from "@/lib/validation";
import { getFirstQuestionId, getNextQuestionId, getQuestionById } from "@/lib/routing";
import { mapAnswersToColumns } from "@/lib/mapAnswersToColumns";
import { mapSingleAnswerToColumns } from "@/lib/mapSingleAnswer";

const QUESTIONS: Question[] = (questionsData as unknown) as Question[];

/* =========================
 * Logger de erro tipado
 * ========================= */
function logSbError(where: string, error: PostgrestError | null) {
  if (!error) return;
  console.error(where, {
    message: error.message ?? "(no message)",
    code: error.code ?? "(no code)",
    details: error.details ?? null,
    hint: error.hint ?? null,
  });
}

/* Debounce simples */
function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay = 400) {
  const t = useRef<number | null>(null);
  return (...args: Parameters<T>) => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => fn(...args), delay);
  };
}

export default function SignupPage() {
  const firstId = getFirstQuestionId(QUESTIONS);

  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentId, setCurrentId] = useState<number>(firstId);
  const [history, setHistory] = useState<number[]>(currentId !== -1 ? [currentId] : []);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>(""); // mantido para possível uso posterior

  const currentQuestion = useMemo(() => getQuestionById(QUESTIONS, currentId), [currentId]);

  const progress = useMemo(() => {
    const total = QUESTIONS.length;
    const answered = Object.keys(answers)
      .filter((k) => !Number.isNaN(Number(k)))
      .length;
    const pct = Math.min(100, Math.round((answered / total) * 100));
    return Number.isNaN(pct) ? 0 : pct;
  }, [answers]);

  /* ===== carregar estado do LS ===== */
  useEffect(() => {
    const savedAnswers = lsGet<Answers>("ettle_answers", {});
    const savedConsent = lsGet<boolean>("ettle_consent", false);
    const savedCurrentId = lsGet<number>("ettle_currentId", firstId);
    const savedHistory = lsGet<number[]>(
      "ettle_history",
      savedCurrentId !== -1 ? [savedCurrentId] : []
    );
    let sid = lsGet<string>("ettle_submission_id", "");

    if (Object.keys(savedAnswers).length) setAnswers(savedAnswers);
    setConsent(!!savedConsent);

    if (typeof savedCurrentId === "number" && getQuestionById(QUESTIONS, savedCurrentId)) {
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

  /* ===== persistir consent local + salvar no DB ===== */
  useEffect(() => {
    lsSet("ettle_consent", consent);
  }, [consent]);

  async function upsertPatch(patch: Record<string, unknown>) {
    const payload = {
      run_id: getRunId(),
      ...patch,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("signup_submissions")
      .upsert(payload, { onConflict: "run_id" });

    logSbError("Supabase incremental upsert error", error);
  }

  // Debounced para reduzir escrita excessiva
  const debouncedUpsert = useDebouncedCallback(upsertPatch, 450);

  async function saveConsentIfChecked(checked: boolean) {
    if (!checked) return;
    await upsertPatch({ consent_given_at: new Date().toISOString() });
  }

  // Envia parcial genérico (email/phone continuam cobertos pelo incremental também)
  async function sendPartialIfNeeded(q: Question, val: AnswerValue) {
    // Se for válido, já cairá no mapSingleAnswerToColumns, mas mantemos compat.
    if (!isAnswerProvided(q, val, answers)) return;

    const partial: PartialSignup = {};
    if (q.type === "email" && typeof val === "string") partial.email = val.trim();
    if (q.type === "phoneNumber" && typeof val === "string") partial.phone_e164 = val;

    if (Object.keys(partial).length) {
      debouncedUpsert(partial as Record<string, unknown>);
    }
  }

  // Salva incrementalmente a resposta atual (sempre answers; colunas apenas se válido)
  function saveSingleAnswer(q: Question, nextAnswers: Answers) {
    const patch = mapSingleAnswerToColumns(q, nextAnswers);
    debouncedUpsert(patch);
  }

  function setAnswer(questionId: number | string, value: AnswerValue) {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      lsSet("ettle_answers", next);

      // Se estamos respondendo a pergunta atual, dispara o incremental
      const q =
        typeof questionId === "number"
          ? getQuestionById(QUESTIONS, questionId)
          : currentQuestion;

      if (q) {
        saveSingleAnswer(q, next);
        // Opcional: ainda enviar parciais específicos (email/telefone)
        sendPartialIfNeeded(q, value);
      }

      return next;
    });
  }

  /* ========== Navegação (próximo/back) ========== */
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

    // Nada de envio final aqui — o incremental já salvou esta e as anteriores.
    const nextId = getNextQuestionId(currentQuestion, val);

    if (nextId === -1) {
      // Como fallback, faz um "consolidado" para garantir consistência
      const finalPayload = mapAnswersToColumns(answers, QUESTIONS);
      const { error } = await supabase
        .from("signup_submissions")
        .upsert(finalPayload, { onConflict: "run_id" })
        .select("id")
        .single();

      logSbError("Supabase final upsert (fallback) error", error);

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

  /* ========== Renders terminais ========== */
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
          <p className="mt-2 text-[var(--color-muted)]">
            We’ve received your information and will be in touch soon.
          </p>
          <div className="mt-6">
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
      </main>
    );
  }

  const q = currentQuestion!;
  const defaultVal = q.type === "checkbox" ? ([] as string[]) : "";
  const val = answers[q.id] ?? defaultVal;
  const optionLabels = (q.choices ?? []).map((c) => c.choice);
  const computedNextId = getNextQuestionId(q, val);
  const nextBtnLabel = computedNextId === -1 ? "Submit" : "Next";

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-light)] flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-3xl space-y-8">
        <ProgressBar progress={progress} enabled={!!consent} />

        {!consent ? (
          <div onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target?.type === "checkbox") {
              const checked = target.checked;
              setConsent(checked);
              // salvar consent no servidor ao marcar
              saveConsentIfChecked(checked);
            }
          }}>
            <ConsentCard consent={consent} setConsent={setConsent} />
          </div>
        ) : (
          <QuestionCard
            q={q}
            val={val}
            answers={answers}
            optionLabels={optionLabels}
            onSetAnswer={setAnswer}
            canGoBack={history.length > 1}
            onBack={goBack}
            onNext={goNext}
            nextBtnLabel={nextBtnLabel}
          />
        )}

        <p className="text-center text-xs text-[var(--color-muted)]">
          Ettle Ltd (“Ettle”) is committed to protecting your privacy and handling your information in line
          with UK data protection law (UK GDPR).
        </p>
      </div>
    </main>
  );
}
