// Default password settings
export const DEFAULT_SETTINGS = {
  passwordLength: 8,
  includeUppercase: true,
  includeLowercase: true,
  includeSymbols: false,
  includeNumbers: false,
  passwordType: "random",
};

// Password strength labels and colors
export const STRENGTH_LABELS = ["Weak", "Medium", "Strong", "Very Strong"];
export const STRENGTH_COLORS = ["bg-destructive", "bg-chart-4", "bg-green-500", "bg-green-700"];

// Character sets for password generation
export const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  numbers: "0123456789",
};

// Maximum password history items
export const MAX_HISTORY_ITEMS = 5;
