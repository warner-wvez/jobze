import { useState } from "react";
import { LiquidMetalBorder } from "./LiquidMetalBorder";
import {
  DemoScenariosSidebar,
  ScenariosFilterToggle,
  useScenariosSidebar,
} from "./DemoScenariosSidebar";

const G_SIZE = 152;
const G_STROKE = 10;

function WindowChrome() {
  return (
    <div className="relative z-10 grid h-9 grid-cols-3 items-center border-b border-jz-border bg-jz-surface/70 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <span className="h-[10px] w-[10px] rounded-full bg-[#FF5F57]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#FEBC2E]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#28C840]" />
      </div>

      <div className="flex justify-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-jz-muted">
          Jobze
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Refresh"
          className="flex h-5 w-5 items-center justify-center rounded-sm text-jz-fg-dim transition-colors duration-base ease-out hover:bg-jz-border hover:text-jz-fg"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
            <path
              d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 3v5h5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="flex items-center gap-1 text-jz-muted">
          <span className="h-1 w-1 rounded-full bg-current" />
          <span className="h-1 w-1 rounded-full bg-current" />
          <span className="h-1 w-1 rounded-full bg-current" />
        </span>
      </div>
    </div>
  );
}

function ProcessButton() {
  return (
    <div className="relative inline-flex">
      <div
        className="jz-shine-border__layer"
        style={{
          "--sb-width": "1px",
          "--sb-radius": "999px",
          "--sb-duration": "10s",
          "--sb-color": "#83D6C5,#F8C762,#A8A2FF",
        }}
      />
      <button
        type="button"
        className="relative inline-flex items-center rounded-pill bg-jz-surface px-7 py-3 text-md font-semibold text-jz-fg shadow-card transition duration-base ease-out hover:-translate-y-px"
      >
        Process
      </button>
    </div>
  );
}

function GaugeRing({ compact = false }) {
  const size = compact ? 120 : G_SIZE;
  const stroke = compact ? 8 : G_STROKE;
  const r = (size - stroke) / 2;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.13)"
          strokeWidth={stroke}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-bold leading-none tracking-[-0.04em] text-jz-muted ${
            compact ? "text-[48px]" : "text-[60px]"
          }`}
        >
          0
        </span>
      </div>
    </div>
  );
}

export function DemoFrame({ layout = "default" }) {
  const [activeId, setActiveId] = useState(1);
  const isHero = layout === "hero";
  const frameRadius = isHero ? 8 : 10;
  const {
    showSidebar,
    toggleSidebar,
    filters,
    setFilters,
  } = useScenariosSidebar();

  return (
    <LiquidMetalBorder
      borderRadius={frameRadius}
      className="h-full min-h-0"
      innerClassName="flex min-h-0 flex-col"
    >
      <WindowChrome />

      <div className="relative flex min-h-0 flex-1 flex-row overflow-hidden">
        <DemoScenariosSidebar
          activeId={activeId}
          onSelect={setActiveId}
          showSidebar={showSidebar}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="relative flex min-h-0 flex-[1.1] items-center justify-center border-b border-jz-border">
            <ScenariosFilterToggle
              showSidebar={showSidebar}
              onToggleSidebar={toggleSidebar}
              activeFilterCount={filters.role.length}
            />
            <GaugeRing />
          </div>

          <div className="flex min-h-0 flex-1 divide-x divide-jz-border">
            <div className="flex min-h-0 flex-1 flex-col p-2.5 lg:p-3">
              <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.14em] text-jz-muted lg:mb-2">
                Job Description
              </p>
              <div className="min-h-0 flex-1 rounded-sm border border-jz-border" />
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-2.5 lg:p-3">
              <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.14em] text-jz-muted lg:mb-2">
                Resume
              </p>
              <div className="min-h-0 flex-1 rounded-sm border border-jz-border" />
            </div>
          </div>

          {isHero ? (
            <div className="relative flex shrink-0 items-center justify-center px-4 py-2.5">
              <ProcessButton />
            </div>
          ) : null}
        </div>
      </div>

      {!isHero ? (
        <div className="flex justify-center px-4 py-4">
          <ProcessButton />
        </div>
      ) : null}
    </LiquidMetalBorder>
  );
}
