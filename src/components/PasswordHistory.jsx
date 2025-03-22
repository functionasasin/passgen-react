import { formatDate } from "../utils/formatDate";
import { toast } from "sonner";
import { devError } from "../utils/logger";
import { ScrollArea } from "./ui/scroll-area";
import { STRENGTH_LABELS } from "../utils/constants";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function PasswordHistory({ passwordHistory, showHistory: isHistoryVisible, setShowHistory: setIsHistoryVisible, clearHistory }) {
  const copyToClipboard = (password) => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        toast("Password copied", {
          description: "Password has been copied to clipboard.",
        });
      })
      .catch((err) => {
        devError("Failed to copy password to clipboard", err);
      });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast("History cleared", {
      description: "Password history has been cleared.",
    });
  };

  // Calculate appropriate height based on number of passwords
  const getScrollAreaHeight = () => {
    if (!passwordHistory.length) return "auto";
    const itemCount = Math.min(passwordHistory.length, 2); // Show max 2 items before scrolling
    return `${itemCount * 40}px`;
  };

  // Get strength label for a password
  const getStrengthInfo = (strength) => {
    return {
      label: STRENGTH_LABELS[strength],
    };
  };

  return (
    <div>
      <button onClick={() => setIsHistoryVisible(!isHistoryVisible)} className="flex items-center justify-between w-full text-left mb-2">
        <span className="font-medium">Password History</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isHistoryVisible ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isHistoryVisible && (
        <div className="border border-input rounded-md p-2 mb-4">
          {passwordHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-2">No saved passwords yet</p>
          ) : (
            <>
              <ScrollArea className="w-full" style={{ height: getScrollAreaHeight() }}>
                <ul className="space-y-2 pr-4">
                  {passwordHistory.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <div className="truncate mr-2" style={{ maxWidth: "200px" }}>
                        <div className="flex items-center">
                          <span className="font-medium">{item.password}</span>
                          <button onClick={() => copyToClipboard(item.password)} className="ml-2 text-muted-foreground hover:text-foreground" title="Copy to clipboard">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                        </div>
                        <span className="text-xs text-muted-foreground block">
                          {formatDate(item.timestamp)}
                          {item.strength !== undefined ? ` (${getStrengthInfo(item.strength).label})` : ` (${item.type})`}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>

              <div className="flex justify-end mt-3">
                <Button onClick={handleClearHistory} variant="outline" className={cn("border-input text-foreground hover:bg-accent hover:text-accent-foreground text-xs", "h-auto px-3 py-1")}>
                  Clear History
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
