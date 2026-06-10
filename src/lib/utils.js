// Minimal classNames joiner. Filters falsy values and flattens, so callers can
// pass conditional classes the same way clsx allows, without the dependency.
export function cn(...inputs) {
  const out = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      out.push(input);
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) out.push(inner);
    } else if (typeof input === "object") {
      for (const [key, val] of Object.entries(input)) {
        if (val) out.push(key);
      }
    }
  }
  return out.join(" ");
}
