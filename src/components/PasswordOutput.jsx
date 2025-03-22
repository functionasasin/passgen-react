import { Input } from "./ui/input";
import { useEffect } from "react";
import { devLog } from "../utils/logger";

export default function PasswordOutput({ password, onCopy, copied }) {
  useEffect(() => {
    devLog("PasswordOutput component received password:", password);
    devLog("Password length:", password?.length);
  }, [password]);

  return (
    <div className="relative mb-6">
      <Input type="text" value={password || ""} readOnly className="pr-10 border-input bg-background text-foreground" placeholder="Password will appear here" />
      {!password && <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">Waiting for password generation...</div>}
      <button
        onClick={onCopy}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${copied ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="Copy password"
        disabled={!password}
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
    </div>
  );
}
