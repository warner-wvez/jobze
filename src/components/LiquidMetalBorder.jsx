// Animated border shell — same liquid-metal shader as LiquidMetalButton.
import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { useEffect, useRef } from "react";
import { cn } from "../lib/utils";

const SHADER_STYLE_ID = "shader-canvas-style-liquid-metal-border";

export function LiquidMetalBorder({
  children,
  borderRadius = 8,
  className,
  innerClassName,
}) {
  const shaderRef = useRef(null);
  const shaderMount = useRef(null);
  const radius = `${borderRadius}px`;
  const innerRadius = `${Math.max(borderRadius - 2, 0)}px`;

  useEffect(() => {
    if (!document.getElementById(SHADER_STYLE_ID)) {
      const style = document.createElement("style");
      style.id = SHADER_STYLE_ID;
      style.textContent = `
        .shader-container-liquid-metal-border canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }

    if (shaderRef.current) {
      if (shaderMount.current?.destroy) shaderMount.current.destroy();
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: 0,
        },
        undefined,
        0.6,
      );
    }

    return () => {
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, []);

  return (
    <div className={cn("relative h-full min-h-0 w-full overflow-visible", className)}>
      <div
        className="relative h-full w-full overflow-visible"
        style={{
          borderRadius: radius,
          boxShadow:
            "0px 0px 0px 1px rgba(0,0,0,0.3), 0px 36px 14px 0px rgba(0,0,0,0.02), 0px 20px 12px 0px rgba(0,0,0,0.08), 0px 9px 9px 0px rgba(0,0,0,0.12), 0px 2px 5px 0px rgba(0,0,0,0.15)",
        }}
      >
        <div
          ref={shaderRef}
          className="shader-container-liquid-metal-border pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{ borderRadius: radius }}
          aria-hidden="true"
        />
        {/* inset (not margin + 100% height) so inner never covers the bottom shader ring */}
        <div
          className={cn(
            "absolute inset-[2px] z-20 flex min-h-0 flex-col overflow-hidden",
            innerClassName,
          )}
          style={{
            borderRadius: innerRadius,
            background: "var(--jz-bg)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
