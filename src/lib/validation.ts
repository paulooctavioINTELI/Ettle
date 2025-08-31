import { isValidPhoneNumber } from "libphonenumber-js";
import type { Answers, AnswerValue, Question } from "@/types/forms";

export function isE164(e164: string) {
  return /^\+\d{8,15}$/.test(e164);
}

export function isAnswerProvided(q: Question, val: AnswerValue, all?: Answers) {
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

    case "phoneNumber":
      return typeof val === "string" && isValidPhoneNumber(val);

    case "email":
      return (
        typeof val === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
      );

    default:
      return false;
  }
}
