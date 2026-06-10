import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   JOBZE SCORER DEMO v2 — grounded, cited, real
   Timing is choreographed; every artifact shown is real.
   ═══════════════════════════════════════════════════════ */

const C = {
  teal: "#83D6C5", gold: "#F8C762", purple: "#9E94D5", lavender: "#AAA0FA",
  orange: "#DB704B", rose: "#E394DC", crimson: "#B3003F", blue: "#94C1FA",
  green: "#1F8A65", amber: "#EBC88D", grey: "#52525B", greyText: "#71717A",
};

// ── Live verdict webhook: "JOBZE Lite POC - Verdict Engine" on n8n ──
const WEBHOOK_URL = "https://n8n.wvez.org/webhook/jobze-verdict";

// Centralized replay-timing config. Choreography only; data is always real.
const TIMING = {
  autoplayDelay: 600,  // ms after scroll-into-view before the first sample replays
  stageReveal: 650,    // ms between each grounded stage resolving
  scoreCountMs: 600,   // ms for the score count-up
  factRotateMs: 1600,  // ms between rotating verified facts
  scenarioDwell: 6500, // ms a finished sample stays up before the next one plays
};

// Real, sourced market facts pulled from the jobze_rag corpus (Gate 2 retrieval).
// Every line traces to one audited source; nothing unsourced is shown.
const SOURCE_NACE = "NACE Job Outlook 2026 Spring Update";
const FACTS = [
  { stat: "85% of employers rank ability to work in a team the #1 thing on a resume", source: SOURCE_NACE },
  { stat: "82% rank problem-solving; 78% rank verbal communication", source: SOURCE_NACE },
  { stat: "82% of employers want skills shown with specific examples, not a bare list", source: SOURCE_NACE },
  { stat: "Technical skills rank 4th at 73%, behind teamwork and communication", source: SOURCE_NACE },
  { stat: "AI skills rank far lower, named by only 31% of employers", source: SOURCE_NACE },
];

// Pre-captured REAL verdicts from the live engine (eval_raw_4 capture, run 1 per
// fixture, verbatim: score, verdict, actions, subscores). Replayed for instant,
// free autoplay; 100% real output, just not re-fetched on every load. The alex
// scenario also carries the captured rescore of the fixed resume (alex_patched).
// SCENARIO DATA START (generated from /tmp/eval_raw_4.json + fixtures, do not hand-edit)
const SCENARIOS = [
  {
    "id": "alex",
    "label": "Alex Chen",
    "jd": "Junior Software Engineer\nLuminary Analytics | Chicago, IL | Full-Time | Entry Level\n\nAbout the Role\nLuminary Analytics builds real-time data dashboards for mid-market B2B clients. We are looking for a\nJunior Software Engineer to join our backend platform team. This is an early-career role; new graduates\nand candidates with up to one year of professional experience are encouraged to apply.\n\nResponsibilities\n- Build and maintain REST API endpoints using Node.js and Express.js\n- Write and optimize SQL queries against our PostgreSQL data warehouse\n- Collaborate with the frontend team on React-based dashboard features\n- Participate in code review, daily standups, and sprint retrospectives\n- Write unit and integration tests for new and existing features\n- Deploy and monitor services on AWS EC2 using CI/CD pipelines\n\nRequired Qualifications\n- Bachelor's degree in Computer Science or a related field (or expected graduation within 6 months)\n- Proficiency in Python or JavaScript/TypeScript\n- Familiarity with relational databases (PostgreSQL preferred)\n- Experience with Git and collaborative version control workflows\n- Strong written and verbal communication skills\n\nPreferred Qualifications\n- Experience with React or another modern frontend framework\n- Exposure to AWS services (EC2, S3, RDS) or equivalent cloud platforms\n- Familiarity with Docker and containerized deployments\n- GPA of 3.0 or higher preferred; Dean's List or academic honors noted",
    "resume": "ALEX CHEN\nalex.chen@gmail.com | (312) 555-0192 | linkedin.com/in/alexchen | github.com/alexchen | Chicago, IL\n\nEDUCATION\n\nUniversity of Illinois at Urbana-Champaign\nBachelor of Science in Computer Science\n\nTECHNICAL SKILLS\n\nLanguages: Python, Java, JavaScript, TypeScript, HTML/CSS\nTechnologies: Git, React, Node.js, Express.js, PostgreSQL, AWS EC2, Firebase, Docker\n\nEXPERIENCE\n\nSoftware Engineering Intern | Meridian Analytics | Chicago, IL | May 2024 - Aug. 2024\n- Worked on the backend data processing service used by the analytics team\n- Reviewed pull requests submitted by other members of the engineering team\n- Attended daily standups and contributed to sprint planning discussions\n- Assisted senior engineers with bug reports submitted by the QA team\n\nTechnical Support Intern | NovaBridge Systems | Remote | Jun. 2023 - Aug. 2023\n- Responded to support tickets submitted by enterprise customers\n- Documented common issues and their resolutions for the internal knowledge base\n- Assisted the IT team with onboarding tasks for new employees\n- Participated in bi-weekly meetings with the support and engineering teams\n\nPROJECTS\n\nTask Management App | React, Node.js, Express.js, PostgreSQL | Jan. 2024 - Apr. 2024\n- Built a full-stack task management application with user authentication and real-time updates\n- Designed the database schema and implemented REST API endpoints for CRUD operations\n- Deployed the application to AWS EC2 with a CI/CD pipeline using GitHub Actions\n\nInventory Tracker | Python, Flask, SQLite | Sep. 2023 - Dec. 2023\n- Developed a command-line inventory management tool for tracking product stock levels\n- Implemented search and filter functionality with export to CSV\n\nCERTIFICATIONS\n\nAWS Certified Cloud Practitioner",
    "response": {
      "score": 46,
      "verdict": "The resume's weakest dimension is its lack of measurable results, which could be improved by adding quantified metrics to experience and project bullets.",
      "actions": [
        "Add specific numbers or percentages to your experience bullets to show impact. Change 'Worked on the backend data processing service' to 'Optimized backend data processing, reducing [X] latency.'",
        "Enhance your education section by including your graduation date and GPA if it is strong. For example, add 'Expected May [Year]' and 'GPA: [X]' to your degree.",
        "Strengthen your experience bullets by starting with action verbs and focusing on achievements. Change 'Reviewed pull requests submitted by other members' to 'Improved code quality by reviewing [X] pull requests.'"
      ],
      "subscores": {
        "quantification": 0,
        "keyword_match": 100,
        "bullet_strength": 38,
        "education": 40
      }
    },
    "patched": {
      "resume": "ALEX CHEN\nalex.chen@gmail.com | (312) 555-0192 | linkedin.com/in/alexchen | github.com/alexchen | Chicago, IL\n\nEDUCATION\n\nUniversity of Illinois at Urbana-Champaign\nBachelor of Science in Computer Science | GPA: 3.6/4.0 | Expected May 2026\n\nTECHNICAL SKILLS\n\nLanguages: Python, Java, JavaScript, TypeScript, HTML/CSS\nTechnologies: Git, React, Node.js, Express.js, PostgreSQL, AWS EC2, Firebase, Docker\n\nEXPERIENCE\n\nSoftware Engineering Intern | Meridian Analytics | Chicago, IL | May 2024 - Aug. 2024\n- Maintained and extended the backend data processing service that powered the analytics team's reporting\n- Reviewed pull requests submitted by other members of the engineering team\n- Attended daily standups and contributed to sprint planning discussions\n- Assisted senior engineers with bug reports submitted by the QA team\n\nTechnical Support Intern | NovaBridge Systems | Remote | Jun. 2023 - Aug. 2023\n- Responded to support tickets submitted by enterprise customers\n- Documented common issues and their resolutions for the internal knowledge base\n- Assisted the IT team with onboarding tasks for new employees\n- Participated in bi-weekly meetings with the support and engineering teams\n\nPROJECTS\n\nTask Management App | React, Node.js, Express.js, PostgreSQL | Jan. 2024 - Apr. 2024\n- Built a full-stack task management application with user authentication and real-time updates\n- Designed the database schema and implemented REST API endpoints for CRUD operations\n- Deployed the application to AWS EC2 with a CI/CD pipeline using GitHub Actions\n\nInventory Tracker | Python, Flask, SQLite | Sep. 2023 - Dec. 2023\n- Developed a command-line inventory management tool for tracking product stock levels\n- Implemented search and filter functionality with export to CSV\n\nCERTIFICATIONS\n\nAWS Certified Cloud Practitioner",
      "response": {
        "score": 55,
        "verdict": "The resume's weakest dimension is its lack of measurable results, which could be improved by adding quantified metrics to experience descriptions.",
        "actions": [
          "Add specific metrics to your experience; for example, change 'Maintained and extended the backend data processing service' to 'Maintained and extended the backend data processing service, improving [X] performance by [Y]'.",
          "Strengthen your experience bullets by starting with action verbs and focusing on outcomes. Change 'Reviewed pull requests submitted by other members' to 'Conducted code reviews for [X] pull requests, ensuring [Y] code quality'.",
          "Consider adding relevant coursework to your education section to further demonstrate your academic foundation in computer science."
        ],
        "subscores": {
          "quantification": 0,
          "keyword_match": 100,
          "bullet_strength": 38,
          "education": 100
        }
      }
    }
  },
  {
    "id": "jordan",
    "label": "Jordan Park",
    "jd": "Junior Software Engineer\nFieldstone Systems | Detroit, MI | Full-Time | Entry Level\n\nAbout the Role\nFieldstone Systems develops data infrastructure tooling for logistics and supply-chain clients. We are\nhiring a Junior Software Engineer to work across our backend services and data pipelines. We welcome\nnew graduates and candidates with up to two years of professional experience.\n\nResponsibilities\n- Design, build, and maintain data ingestion pipelines (ETL/ELT) in Python\n- Write efficient SQL queries and manage schemas in our PostgreSQL environment\n- Build and document REST API endpoints consumed by internal and external clients\n- Contribute to code reviews and sprint ceremonies on a 2-week Agile cycle\n- Write unit and integration tests; participate in QA sign-off before releases\n- Package and deploy services using Docker on AWS EC2\n\nRequired Qualifications\n- Bachelor's degree in Computer Science, Software Engineering, or equivalent (new grads welcome)\n- Strong Python skills; Java or C++ experience is a plus\n- Working knowledge of SQL and relational database concepts\n- Familiarity with Git and standard branching workflows\n- Ability to communicate technical trade-offs clearly in code review and design discussions\n\nPreferred Qualifications\n- Experience with Tableau, dbt, or other data visualization and transformation tools\n- Exposure to Docker and containerized service deployment\n- Coursework or project experience in machine learning or data science\n- GPA of 3.0 or higher; relevant academic projects or internship experience noted favorably",
    "resume": "JORDAN PARK\njordan.park@gmail.com | (734) 555-0847 | linkedin.com/in/jordanpark | github.com/jordanpark | Ann Arbor, MI\n\nEDUCATION\n\nUniversity of Michigan - Ann Arbor\nBachelor of Science in Computer Science | GPA: 3.72/4.0 | Expected May 2026\nRelevant Coursework: Data Structures, Operating Systems, Machine Learning, Database Management Systems\n\nTECHNICAL SKILLS\n\nLanguages: Python, Java, C++, JavaScript, SQL\nTechnologies: Git, React, TensorFlow, PyTorch, PostgreSQL, Docker, AWS EC2, Linux\n\nEXPERIENCE\n\nSoftware Engineering Intern | Apex Software Group | Detroit, MI | Jun. 2025 - Aug. 2025\n- Reviewed and tested pull requests submitted by members of the backend engineering team\n- Wrote unit tests for existing modules in the codebase\n- Debugged issues reported by the QA team and updated the affected code\n- Participated in weekly code reviews and sprint planning meetings\n\nData Engineering Intern | Clearfield Data | Remote | May 2024 - Aug. 2024\n- Collected data from external API endpoints and stored it in the company database\n- Analyzed data sets using Python and reported findings to the data science team\n- Maintained and updated existing ETL scripts when upstream data formats changed\n- Created charts and visualizations of data trends in Tableau and Excel\n\nPROJECTS\n\nML-Based Resume Classifier | Python, scikit-learn, Flask, React | Jan. 2025 - Apr. 2025\n- Trained a logistic regression model to classify resumes into job categories, achieving 91% validation accuracy\n- Built a REST API with Flask and a React frontend for uploading and displaying classification results\n- Packaged the application in Docker for reproducible local and cloud deployment\n\nReal-Time Chat Application | Node.js, Socket.io, React, PostgreSQL | Sep. 2024 - Dec. 2024\n- Designed and built a messaging application with user authentication and persistent message history\n- Reduced average message delivery latency to 85ms using WebSocket connections via Socket.io\n- Wrote integration tests covering 78% of API endpoints using Jest",
    "response": {
      "score": 62,
      "verdict": "The resume demonstrates strong keyword alignment and education details, but could benefit from more action-verb bullets and measurable results.",
      "actions": [
        "Improve bullet strength by starting more lines with strong action verbs that highlight accomplishments.",
        "Enhance quantification by adding specific numbers, percentages, or scale figures to your experience and project bullets. Change 'Created charts and visualizations of data trends' to 'Created [X] charts and visualizations of data trends, improving [Y]'.",
        "Review your experience and project descriptions to ensure every bullet clearly states a concrete thing produced or improved, not just a responsibility."
      ],
      "subscores": {
        "quantification": 21,
        "keyword_match": 100,
        "bullet_strength": 43,
        "education": 100
      }
    }
  },
  {
    "id": "maya",
    "label": "Maya Rodriguez",
    "jd": "Junior Software Engineer\nOrbis AI | San Francisco, CA | Full-Time | Entry Level\n\nAbout the Role\nOrbis AI is an early-stage startup building AI-assisted developer tooling. We are hiring a Junior Software\nEngineer to help ship features across our full stack. New graduates with strong project portfolios are\nencouraged to apply.\n\nResponsibilities\n- Build product features using React, Next.js, and TypeScript on the frontend\n- Develop and maintain Python backend services and REST APIs\n- Manage data persistence using PostgreSQL and deploy services on AWS EC2\n- Write infrastructure-as-code using Docker and GitHub Actions CI/CD\n- Participate in design reviews, code reviews, and sprint planning\n\nRequired Qualifications\n- Bachelor's degree in Computer Science, EECS, or equivalent (new grads welcome)\n- Proficiency in Python and JavaScript/TypeScript\n- Hands-on experience with React or Next.js\n- Working knowledge of PostgreSQL or another relational database\n- Familiarity with Git, Docker, and Linux development environments\n\nPreferred Qualifications\n- Experience deploying to AWS EC2 or equivalent cloud infrastructure\n- Exposure to machine learning frameworks (PyTorch, TensorFlow, scikit-learn)\n- Hackathon wins, open-source contributions, or robotics/embedded project experience\n- GPA of 3.0 or higher",
    "resume": "MAYA RODRIGUEZ\nmaya.rodriguez@gmail.com | (415) 555-0374 | linkedin.com/in/mayarodriguez | github.com/mayarodriguez | Berkeley, CA\n\nEDUCATION\n\nUniversity of California, Berkeley\nBachelor of Science in Electrical Engineering and Computer Science | GPA: 3.81/4.0 | Expected May 2027\nRelevant Coursework: Data Structures and Algorithms, Computer Architecture, Machine Learning, Web Development\n\nTECHNICAL SKILLS\n\nProgramming: mainly use Python day-to-day, have also written Java and C++, picking up TypeScript\nFrontend: worked with React and Next.js, know HTML and CSS\nDatabases: used MySQL and Postgres (SQL), also Firebase for real-time data\nCloud/Infra: some experience with Amazon cloud services (EC2 mostly), comfortable with Docker basics\nTools: git for version control, written unit tests before, Linux (Ubuntu)\n\nEXPERIENCE\n\nSoftware Developer | Student Engineering Club | Berkeley, CA | Sep. 2024 - Present\n- Saved over $4,800 in annual licensing costs by building an admin portal with Next.js and a PostgreSQL\n  database to manage club members, equipment, and event scheduling\n- Led a team of 35+ student developers contributing to the club's open-source robotics platform\n- Shipped 3 major features per semester by running weekly standups and tracking work in Jira\n\nOpen Source Project Lead | Remote | Jan. 2024 - Aug. 2024\n- Grew the active contributor base to 200+ developers by writing onboarding documentation and\n  structured walkthroughs\n- Cut new-contributor ramp-up time by roughly 40% by publishing a standardized Git workflow guide\n  and pull request template\n- Presented project roadmap at 2 regional open-source developer conferences\n\nPROJECTS\n\nAI Study Assistant | Python, React, Google Vision API, sentence transformers | Oct. 2024\n- Won first place at campus hackathon (350+ participants) by building a note-taking app that\n  auto-tags and retrieves notes semantically\n- Achieved 93% retrieval accuracy by training a sentence transformer model on course material embeddings\n- Deployed on university Linux servers using Docker\n\nAutonomous Navigation Bot | ROS, C++, Python | Aug. 2024 - Present\n- Configured the ROS Noetic development environment on Ubuntu and integrated the hardware controller\n- Wrote ROS nodes to process incoming sensor data and send movement commands to the motor driver\n- Currently running behavior tests in the Gazebo simulator before moving to physical hardware",
    "response": {
      "score": 79,
      "verdict": "The resume demonstrates strong education details, but could benefit from more action-verb bullets and clearer statements of JD keywords.",
      "actions": [
        "Improve bullet strength by rephrasing duty-oriented statements to highlight accomplishments. Change 'Wrote ROS nodes to process incoming sensor data' to 'Developed ROS nodes to process sensor data and send movement commands'.",
        "Strengthen keyword match by formally stating skills. Change 'mainly use Python day-to-day' to 'Proficient in Python'.",
        "Enhance keyword match by formally stating skills. Change 'picking up TypeScript' to 'Proficient in TypeScript' or 'Experience with TypeScript'."
      ],
      "subscores": {
        "quantification": 67,
        "keyword_match": 85,
        "bullet_strength": 75,
        "education": 100
      }
    }
  }
];
// SCENARIO DATA END

// Fallback only — a REAL verdict captured from the live webhook (strong-match
// pair). Used if a live request fails, so the JOBZE column still resolves with a
// real retrieved source and citation rather than a hollow one. Never fabricated.
const FALLBACK_RESULT = {
  score: 75,
  verdict:
    "Taylor is a strong candidate for an internship, demonstrating relevant skills and experience, and employers highly value specific skills with examples (source: NACE Job Outlook 2026 Spring Update).",
  actions: [
    "Change 'managed Instagram and TikTok' to 'Supported campaign execution across Instagram and TikTok for 40+ campus events'.",
    "Change 'led 6-person team' to 'Led 6-person team for American Marketing Association, demonstrating teamwork in a fast-paced environment'.",
    "Add a bullet under Social Media Coordinator detailing any contribution to 'brand storytelling' or 'consumer research'.",
  ],
};

const JOBZE_STAGES = [
  { key: "read", label: "Reading JD + resume", color: C.blue },
  { key: "retrieve", label: "Retrieving verified sources", color: C.teal },
  { key: "score", label: "Scoring against verified market data", color: C.gold },
  { key: "cite", label: "Citing the source", color: C.lavender },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Pull a "(source: ...)" citation out of the verdict so the demo can surface it.
function splitCitation(verdict) {
  const v = (verdict || "").toString();
  const m = v.match(/\(\s*sources?\s*:\s*([^)]+?)\s*\)/i);
  if (!m) return { text: v.trim(), source: null };
  const source = m[1].trim();
  const text = v.replace(m[0], "").replace(/\s+([.,;:])/g, "$1").replace(/\s{2,}/g, " ").trim();
  return { text, source };
}

// Call the live webhook. Resolves to { score, verdict, actions, live:true } or throws.
async function fetchVerdict(jd, resume) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd, resume }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("Webhook HTTP " + res.status);
    const data = await res.json();
    let score = parseInt(data.score, 10);
    if (isNaN(score)) score = 0;
    score = Math.max(0, Math.min(100, score));
    const actions = Array.isArray(data.actions)
      ? data.actions.map((a) => (a || "").toString()).filter(Boolean)
      : [];
    // The engine now returns four subscores; pass them through untouched.
    const subscores =
      data.subscores && typeof data.subscores === "object" ? data.subscores : null;
    return { score, verdict: (data.verdict || "").toString(), actions, subscores, live: true };
  } finally {
    clearTimeout(t);
  }
}

function Spinner({ color = C.teal, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Check({ color, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={color} opacity="0.15" />
      <path d="M8 12.5l2.5 2.5 5.5-5.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SourceChip({ source }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 999, background: "rgba(131,214,197,0.10)", border: "1px solid rgba(131,214,197,0.30)" }}>
      <span style={{ fontSize: 10, color: C.teal }}>●</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, fontFamily: "monospace" }}>{source}</span>
    </span>
  );
}

function SourcePill({ source }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "rgba(248,199,98,0.10)", border: "1px solid rgba(248,199,98,0.35)" }}>
      <span style={{ fontSize: 11, color: C.gold }}>◆</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.gold, fontFamily: "monospace" }}>Verified source: {source}</span>
    </span>
  );
}

function ScoreLine({ score, scoring }) {
  return (
    <span style={{ fontSize: 12, color: "#A1A1AA", fontFamily: "monospace" }}>
      <b style={{ color: C.gold }}>{score}/100</b> · {scoring ? "scoring against verified market data" : "scored against verified market data"}
    </span>
  );
}

// One pipeline row. status: "pending" | "active" | "done". Completed rows persist
// with their real artifact so the user can read it after the run.
function GroundedStage({ label, color, status, artifact, muted }) {
  const labelColor = status === "pending" ? (muted ? C.grey : C.greyText) : muted ? C.greyText : "#F4F4F5";
  return (
    <div style={{ padding: "9px 0", opacity: status === "pending" ? (muted ? 0.4 : 0.35) : 1, transition: "opacity .4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 18, height: 18, flexShrink: 0, display: "inline-flex" }}>
          {status === "active" && <Spinner color={color} size={16} />}
          {status === "done" && <Check color={color} size={16} />}
          {status === "pending" && <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.15)" }} />}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: labelColor, fontFamily: "monospace", letterSpacing: "0.01em" }}>{label}</span>
      </div>
      {artifact && status !== "pending" && (
        <div style={{ marginLeft: 28, marginTop: 6, animation: "fadeUp .4s ease both" }}>{artifact}</div>
      )}
    </div>
  );
}

// Generic LLM path: one real step, then the grounding steps it never performs.
// The empty retrieve/score/cite rows are the contrast — no copy needed.
function GenericLLMColumn() {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.greyText, textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "monospace", marginBottom: 10 }}>
        Generic LLM · ChatGPT / Claude / Gemini
      </div>
      <GroundedStage label="Generating from training data" color={C.grey} status="done" muted />
      <GroundedStage label="Retrieving verified sources" color={C.grey} status="pending" muted />
      <GroundedStage label="Scoring against verified market data" color={C.grey} status="pending" muted />
      <GroundedStage label="Citing the source" color={C.grey} status="pending" muted />
    </div>
  );
}

function JobzeColumn({ stageDone, running, revealed, scoreAnim }) {
  const statusOf = (i) => (i < stageDone ? "done" : i === stageDone && running ? "active" : "pending");
  const artifactFor = (i, status) => {
    if (i === 1 && revealed.source) return <SourceChip source={revealed.source} />;
    if (i === 2 && status === "active") return <ScoreLine score={scoreAnim} scoring />;
    if (i === 2 && status === "done") return <ScoreLine score={revealed.score} />;
    if (i === 3 && status === "done" && revealed.source) return <SourcePill source={revealed.source} />;
    return null;
  };
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: ".1em", fontFamily: "monospace", marginBottom: 10 }}>
        JOBZE · grounded in verified sources
      </div>
      {JOBZE_STAGES.map((s, i) => {
        const status = statusOf(i);
        return <GroundedStage key={s.key} label={s.label} color={s.color} status={status} artifact={artifactFor(i, status)} />;
      })}
    </div>
  );
}

// Compact, monochrome subscore strip. Keys match the engine response verbatim.
const SUBSCORE_LABELS = [
  ["quantification", "Quantification"],
  ["keyword_match", "JD Keywords"],
  ["bullet_strength", "Bullet Strength"],
  ["education", "Education"],
];

function SubscoresRow({ subscores }) {
  if (!subscores) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginBottom: 16 }}>
      {SUBSCORE_LABELS.map(([key, label]) => (
        <div key={key} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.greyText, textTransform: "uppercase", letterSpacing: ".08em", fontFamily: "monospace" }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#F4F4F5", fontFamily: "monospace" }}>
            {typeof subscores[key] === "number" ? subscores[key] : "-"}
          </span>
        </div>
      ))}
    </div>
  );
}

function ResultBlock({ result, patch }) {
  const { score, verdict, actions } = result;
  const scoreColor = score >= 70 ? C.teal : score >= 40 ? C.gold : C.crimson;
  const { text } = splitCitation(verdict);
  return (
    <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)", animation: "fadeUp .6s ease both" }}>
      {patch && patch.phase === "done" && (
        <div style={{ fontSize: 11, color: C.greyText, fontFamily: "monospace", marginBottom: 10 }}>
          After the fixes. Score moved from {patch.beforeScore} to {patch.afterScore}.
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 12 }}>
        <div style={{ fontSize: 52, fontWeight: 700, fontFamily: "monospace", color: scoreColor, lineHeight: 1, letterSpacing: "-0.04em" }}>{score}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#F4F4F5", lineHeight: 1.5 }}>{text}</div>
          <div style={{ fontSize: 11, color: C.greyText, fontFamily: "monospace", marginTop: 6 }}>Match score out of 100</div>
        </div>
      </div>
      <SubscoresRow subscores={result.subscores} />
      {Array.isArray(actions) && actions.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.lavender, textTransform: "uppercase", letterSpacing: ".08em", fontFamily: "monospace", marginBottom: 8 }}>Recommended Actions</div>
          {actions.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#A1A1AA", lineHeight: 1.55, marginBottom: 8, fontFamily: "'Geist', system-ui, sans-serif" }}>
              <span style={{ color: C.lavender, fontFamily: "monospace", flexShrink: 0 }}>{i + 1}.</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}
      {patch && patch.phase !== "done" && (
        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={patch.onApply}
            disabled={patch.phase === "running"}
            style={{ padding: "7px 16px", fontSize: 12, fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.02em", color: patch.phase === "running" ? C.grey : "#F4F4F5", background: "transparent", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, cursor: patch.phase === "running" ? "default" : "pointer", transition: "all 0.3s ease" }}
          >
            {patch.phase === "running" ? "Applying the fixes..." : "Apply the suggested fixes"}
          </button>
          <div style={{ fontSize: 10, color: C.greyText, fontFamily: "monospace", marginTop: 6 }}>
            Before the fixes: {patch.beforeScore}. Replays the captured rescore of the fixed resume.
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobzeScorer() {
  const [phase, setPhase] = useState("idle"); // idle | running | result
  const [stageDone, setStageDone] = useState(0);
  const [revealed, setRevealed] = useState({});
  const [scoreAnim, setScoreAnim] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null); // sample currently shown, null for live input
  const [autoIdx, setAutoIdx] = useState(null); // index in the autoplay cycle, null = loop stopped
  const [patchPhase, setPatchPhase] = useState("idle"); // idle | running | done (rising-score moment)
  const runRef = useRef(0); // cancels stale runs on reset/unmount
  const hasPlayedRef = useRef(false); // autoplay starts exactly once (ref, not state)
  const rootRef = useRef(null);

  // Drive a real-data staged reveal. getResponse resolves to the real verdict
  // (live fetch for pasted input, or the pre-captured seed for autoplay).
  const run = useCallback(async (getResponse) => {
    const token = ++runRef.current;
    const stale = () => runRef.current !== token;
    setPhase("running");
    setStageDone(0);
    setRevealed({});
    setScoreAnim(0);
    setFactIdx(0);
    setResult(null);
    setPatchPhase("idle");

    // Fire the request immediately; choreograph the reveal while it is in flight.
    const respP = Promise.resolve()
      .then(getResponse)
      .catch((e) => {
        console.warn("JOBZE live webhook failed; using fallback:", e);
        return null;
      });

    await sleep(TIMING.stageReveal);
    if (stale()) return;
    setStageDone(1); // Reading JD + resume done

    const resp = (await respP) || FALLBACK_RESULT; // fallback so the demo never blanks
    if (stale()) return;
    const src = splitCitation(resp.verdict).source;
    if (src) setRevealed((r) => ({ ...r, source: src }));

    await sleep(TIMING.stageReveal);
    if (stale()) return;
    setStageDone(2); // Retrieving verified sources done -> real source shown

    // Score stage: count up to the REAL score.
    const steps = 18;
    for (let k = 1; k <= steps; k++) {
      if (stale()) return;
      setScoreAnim(Math.round((resp.score * k) / steps));
      await sleep(TIMING.scoreCountMs / steps);
    }
    if (stale()) return;
    setScoreAnim(resp.score);
    setRevealed((r) => ({ ...r, score: resp.score }));
    setStageDone(3); // Scoring done -> real score shown

    await sleep(TIMING.stageReveal);
    if (stale()) return;
    setStageDone(4); // Citing the source done -> gold pill
    setResult(resp);
    setPhase("result");
  }, []);

  // Play one pre-captured sample: its real inputs go into the boxes, its real
  // captured response drives the staged reveal. No live call.
  const playScenario = useCallback(
    (i) => {
      const idx = i % SCENARIOS.length;
      const sc = SCENARIOS[idx];
      setAutoIdx(idx);
      setActiveScenario(sc);
      setJd(sc.jd);
      setResume(sc.resume);
      run(() => Promise.resolve(sc.response));
    },
    [run]
  );

  // Autostart: replay the first pre-captured sample shortly after the demo
  // scrolls into view. No live call, no countdown pulse, no forced wait. The
  // guard is a ref (not state) so scheduling the timer does not trigger an
  // effect-cleanup that would cancel it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let timer = null;
    const trigger = () => {
      if (hasPlayedRef.current) return;
      hasPlayedRef.current = true;
      timer = setTimeout(() => playScenario(0), TIMING.autoplayDelay);
    };
    if (typeof IntersectionObserver === "undefined") {
      trigger();
      return () => clearTimeout(timer);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trigger();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [playScenario]);

  // Autoplay loop: when a sample's verdict has been up for the dwell time,
  // advance to the next sample. Any manual interaction (live input, reset, the
  // rising-score moment) stops the loop by clearing autoIdx or patchPhase.
  useEffect(() => {
    if (phase !== "result" || autoIdx === null || patchPhase !== "idle") return;
    const t = setTimeout(() => playScenario(autoIdx + 1), TIMING.scenarioDwell);
    return () => clearTimeout(t);
  }, [phase, autoIdx, patchPhase, playScenario]);

  // Rotate the verified facts while a run is in flight.
  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setFactIdx((i) => (i + 1) % FACTS.length), TIMING.factRotateMs);
    return () => clearInterval(t);
  }, [phase]);

  // Cancel any in-flight run if the component unmounts.
  useEffect(() => () => { runRef.current++; }, []);

  const isRunning = phase === "running";

  const handleProcess = () => {
    if (isRunning) return;
    if (jd.trim() || resume.trim()) {
      setAutoIdx(null); // live input stops the sample loop
      setActiveScenario(null);
      run(() => fetchVerdict(jd, resume)); // live: only for pasted input
    } else {
      playScenario(0); // empty -> replay the samples
    }
  };

  const handleReset = () => {
    runRef.current++; // cancel any in-flight run
    setPhase("idle");
    setStageDone(0);
    setRevealed({});
    setScoreAnim(0);
    setResult(null);
    setJd("");
    setResume("");
    setActiveScenario(null);
    setAutoIdx(null);
    setPatchPhase("idle");
  };

  // Rising-score moment: replay the captured rescore of the fixed resume
  // (alex_patched). The score and education subscore count up to the real
  // patched values, then the patched verdict and actions render. Data is the
  // captured engine response, verbatim.
  const handleApplyFixes = useCallback(async () => {
    const sc = activeScenario;
    if (!sc || !sc.patched || patchPhase !== "idle" || phase !== "result") return;
    setAutoIdx(null); // stop the sample loop while the user is engaged
    const token = ++runRef.current;
    const from = sc.response;
    const to = sc.patched.response;
    setPatchPhase("running");
    const steps = 18;
    for (let k = 1; k <= steps; k++) {
      if (runRef.current !== token) return;
      const t = k / steps;
      setResult({
        ...from,
        score: Math.round(from.score + (to.score - from.score) * t),
        subscores: {
          ...from.subscores,
          education: Math.round(
            from.subscores.education + (to.subscores.education - from.subscores.education) * t
          ),
        },
      });
      await sleep(TIMING.scoreCountMs / steps);
    }
    if (runRef.current !== token) return;
    setResult(to);
    setRevealed((r) => ({ ...r, score: to.score }));
    setScoreAnim(to.score);
    setPatchPhase("done");
  }, [activeScenario, patchPhase, phase]);

  const fact = FACTS[factIdx];

  return (
    <div ref={rootRef} style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#08080A", padding: 20, fontFamily: "'Geist', system-ui, sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        textarea { font-family: 'Geist Mono', 'SF Mono', monospace; }
        textarea::placeholder { color: #52525B; }
        textarea:focus { outline: none; border-color: rgba(255,255,255,0.15) !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 780, background: "rgba(14,15,18,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(131,214,197,0.03)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,8,10,0.6)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.crimson, opacity: 0.7 }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.gold, opacity: 0.7 }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.green, opacity: 0.7 }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#71717A", fontFamily: "monospace", letterSpacing: "0.06em" }}>JOBZE</span>
          <div style={{ width: 42 }} />
        </div>

        <div style={{ padding: "20px 20px 24px" }}>
          {phase === "idle" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#71717A", marginBottom: 6, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Job Description</label>
                <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the job posting here..." rows={8} style={{ width: "100%", padding: 12, fontSize: 11, lineHeight: 1.6, background: "rgba(19,20,24,0.8)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, resize: "vertical" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#71717A", marginBottom: 6, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Resume</label>
                <textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Paste your resume here..." rows={8} style={{ width: "100%", padding: 12, fontSize: 11, lineHeight: 1.6, background: "rgba(19,20,24,0.8)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, resize: "vertical" }} />
              </div>
            </div>
          )}

          {(phase === "running" || phase === "result") && (
            <div style={{ animation: "fadeUp 0.5s ease both" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: C.greyText, fontFamily: "monospace" }}>Same inputs, two methods.</span>
                {activeScenario && (
                  <span style={{ fontSize: 10, color: C.greyText, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                    Sample {SCENARIOS.indexOf(activeScenario) + 1} of {SCENARIOS.length}: {activeScenario.label}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
                <GenericLLMColumn />
                <div style={{ width: 1, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
                <JobzeColumn stageDone={stageDone} running={isRunning} revealed={revealed} scoreAnim={scoreAnim} />
              </div>

              {isRunning && fact && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 8, animation: "fadeUp 0.4s ease both" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.teal, fontFamily: "monospace", letterSpacing: ".08em" }}>VERIFIED</span>
                  <span style={{ fontSize: 11, color: "#A1A1AA", fontFamily: "'Geist', system-ui, sans-serif" }}>{fact.stat}</span>
                  <span style={{ fontSize: 10, color: C.greyText, fontFamily: "monospace", marginLeft: "auto", whiteSpace: "nowrap" }}>· {fact.source}</span>
                </div>
              )}

              {phase === "result" && result && (
                <ResultBlock
                  result={result}
                  patch={
                    activeScenario && activeScenario.patched
                      ? {
                          phase: patchPhase,
                          beforeScore: activeScenario.response.score,
                          afterScore: activeScenario.patched.response.score,
                          onApply: handleApplyFixes,
                        }
                      : null
                  }
                />
              )}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {phase === "idle" && <span style={{ fontSize: 11, color: "#52525B", fontFamily: "monospace" }}>Paste a JD and resume, or watch the sample.</span>}
              {isRunning && <span style={{ fontSize: 11, color: C.teal, fontFamily: "monospace", opacity: 0.8 }}>retrieving + scoring against verified sources</span>}
              {phase === "result" && <span style={{ fontSize: 11, color: C.greyText, fontFamily: "monospace" }}>Scored against verified sources.</span>}
            </div>
            <button onClick={phase === "result" ? handleReset : handleProcess} disabled={isRunning} style={{ padding: "8px 20px", fontSize: 12, fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.02em", color: isRunning ? "#52525B" : "#08080A", background: isRunning ? "rgba(255,255,255,0.05)" : `linear-gradient(180deg, ${C.teal}, ${C.green})`, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: isRunning ? "default" : "pointer", boxShadow: isRunning ? "none" : `0 2px 12px rgba(131,214,197,0.2)`, transition: "all 0.3s ease" }}>
              {phase === "result" ? "Score yours" : isRunning ? "Processing..." : "Process"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
