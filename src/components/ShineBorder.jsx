// Ported from dillionverma/shine-border (the component the doc links for the
// first demo's border). Re-implemented against JOBZE tokens: the animated
// gradient ring is masked to the border only, and color/radius/width/duration
// are props. `color` accepts a single value or an array of stops.
import { cn } from "../lib/utils";
import "./shine-border.css";

export function ShineBorder({
  borderRadius = 12,
  borderWidth = 1,
  duration = 14,
  color = ["#83D6C5", "#F8C762", "#A8A2FF"],
  className,
  children,
  ...rest
}) {
  const stops = Array.isArray(color) ? color.join(",") : color;
  return (
    <div
      style={{ "--sb-radius": `${borderRadius}px` }}
      className={cn("relative w-full", className)}
      {...rest}
    >
      <div
        className="jz-shine-border__layer"
        style={{
          "--sb-width": `${borderWidth}px`,
          "--sb-radius": `${borderRadius}px`,
          "--sb-duration": `${duration}s`,
          "--sb-color": stops,
        }}
      />
      {children}
    </div>
  );
}
