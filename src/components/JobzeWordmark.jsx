// Header text lockup: JOBZE.IO (no static SVG mark).
import "./wordmark.css";

export function JobzeWordmark({ className = "", ...props }) {
  return (
    <span className={`jz-wordmark ${className}`.trim()} {...props}>
      JOBZE.IO
    </span>
  );
}
