import type { Answers, Question } from "@/types/forms";
import { getRunId } from "./runId";

export function mapAnswersToColumns(all: Answers, questions: Question[]) {
  const get = (id: number) => all[id];
  const getOther = (id: number) => all[`${id}_other`];

  const yesNoBool = (id: number): boolean | null => {
    const v = String(get(id) ?? "").toLowerCase();
    if (v === "yes") return true;
    if (v === "no") return false;
    return null;
  };

  const emailQ = questions.find((x) => x.type === "email");
  const phoneQ = questions.find((x) => x.type === "phoneNumber");

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
