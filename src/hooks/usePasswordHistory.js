import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { MAX_HISTORY_ITEMS } from "../utils/constants";
import { devError } from "../utils/logger";

export const usePasswordHistory = (passwordType) => {
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("passwordHistory");
      if (savedHistory) {
        setPasswordHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      devError("Error loading password history:", e);
    }
  }, []);

  const savePassword = useCallback(
    (password, strength) => {
      if (!password) return;

      const timestamp = new Date().toISOString();
      const newHistory = [{ password, timestamp, type: passwordType, strength }, ...passwordHistory].slice(0, MAX_HISTORY_ITEMS);

      setPasswordHistory(newHistory);
      localStorage.setItem("passwordHistory", JSON.stringify(newHistory));

      toast("Password saved to history", {
        description: "Your password has been saved to history.",
      });
    },
    [passwordHistory, passwordType]
  );

  const useFromHistory = useCallback((historyPassword, setPassword, setCopied) => {
    setPassword(historyPassword.password);
    if (setCopied) setCopied(false);
  }, []);

  const clearHistory = useCallback(() => {
    setPasswordHistory([]);
    localStorage.removeItem("passwordHistory");
  }, []);

  return {
    passwordHistory,
    isHistoryVisible,
    setIsHistoryVisible,
    savePassword,
    useFromHistory,
    clearHistory,
  };
};
