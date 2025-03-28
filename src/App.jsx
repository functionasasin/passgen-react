import { useEffect } from "react";
import { Toaster } from "sonner";
import { usePasswordSettings } from "./hooks/usePasswordSettings";
import { usePasswordGenerator } from "./hooks/usePasswordGenerator";
import { usePasswordHistory } from "./hooks/usePasswordHistory";
import { Card, CardContent } from "./components/ui/card";
import PasswordOutput from "./components/PasswordOutput";
import StrengthMeter from "./components/StrengthMeter";
import SettingsForm from "./components/SettingsForm";
import PasswordHistory from "./components/PasswordHistory";
import { devLog } from "./utils/logger";

function App() {
  const { settings, updateSetting, resetSettings, handlePasswordTypeChange, getMinLength, loaded } = usePasswordSettings();
  const { password, passwordStrength, copied, getStrengthInfo, copyToClipboard, loading } = usePasswordGenerator(settings, loaded);
  const { passwordHistory, isHistoryVisible, setIsHistoryVisible, savePassword, clearHistory } = usePasswordHistory(settings.passwordType);

  // Connect the usePasswordHistory savePassword method to the current password
  const handleSavePassword = () => {
    savePassword(password, passwordStrength);
  };

  // Change password type and trigger regenerate
  const changePasswordType = (type) => {
    devLog("Password type change with regeneration:", {
      from: settings.passwordType,
      to: type,
    });

    handlePasswordTypeChange(type);
  };

  // Debug when settings change and regenerate password when type changes
  useEffect(() => {
    // Only log when password type changes
    if (loaded && settings.passwordType) {
      devLog("Settings updated with type:", settings.passwordType);
    }
  }, [settings, loaded]);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Toaster position="bottom-right" richColors={false} />

      <Card className="w-full max-w-md mx-auto border-border">
        <CardContent className="pt-6">
          <header>
            <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Password Generator</h1>
          </header>

          <section aria-label="Password Output">
            <PasswordOutput password={password} onCopy={copyToClipboard} copied={copied} passwordStrength={passwordStrength} getStrengthInfo={getStrengthInfo} loading={loading} />
            <StrengthMeter strength={passwordStrength} />
          </section>

          <section aria-label="Password Settings">
            <SettingsForm
              settings={settings}
              updateSetting={updateSetting}
              handlePasswordTypeChange={changePasswordType}
              savePassword={handleSavePassword}
              resetSettings={resetSettings}
              minLength={getMinLength()}
              maxLength={24}
            />
          </section>

          <section aria-label="Password History">
            <PasswordHistory passwordHistory={passwordHistory} showHistory={isHistoryVisible} setShowHistory={setIsHistoryVisible} clearHistory={clearHistory} />
          </section>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
