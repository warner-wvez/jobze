import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Check, Filter } from "lucide-react";
import { useMemo, useState } from "react";

export const SCENARIO_SIDEBAR_WIDTH = 220;

export const SCENARIOS = [
  {
    id: 1,
    initials: "MK",
    summary: "CO '26, Finance, 3.6 GPA",
    role: "Goldman Sachs IB Analyst",
  },
  {
    id: 2,
    initials: "AR",
    summary: "CO '25, CS, 3.8 GPA",
    role: "Google SWE, New Grad",
  },
  {
    id: 3,
    initials: "LP",
    summary: "CO '26, Nursing, 3.4 GPA",
    role: "Healthcare Ops Associate",
  },
];

function SituationCard({ id, initials, summary, role, active, onSelect }) {
  const controls = useAnimation();

  const handleClick = () => {
    onSelect(id);
    controls.start({
      rotate: [0, 1080],
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`flex w-full cursor-pointer items-start gap-2 rounded-sm border p-2 transition-colors duration-base ${
        active
          ? "border-jz-border bg-jz-surface"
          : "border-transparent bg-transparent hover:bg-jz-surface/40"
      }`}
    >
      <motion.div
        animate={controls}
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-jz-surface text-[10px] font-semibold leading-none text-jz-fg-dim ring-1 ring-jz-border"
      >
        {initials}
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight text-jz-fg">
          {summary}
        </p>
        <p className="mt-px truncate text-xs text-jz-muted">{role}</p>
      </div>
      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full border border-jz-border" />
    </div>
  );
}

function ScenariosFilterPanel({ filters, onChange, scenarios }) {
  const roles = useMemo(
    () => Array.from(new Set(scenarios.map((s) => s.role))),
    [scenarios],
  );

  const toggleRole = (role) => {
    const current = filters.role;
    const updated = current.includes(role)
      ? current.filter((entry) => entry !== role)
      : [...current, role];
    onChange({ role: updated });
  };

  const clearAll = () => onChange({ role: [] });
  const hasActiveFilters = filters.role.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.05 }}
      className="flex flex-col gap-4 border-b border-jz-border pb-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-jz-fg">Filters</h3>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-jz-fg-dim transition-colors hover:text-jz-fg"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-jz-muted">
          Role
        </p>
        <div className="flex flex-col gap-1.5">
          {roles.map((role) => {
            const selected = filters.role.includes(role);
            return (
              <motion.button
                key={role}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => toggleRole(role)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 rounded-sm border px-2 py-1.5 text-left text-xs transition-colors ${
                  selected
                    ? "border-jz-strong/40 bg-jz-strong/10 text-jz-fg"
                    : "border-jz-border text-jz-fg-dim hover:border-jz-border hover:bg-jz-surface/40"
                }`}
              >
                <span className="truncate">{role}</span>
                {selected ? <Check className="h-3 w-3 shrink-0 text-jz-strong" /> : null}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function SidebarPanel({
  activeId,
  onSelect,
  filters,
  onFiltersChange,
  scenarios,
}) {
  return (
    <div
      className="flex h-full flex-col overflow-y-auto p-3"
      style={{ width: SCENARIO_SIDEBAR_WIDTH }}
    >
      <ScenariosFilterPanel
        filters={filters}
        onChange={onFiltersChange}
        scenarios={SCENARIOS}
      />

      <p className="mb-2 mt-3 font-mono text-xs uppercase tracking-[0.14em] text-jz-muted">
        Scenarios
      </p>
      <div className="flex flex-col gap-2">
        {scenarios.map((s) => (
          <SituationCard
            key={s.id}
            {...s}
            active={s.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function ScenariosFilterToggle({
  showSidebar,
  onToggleSidebar,
  activeFilterCount,
}) {
  return (
    <button
      type="button"
      onClick={onToggleSidebar}
      aria-label={showSidebar ? "Hide scenarios panel" : "Show scenarios panel"}
      aria-pressed={showSidebar}
      className={`absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-sm border transition duration-base ease-out ${
        showSidebar
          ? "border-jz-fg/30 bg-jz-surface text-jz-fg"
          : "border-jz-border text-jz-fg-dim hover:bg-jz-surface/60 hover:text-jz-fg"
      }`}
    >
      <Filter className="h-3.5 w-3.5" />
      {activeFilterCount > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-jz-weak text-[9px] font-semibold leading-none text-jz-fg">
          {activeFilterCount}
        </span>
      ) : null}
    </button>
  );
}

export function DemoScenariosSidebar({
  activeId,
  onSelect,
  showSidebar,
  filters,
  onFiltersChange,
}) {
  const filteredScenarios = useMemo(() => {
    if (filters.role.length === 0) return SCENARIOS;
    return SCENARIOS.filter((s) => filters.role.includes(s.role));
  }, [filters]);

  return (
    <AnimatePresence initial={false}>
      {showSidebar ? (
        <motion.div
          key="scenarios-rail"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: SCENARIO_SIDEBAR_WIDTH, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 self-stretch overflow-hidden border-r border-jz-border"
        >
          <SidebarPanel
            activeId={activeId}
            onSelect={onSelect}
            filters={filters}
            onFiltersChange={onFiltersChange}
            scenarios={filteredScenarios}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function useScenariosSidebar() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [filters, setFilters] = useState({ role: [] });

  return {
    showSidebar,
    setShowSidebar,
    toggleSidebar: () => setShowSidebar((current) => !current),
    filters,
    setFilters,
  };
}
