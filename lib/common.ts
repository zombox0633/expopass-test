export const validatePassword = (value: string): string | null => {
  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[a-zA-Z]/.test(value)) {
    return "Password must contain at least one letter.";
  }
  if (!/[0-9]/.test(value)) {
    return "Password must contain at least one number.";
  }
  if (!/[^a-zA-Z0-9]/.test(value)) {
    return "Password must contain at least one special character (e.g. !@#$%).";
  }
  return null;
};
