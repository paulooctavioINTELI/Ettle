"use client";

import {
  CheckboxField,
  DropdownField,
  MultipleChoiceField,
  ParagraphField,
  PhoneNumberField,
  ShortAnswerField,
} from "./inputs";
import type { Answers, Question } from "@/types/forms";

export default function QuestionCard({
  q,
  val,
  answers,
  optionLabels,
  onSetAnswer,
  canGoBack,
  onBack,
  onNext,
  nextBtnLabel,
}: {
  q: Question;
  val: string | string[];
  answers: Answers;
  optionLabels: string[];
  onSetAnswer: (id: number | string, v: string | string[]) => void;
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  nextBtnLabel: string;
}) {
  return (
    <div className="card">
      <h1 className="text-xl md:text-2xl font-bold">{q.question}</h1>
      {q.optional && <p className="mt-1 text-xs text-[var(--color-muted)]">Optional</p>}

      <div className="mt-5">
        {q.type === "shortAnswer" && (
          <ShortAnswerField
            value={(val as string) ?? ""}
            onChange={(v) => onSetAnswer(q.id, v)}
            placeholder={q.placeholder}
          />
        )}

        {q.type === "paragraph" && (
          <ParagraphField
            value={(val as string) ?? ""}
            onChange={(v) => onSetAnswer(q.id, v)}
            placeholder={q.placeholder}
          />
        )}

        {q.type === "dropdown" && (
          <>
            <DropdownField
              value={(val as string) ?? ""}
              onChange={(v) => onSetAnswer(q.id, v)}
              options={optionLabels}
              placeholder={q.placeholder}
            />
            {q.other && (val as string) === "Other" && (
              <div className="mt-4">
                <ShortAnswerField
                  value={(answers[`${q.id}_other`] as string) ?? ""}
                  onChange={(v) => onSetAnswer(`${q.id}_other`, v)}
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
              onChange={(v) => onSetAnswer(q.id, v)}
              options={optionLabels}
            />
            {q.other && (val as string) === "Other" && (
              <div className="mt-4">
                <ShortAnswerField
                  value={(answers[`${q.id}_other`] as string) ?? ""}
                  onChange={(v) => onSetAnswer(`${q.id}_other`, v)}
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
              onChange={(v) => onSetAnswer(q.id, v)}
              options={optionLabels}
            />
            {q.other && Array.isArray(val) && val.includes("Other") && (
              <div className="mt-4">
                <ShortAnswerField
                  value={(answers[`${q.id}_other`] as string) ?? ""}
                  onChange={(v) => onSetAnswer(`${q.id}_other`, v)}
                  placeholder="Please specify..."
                />
              </div>
            )}
          </>
        )}

        {q.type === "phoneNumber" && (
          <PhoneNumberField
            value={(val as string) ?? ""}
            onChange={(v) => onSetAnswer(q.id, v)}
            placeholder={q.placeholder}
          />
        )}

        {q.type === "email" && (
          <input
            type="email"
            value={(val as string) ?? ""}
            onChange={(e) => onSetAnswer(q.id, e.target.value)}
            placeholder={q.placeholder || "name@example.com"}
            className="w-full rounded-[var(--radius-soft)] bg-[#2A2A2F] px-4 py-3 text-white placeholder:text-[var(--color-muted)] outline-none ring-1 ring-white/10 focus:ring-[var(--color-primary)]"
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-[var(--radius-soft)] px-4 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/5 disabled:opacity-40"
          disabled={!canGoBack}
        >
          Back
        </button>

        <button type="button" onClick={onNext} className="btn-primary">
          {nextBtnLabel}
        </button>
      </div>
    </div>
  );
}
