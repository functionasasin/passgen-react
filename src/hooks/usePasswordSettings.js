import { useState, useEffect, useCallback } from "react";
import { DEFAULT_SETTINGS } from "../utils/constants";
import { toast } from "sonner";
import { devLog, devError } from "../utils/logger";

export const usePasswordSettings = () => {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("passwordSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed }); // fallback to defaults
        devLog("Loaded settings from localStorage");
      }
    } catch (e) {
      devError("Failed to load settings from localStorage", e);
    }

    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem("passwordSettings", JSON.stringify(settings));
    } catch (e) {
      devError("Error saving settings:", e);
    }
  }, [settings, loaded]);

  // Handler: Update individual setting
  const updateSetting = useCallback(
    (key, value) => {
      devLog(`Updating setting ${key} to:`, value);

      // Force include numbers for memorable passwords
      if (key === "includeNumbers" && value === false && settings.passwordType === "memorable") {
        // Don't update if trying to disable numbers for memorable passwords
        return;
      }

      // When changing password type to memorable, ensure numbers are enabled
      if (key === "passwordType" && value === "memorable" && !settings.includeNumbers) {
        setSettings((prev) => ({
          ...prev,
          [key]: value,
          includeNumbers: true,
        }));
        return;
      }

      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [settings.passwordType, settings.includeNumbers]
  );

  const resetSettings = useCallback(() => {
    devLog("Resetting settings to defaults");
    setSettings({ ...DEFAULT_SETTINGS });
    localStorage.removeItem("passwordSettings");

    toast("Settings reset", {
      description: "Password generator settings have been reset to defaults.",
    });
  }, []);

  // Handler: Get min length
  const getMinLength = useCallback(() => {
    return settings.passwordType === "pin" ? 4 : 8;
  }, [settings.passwordType]);

  // Handler: Password type change
  const handlePasswordTypeChange = useCallback(
    (type) => {
      devLog("Changing password type to:", type);

      // Create a new settings object with the appropriate values based on the new type
      const newSettings = { ...settings, passwordType: type };

      // PIN type: Only numbers are allowed
      if (type === "pin") {
        newSettings.includeUppercase = false;
        newSettings.includeLowercase = false;
        newSettings.includeSymbols = false;
        newSettings.includeNumbers = true;

        // Ensure minimum length
        if (newSettings.passwordLength < 4) {
          newSettings.passwordLength = 4;
        }
      }
      // Memorable type: Numbers required, restore case settings if coming from PIN
      else if (type === "memorable") {
        newSettings.includeNumbers = true;

        // If coming from PIN, restore uppercase and lowercase
        if (settings.passwordType === "pin") {
          newSettings.includeUppercase = true;
          newSettings.includeLowercase = true;
        }

        if (newSettings.passwordLength < 8) {
          newSettings.passwordLength = 8;
        }
      }
      // Random type: Restore defaults if coming from PIN
      else if (type === "random") {
        if (settings.passwordType === "pin") {
          newSettings.includeUppercase = true;
          newSettings.includeLowercase = true;

          // Ensure minimum length
          if (newSettings.passwordLength < 8) {
            newSettings.passwordLength = 8;
          }
        }
      }

      // Apply the entire settings update at once to avoid race conditions
      setSettings(newSettings);
    },
    [settings]
  );

  return {
    settings,
    updateSetting,
    resetSettings,
    handlePasswordTypeChange,
    getMinLength,
    loaded,
  };
};
