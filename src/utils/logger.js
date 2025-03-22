/**
 * Logger utility for development debugging
 * Set VERBOSE_LOGGING to false to reduce console output
 */

// Set this to false to reduce the number of logs
const VERBOSE_LOGGING = false;

/**
 * Log a message to the console in development mode
 */
export const devLog = (message, data) => {
  if (process.env.NODE_ENV !== "production") {
    // Only log if verbose mode is enabled or if the message contains certain keywords
    // that indicate important events
    const isImportant =
      typeof message === "string" && (message.includes("error") || message.includes("Generating password") || message.includes("type change") || message.includes("Generated") || !data); // Log simple messages without data

    if (VERBOSE_LOGGING || isImportant) {
      if (data !== undefined) {
        console.log(message, data);
      } else {
        console.log(message);
      }
    }
  }
};

/**
 * Log an error to the console in development mode
 */
export const devError = (message, error) => {
  if (process.env.NODE_ENV !== "production") {
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }
};

/**
 * Development-only warning logger
 * @param {...any} args - Arguments to log
 */
export const devWarn = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.warn(...args);
  }
};
