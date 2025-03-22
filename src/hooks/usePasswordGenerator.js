import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CHAR_SETS, STRENGTH_LABELS, STRENGTH_COLORS } from "../utils/constants";
import commonWords from "../data/commonWords.json";
import { devLog, devWarn, devError } from "../utils/logger";

// Random number generator
const getSecureRandom = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
};

// Random integer between min (inclusive) and max (exclusive)
const getSecureRandomInt = (min, max) => {
  return Math.floor(getSecureRandom() * (max - min) + min);
};

// Generate a random password
function generateRandomPassword({ length = 8, includeUppercase = true, includeLowercase = true, includeNumbers = true, includeSymbols = false }) {
  devLog("generateRandomPassword params:", {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  });

  // Create character pool based on selected options
  let charset = "";
  if (includeUppercase) charset += CHAR_SETS.uppercase;
  if (includeLowercase) charset += CHAR_SETS.lowercase;
  if (includeNumbers) charset += CHAR_SETS.numbers;
  if (includeSymbols) charset += CHAR_SETS.symbols;

  // If no character set was selected, fallback to lowercase
  if (!charset) {
    devWarn("No character types selected, defaulting to lowercase");
    charset = CHAR_SETS.lowercase;
  }

  devLog(`Character set (${charset.length} chars): ${charset}`);
  devLog(`Requested password length: ${length}`);

  let password = "";
  const charsetLength = charset.length;

  // Fallback to random password if no character types are selected
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    password += charset[randomIndex];
  }

  devLog(`Generated random password (${password.length} chars): ${password}`);
  return password;
}

// Generate a memorable password from words
function generateMemorablePassword({ length = 8, includeUppercase = true, includeLowercase = true, includeSymbols = false }) {
  devLog("generateMemorablePassword params:", { length, includeUppercase, includeLowercase, includeSymbols });

  const includeNumbers = true;

  // Use the imported commonWords.json
  if (!commonWords || !commonWords.length) {
    devError("commonWords not available, using fallback word list");
    return generateRandomPassword({ length, includeUppercase, includeLowercase, includeNumbers, includeSymbols });
  }

  const maxWordLength = length - 2;
  const eligibleWords = commonWords.filter((word) => word.length <= maxWordLength);

  if (eligibleWords.length === 0) {
    devWarn("No eligible words found for the requested length, falling back to random password");
    return generateRandomPassword({ length, includeUppercase, includeLowercase, includeNumbers, includeSymbols });
  }

  // Start with a single random word
  let randomWord = eligibleWords[Math.floor(Math.random() * eligibleWords.length)];

  // Apply case formatting based on settings
  if (includeUppercase && includeLowercase) {
    // Capitalize first letter for mixed case
    randomWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1).toLowerCase();
  } else if (includeUppercase) {
    randomWord = randomWord.toUpperCase();
  } else {
    randomWord = randomWord.toLowerCase();
  }

  const paddingLength = Math.max(2, length - randomWord.length);

  let paddingChars = "123456789";

  if (includeSymbols) {
    paddingChars += CHAR_SETS.symbols;
  }

  let padding = "";
  for (let i = 0; i < paddingLength; i++) {
    padding += paddingChars.charAt(Math.floor(Math.random() * paddingChars.length));
  }

  const paddedPassword = randomWord + padding;
  const finalPassword = paddedPassword.substring(0, length);

  devLog(`Generated memorable password (${finalPassword.length} chars): ${finalPassword}`);
  return finalPassword;
}

function generatePin({ length = 4 }) {
  devLog("generatePin params:", { length });

  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10).toString();
  }

  devLog(`Generated PIN (${pin.length} chars): ${pin}`);
  return pin;
}

export const usePasswordGenerator = (settings, loaded) => {
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    devLog("usePasswordGenerator hook settings:", settings);
    devLog("usePasswordGenerator hook loaded:", loaded);
  }, [settings, loaded]);

  const checkStrength = (pwd) => {
    if (!pwd) return 0;

    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);

    let varietyCount = 0;
    if (hasLower) varietyCount++;
    if (hasUpper) varietyCount++;
    if (hasNumbers) varietyCount++;
    if (hasSymbols) varietyCount++;

    // Strength calculation
    if (pwd.length < 8 || varietyCount === 1) return 0; // Weak
    if (pwd.length >= 12 && varietyCount === 4) return 3; // Very Strong: at least 12 chars AND must have all character types
    if (pwd.length >= 10 && varietyCount >= 3) return 2; // Strong: at least 10 chars AND must have at least 3 character types
    return 1; // Medium
  };

  const getStrengthInfo = (strength) => {
    return {
      label: STRENGTH_LABELS[strength],
      color: STRENGTH_COLORS[strength],
    };
  };

  // Generate password based on settings
  const generatePassword = useCallback(() => {
    devLog("Generating password with settings:", settings);

    try {
      setLoading(true);
      const passwordLength = parseInt(settings.passwordLength, 10);

      devLog("Using password length:", passwordLength);

      let generatedPassword = "";

      if (settings.passwordType === "random") {
        generatedPassword = generateRandomPassword({
          ...settings,
          length: passwordLength,
        });
      } else if (settings.passwordType === "memorable") {
        generatedPassword = generateMemorablePassword({
          ...settings,
          length: passwordLength,
        });
      } else if (settings.passwordType === "pin") {
        generatedPassword = generatePin({
          length: passwordLength,
        });
      }

      setPassword(generatedPassword);

      // Calculate strength after generation
      setPasswordStrength(checkStrength(generatedPassword));

      // Reset copied state when generating new password
      setCopied(false);
    } catch (error) {
      devError("Error generating password:", error);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  // Generate password when settings or loaded state changes
  useEffect(() => {
    if (!loaded) return;

    generatePassword();
  }, [settings, loaded, generatePassword]);

  // Copy password to clipboard
  const copyToClipboard = useCallback(() => {
    if (!password) {
      devLog("No password to copy");
      return;
    }

    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        toast("Password copied", {
          description: "Password has been copied to clipboard.",
        });
      })
      .catch((err) => {
        devError("Failed to copy password: ", err);

        toast.error("Failed to copy", {
          description: "Could not copy password to clipboard.",
        });
      });
  }, [password]);

  return {
    password,
    setPassword,
    passwordStrength,
    copied,
    setCopied,
    generatePassword,
    checkStrength,
    getStrengthInfo,
    copyToClipboard,
    loading,
  };
};
