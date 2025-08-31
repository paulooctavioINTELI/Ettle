import type { AnswerValue, Question } from "@/types/forms";

export function getQuestionById(list: Question[], id: number) {
  return list.find((q) => q.id === id) || null;
}

export function getFirstQuestionId(list: Question[]) {
  return list[0]?.id ?? -1;
}

export function getNextQuestionId(q: Question, answer: AnswerValue): number {
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
      const distinctNexts = Array.from(
        new Set(selectedChoices.map((c) => c.nextQuestion))
      );
      if (distinctNexts.length === 1) return distinctNexts[0];
      return selectedChoices[0].nextQuestion ?? (q.nextQuestion ?? -1);
    }
    return q.nextQuestion ?? -1;
  }

  return q.nextQuestion ?? -1;
}
