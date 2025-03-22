import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { devLog } from "../utils/logger";
import { useEffect } from "react";

export default function SettingsForm({ settings, updateSetting, handlePasswordTypeChange, savePassword, resetSettings, minLength, maxLength }) {
  const { passwordLength, includeUppercase, includeLowercase, includeSymbols, includeNumbers, passwordType } = settings;

  // Determine checkbox states based on password type
  const isPin = passwordType === "pin";
  const isMemorable = passwordType === "memorable";

  // Only log when password type changes
  useEffect(() => {
    devLog(`Password type changed to: ${passwordType}`, {
      passwordType,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    });
  }, [passwordType, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const checkboxConfig = [
    { id: "lowercase", label: "Lowercase", checked: includeLowercase, onChange: (value) => updateSetting("includeLowercase", value), disabled: isPin },
    { id: "uppercase", label: "Uppercase", checked: includeUppercase, onChange: (value) => updateSetting("includeUppercase", value), disabled: isPin },
    { id: "symbols", label: "Symbols", checked: includeSymbols, onChange: (value) => updateSetting("includeSymbols", value), disabled: isPin },
    { id: "numbers", label: "Numbers", checked: includeNumbers, onChange: (value) => updateSetting("includeNumbers", value), disabled: isPin || isMemorable, required: isMemorable },
  ];

  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="password-length">Character Length</Label>
          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md">{passwordLength}</span>
        </div>
        <Slider id="password-length" value={[passwordLength]} min={minLength} max={maxLength} step={1} onValueChange={(value) => updateSetting("passwordLength", value[0])} className="text-primary" />
      </div>

      <div className="flex items-start mb-6">
        <div className="flex-1 pr-4">
          <Label className="mb-2 block">Password Type</Label>
          <Select value={passwordType} onValueChange={handlePasswordTypeChange}>
            <SelectTrigger className="border-input">
              <SelectValue placeholder="Select password type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">Random Password</SelectItem>
              <SelectItem value="memorable">Memorable Password</SelectItem>
              <SelectItem value="pin">Numbers only/PIN</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {checkboxConfig.map(({ id, label, checked, onChange, disabled, required }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
              <Label htmlFor={id} className={`${disabled ? "text-muted-foreground" : ""} ${required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}`}>
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <Button onClick={savePassword} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Save Password
        </Button>
        <Button onClick={resetSettings} variant="outline" className="w-full border-input text-foreground hover:bg-accent hover:text-accent-foreground">
          Reset Settings
        </Button>
      </div>
    </>
  );
}
