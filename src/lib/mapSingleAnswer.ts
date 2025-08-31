import type { Answers, Question, AnswerValue } from "@/types/forms";
import { isValidPhoneNumber } from "libphonenumber-js";

/**
 * Retorna apenas as colunas afetadas pela pergunta atual.
 * - Sempre retorna { answers } para manter rascunho no banco.
 * - Só popula colunas específicas quando o valor está válido (quando aplicável).
 */
export function mapSingleAnswerToColumns(
  q: Question,
  all: Answers
): Record<string, unknown> {
  const val = all[q.id];
  const get = (id: number) => all[id];
  const getOther = (id: number) => all[`${id}_other`];

  const asStr = (v: AnswerValue) =>
    Array.isArray(v) ? "" : (String(v ?? "").trim());

  const asArr = (v: AnswerValue) =>
    Array.isArray(v) ? (v as string[]) : null;

  const yesNoBool = (id: number): boolean | null => {
    const v = String(get(id) ?? "").toLowerCase();
    if (v === "yes") return true;
    if (v === "no") return false;
    return null;
  };

  // Começa sempre com answers para manter o rascunho no servidor.
  const patch: Record<string, unknown> = {
    answers: all,
  };

  // Mapeamentos por ID conforme seu formulário atual.
  switch (q.id) {
    case 2: // full_name
      patch.full_name = asStr(val) || null;
      break;
    case 3: // age_group
      patch.age_group = asStr(val) || null;
      break;
    case 4: // gender (+ other)
      patch.gender =
        asStr(val) === "Other"
          ? (String(getOther(4) ?? "").trim() ? `Other: ${getOther(4)}` : "Other")
          : asStr(val) || null;
      break;
    case 7: // nationality (+ other)
      patch.nationality =
        asStr(val) === "Other"
          ? (String(getOther(7) ?? "").trim() ? `Other: ${getOther(7)}` : "Other")
          : asStr(val) || null;
      break;
    case 8: // employment_status (+ other)
      patch.employment_status =
        asStr(val) === "Other"
          ? (String(getOther(8) ?? "").trim() ? `Other: ${getOther(8)}` : "Other")
          : asStr(val) || null;
      break;
    case 10:
      patch.activity_level = asStr(val) || null;
      break;
    case 11: // primary_goal (+ other)
      patch.primary_goal =
        asStr(val) === "Other"
          ? (String(getOther(11) ?? "").trim() ? `Other: ${getOther(11)}` : "Other")
          : asStr(val) || null;
      break;
    case 12:
      patch.training_environment = asStr(val) || null;
      break;
    case 13:
      patch.weight_training_experience = asStr(val) || null;
      break;
    case 14: // greatest_challenge (+ other)
      patch.greatest_challenge =
        asStr(val) === "Other"
          ? (String(getOther(14) ?? "").trim() ? `Other: ${getOther(14)}` : "Other")
          : asStr(val) || null;
      break;
    case 15:
      patch.details_general = asStr(val) || null;
      break;
    case 16: // sports_participation yes/no
      patch.sports_participation = yesNoBool(16);
      break;
    case 17:
      patch.sports_list = asStr(val) || null;
      break;
    case 18: // sports_context (+ other)
      patch.sports_context =
        asStr(val) === "Other"
          ? (String(getOther(18) ?? "").trim() ? `Other: ${getOther(18)}` : "Other")
          : asStr(val) || null;
      break;
    case 19:
      patch.trainer_experience = asStr(val) || null;
      break;
    case 20:
      patch.trainer_benefits = asArr(val);
      break;
    case 21:
      patch.trainer_benefits_details = asStr(val) || null;
      break;
    case 22:
      patch.trainer_challenges = asArr(val);
      break;
    case 23:
      patch.trainer_challenges_details = asStr(val) || null;
      break;
    case 24:
      patch.trainer_stop_reasons = asArr(val);
      break;
    case 25:
      patch.trainer_stop_details = asStr(val) || null;
      break;
    case 41:
      patch.trainer_past_benefits = asArr(val);
      break;
    case 42:
      patch.trainer_past_benefits_details = asStr(val) || null;
      break;
    case 26:
      patch.future_trainer_intent = asStr(val) || null;
      break;
    case 27:
      patch.future_trainer_details = asStr(val) || null;
      break;
    case 28: // apps_used yes/no
      patch.apps_used = yesNoBool(28);
      break;
    case 29:
      patch.apps_list = asStr(val) || null;
      break;
    case 30:
      patch.apps_improvements = asArr(val);
      break;
    case 31:
      patch.apps_improvements_details = asStr(val) || null;
      break;
    case 33:
      patch.subscription_intent = asStr(val) || null;
      break;
    case 34:
      patch.features_important = asArr(val);
      break;
    case 35:
      patch.features_details = asStr(val) || null;
      break;
    case 32:
      patch.price_expectation = asStr(val) || null;
      break;
    case 36:
      patch.injuries = asStr(val) || null;
      break;
    case 37:
      patch.medication = asStr(val) || null;
      break;
    case 38:
      patch.limitations = asStr(val) || null;
      break;
    case 39:
      patch.early_access_choice = asStr(val) || null;
      break;
    case 40: {
      const arr = asArr(val);
      patch.marketing_opt_in = Array.isArray(arr) ? arr.length > 0 : null;
      break;
    }
    default:
      break;
  }

  // Campos por TIPO (email / phone) — validamos antes de popular as colunas finais
  if (q.type === "email") {
    const email = asStr(val);
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    patch.email = ok ? email : null; // se inválido, mantém rascunho só em answers
  }
  if (q.type === "phoneNumber") {
    const phone = asStr(val);
    patch.phone_e164 = isValidPhoneNumber(phone) ? phone : null;
  }

  return patch;
}
