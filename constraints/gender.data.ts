export const GENDERS = [
  { value: 1, label: "Male" },
  { value: 2, label: "Female" },
  { value: 3, label: "Other" },
] as const;

export const GENDER_LABEL: Record<number, string> = Object.fromEntries(
  GENDERS.map((g) => [g.value, g.label]),
);
