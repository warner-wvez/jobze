import { JobzeWordmark } from "./JobzeWordmark";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-jz-border bg-jz-bg/90 backdrop-blur-[12px]">
      <div className="jz-page-shell">
        <div className="jz-header-bar">
          <a
            href="#"
            className="inline-flex items-center text-jz-fg no-underline"
            aria-label="Jobze home"
          >
            <JobzeWordmark />
          </a>

          <nav className="jz-header-bar__nav">
            <a
              href="#"
              className="inline-flex items-center text-md font-medium leading-none text-jz-fg-dim no-underline transition-colors duration-base ease-out hover:text-jz-fg"
            >
              Blog
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-pill border border-jz-border bg-jz-surface px-5 py-2.5 text-md font-semibold leading-none text-jz-fg no-underline shadow-card transition duration-base ease-out hover:-translate-y-px"
            >
              Sign up
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
