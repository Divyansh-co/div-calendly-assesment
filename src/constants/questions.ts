export interface QuestionOption {
  value: string;
  label: string;
}

export type QuestionType =
  | "name"
  | "email"
  | "guests"
  | "text"
  | "radio"
  | "select"
  | "checkbox"
  | "phone";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: readonly string[] | readonly QuestionOption[];
}

// TODO(owner): replace with the exact options from the original form.
export const INCOME_OPTIONS: readonly QuestionOption[] = [
  { value: "", label: "Select…" },
  { value: "15l-25l", label: "₹15 Lakhs – ₹25 Lakhs" },
  { value: "25l-50l", label: "₹25 Lakhs – ₹50 Lakhs" },
  { value: "50l-75l", label: "₹50 Lakhs – ₹75 Lakhs" },
  { value: "75l-1cr", label: "₹75 Lakhs – ₹1 Crore" },
  { value: "1cr-plus", label: "₹1 Crore+" },
] as const;

export const HOMETOWN_OPTIONS = [
  "Delhi/NCR",
  "Uttar Pradesh/Haryana",
  "Punjab",
] as const;

export const LAND_SIZE_OPTIONS: readonly QuestionOption[] = [
  { value: "1000 sqm", label: "1000 sqm" },
  { value: "1000-2000 sqm", label: "1000-2000 sqm" },
  { value: "2000 sqm+", label: "2000 sqm+" },
] as const;

export const QUESTIONS: readonly Question[] = [
  {
    id: "name",
    type: "name",
    label: "Name",
    required: true,
  },
  {
    id: "email",
    type: "email",
    label: "Email",
    required: true,
  },
  {
    id: "guests",
    type: "guests",
    label: "Add guests",
    required: false,
  },
  {
    id: "city",
    type: "text",
    label: "Which city are you based in?",
    required: true,
  },
  {
    id: "hometown",
    type: "radio",
    label: "Where is your hometown?",
    required: true,
    options: HOMETOWN_OPTIONS,
  },
  {
    id: "income",
    type: "select",
    label: "How much income do you make?",
    required: true,
    options: INCOME_OPTIONS,
  },
  {
    id: "landSize",
    type: "checkbox",
    label: "How much land you want to buy",
    required: false,
    options: LAND_SIZE_OPTIONS,
  },
  {
    id: "whatsapp",
    type: "phone",
    label: "What is your whatsapp number?",
    required: true,
  },
] as const;
