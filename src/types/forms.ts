export type QType =
  | "dropdown"
  | "paragraph"
  | "shortAnswer"
  | "checkbox"
  | "multipleChoice"
  | "phoneNumber"
  | "email";

export type ChoiceObj = {
  choice: string;
  nextQuestion: number;
};

export type Question = {
  id: number;
  question: string;
  type: QType;
  choices: ChoiceObj[] | null;
  placeholder: string;
  optional: boolean;
  nextQuestion?: number;
  other?: boolean;
};

export type AnswerValue = string | string[];
export type Answers = Record<number | string, AnswerValue>;

export type PartialSignup = { email?: string; phone_e164?: string };
