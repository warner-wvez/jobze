import { motion } from "framer-motion";
import { JLogoTrace } from "./JLogoTrace";
import { LiquidMetalButton } from "./LiquidMetalButton";

const HEADLINE = "Know if a job is worth applying to";
const SUBTEXT =
  "Paste any JD + your resume. Get a match score with a verdict, built on real entry-level data and students who landed interviews. No signup, no catch.";

export function Hero({ showText = false, onTextDone }) {
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center"
        style={{
          top: "var(--jz-header-height)",
          background: "transparent",
          pointerEvents: "none",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: showText ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <JLogoTrace />
      </motion.div>

      <section className="jz-hero-panel-left">
        <div className="jz-hero-copy">
          <motion.div
            className="jz-hero-copy__stack"
            initial={{ opacity: 0, y: 12 }}
            animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => {
              if (showText && onTextDone) onTextDone();
            }}
          >
            <h1 className="max-w-[520px] text-display-md font-bold tracking-[-0.045em] text-jz-fg md:text-display-lg">
              {HEADLINE}
            </h1>
            <p className="max-w-[480px] text-md leading-md text-jz-fg-dim md:text-lg md:leading-lg">
              {SUBTEXT}
            </p>
            <LiquidMetalButton label="Talk to Jobze" />
          </motion.div>
        </div>

        <div className="absolute bottom-7 left-0 font-mono text-xs uppercase tracking-[0.18em] text-jz-muted" />
      </section>
    </>
  );
}
