import { STRENGTH_LABELS, STRENGTH_COLORS } from "../utils/constants";

export default function StrengthMeter({ strength }) {
  const getStrengthInfo = (strengthScore) => {
    return {
      label: STRENGTH_LABELS[strengthScore],
      color: STRENGTH_COLORS[strengthScore],
    };
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-foreground">Password Strength:</span>
        <span className="font-medium text-foreground">{getStrengthInfo(strength).label}</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full">
        <div className={`h-full rounded-full ${getStrengthInfo(strength).color}`} style={{ width: `${(strength + 1) * 25}%` }}></div>
      </div>
    </div>
  );
}
