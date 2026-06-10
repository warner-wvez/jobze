// JOBZE landing page — split hero (copy left, demo right) + scroll section below.
// The gradient backdrop spans the whole page (body::before in index.css).
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ContainerScroll } from "./components/ContainerScroll";
import { DemoFrame } from "./components/DemoFrame";
import JobzeScorer from "../jobze-scorer-demo.jsx";

// Matches --hl-trace-duration in tokens.css (4.5s). Text enters when logo fade begins.
const TRACE_MS = 4500;

// Lead-in shown above the rotating demo card. Kept to a factual section label;
// real marketing copy and the live demo arrive next pass.
function ScrollTitle() {
  return (
    <div className="pb-4">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-jz-muted">
        The scorer
      </p>
      <h2 className="mx-auto mt-3 max-w-2xl bg-gradient-to-b from-jz-fg to-[#9EA0A8] bg-clip-text text-display-sm font-semibold tracking-[-0.03em] text-transparent md:text-display-md">
        Paste a job. Paste a resume. See the verdict.
      </h2>
    </div>
  );
}

export default function App() {
  const [showText, setShowText] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShowText(true), TRACE_MS + 100);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-jz-fg">
      <Header />
      <main>
        <div className="jz-page-shell">
          <div className="jz-hero-split">
            <Hero
              showText={showText}
              onTextDone={() => setShowDemo(true)}
            />
            <motion.aside
              className="jz-hero-panel-right"
              initial={{ opacity: 0, y: 16 }}
              animate={
                showDemo ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
              }
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: showDemo ? 0.15 : 0,
              }}
            >
              <div className="jz-hero-panel-right__demo">
                <DemoFrame layout="hero" />
              </div>
            </motion.aside>
          </div>
        </div>

        <ContainerScroll titleComponent={<ScrollTitle />}>
          {/* The scorer demo, wired to captured engine output (live path for pasted input). */}
          <div className="h-full w-full overflow-y-auto">
            <JobzeScorer />
          </div>
        </ContainerScroll>
      </main>
    </div>
  );
}
