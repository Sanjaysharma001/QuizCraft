import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const quizItems = [
  { label: "📚 Chapter 5 Review", active: true },
  { label: "🧬 Biology Midterm", active: false },
  { label: "📐 Algebra Basics", active: false },
  { label: "🌍 Geography Q1", active: false },
];

function QuestionCard({ num, total, text, options, correct }) {
  return (
    <div className="bg-cream rounded-xl p-5 mb-3 border border-ink/5">
      <div className="text-[11px] font-medium text-warm-gray uppercase tracking-widest mb-2 font-dm">
        Question {num} of {total}
      </div>
      <div className="text-sm font-medium text-ink mb-3 font-dm">{text}</div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-lg text-xs border transition-all font-dm
            ${i === correct ? "bg-sage/10 border-sage text-sage font-medium" : "bg-transparent border-ink/10 text-ink"}`}
          >
            {i === correct ? "✓ " : ""}
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 text-center overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[400px] rounded-full bg-amber/10 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-sage/8 blur-[80px]" />
      </div>

      {/* Badge */}
      <div
        className="relative z-10 inline-flex items-center gap-2 bg-amber/10 border border-amber/30 text-amber px-4 py-1.5 rounded-full text-[13px] font-medium mb-8 font-dm"
        style={{ animation: "fadeUp 0.6s ease both" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />✦
        Built for teachers, loved by students
      </div>

      {/* Headline */}
      <h1
        className="relative z-10 font-fraunces font-black leading-[0.95] tracking-[-3px] max-w-4xl"
        style={{
          fontSize: "clamp(48px, 7vw, 96px)",
          animation: "fadeUp 0.6s 0.1s ease both",
        }}
      >
        Make beautiful
        <br />
        <em className="not-italic text-amber font-light">quizzes</em> in minutes
      </h1>

      {/* Sub */}
      <p
        className="relative z-10 font-dm font-light text-warm-gray max-w-lg mx-auto leading-relaxed mt-7 mb-10"
        style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          animation: "fadeUp 0.6s 0.2s ease both",
        }}
      >
        Create, share and grade quizzes instantly. Set time limits, track
        student results, and export to PDF — all in one place.
      </p>

      {/* Feature pills */}
      <div
        className="relative z-10 flex items-center gap-3 flex-wrap justify-center mb-10"
        style={{ animation: "fadeUp 0.6s 0.25s ease both" }}
      >
        {[
          { icon: "⏱️", label: "Timer support" },
          { icon: "📊", label: "Live results" },
          { icon: "📄", label: "PDF export" },
          { icon: "✅", label: "Auto grading" },
        ].map((f) => (
          <span
            key={f.label}
            className="flex items-center gap-1.5 bg-card border border-ink/8 px-3 py-1.5 rounded-full text-xs font-medium text-ink font-dm"
          >
            {f.icon} {f.label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div
        className="relative z-10 flex items-center gap-4 flex-wrap justify-center"
        style={{ animation: "fadeUp 0.6s 0.3s ease both" }}
      >
        <button
          onClick={() => navigate("/signup")}
          className="font-dm font-medium bg-amber text-white px-9 py-4 rounded-full text-base hover:bg-ink transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(232,130,26,0.35)]"
        >
          Start 2-week free trial
        </button>
        <button
          onClick={() =>
            document
              .getElementById("how")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="font-dm font-medium text-ink text-[15px] flex items-center gap-2 hover:gap-3 transition-all duration-200 bg-transparent border-none cursor-pointer"
        >
          See how it works <span className="text-lg">→</span>
        </button>
      </div>

      <p
        className="relative z-10 text-xs text-warm-gray mt-4 font-dm"
        style={{ animation: "fadeUp 0.6s 0.35s ease both" }}
      >
        No credit card needed · 14 days full access · Upgrade anytime
      </p>

      {/* Social Proof */}
      <div
        className="relative z-10 mt-14 flex items-center gap-5 flex-wrap justify-center"
        style={{ animation: "fadeUp 0.6s 0.4s ease both" }}
      >
        <div className="flex">
          {["👩‍🏫", "👨‍🏫", "👩‍🎓", "🧑‍🏫"].map((e, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full border-2 border-cream bg-card flex items-center justify-center text-lg -ml-2.5 first:ml-0"
            >
              {e}
            </div>
          ))}
        </div>
        <div>
          <div className="text-amber tracking-[-2px] text-base">★★★★★</div>
          <div className="text-sm text-warm-gray font-dm">
            Loved by <strong className="text-ink">500+ teachers</strong> in the
            US &amp; UK
          </div>
        </div>
      </div>

      {/* App Preview */}
      <div
        className="relative z-10 mt-16 w-full max-w-3xl"
        style={{ animation: "fadeUp 0.6s 0.5s ease both" }}
      >
        <div className="bg-card rounded-2xl shadow-[0_32px_80px_rgba(26,18,8,0.15),0_0_0_1px_rgba(26,18,8,0.08)] overflow-hidden">
          <div className="bg-[#EDEAE4] px-4 py-3 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-warm-gray mx-3 text-left font-dm">
              app.quizcraft.io/dashboard
            </div>
          </div>
         <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
              <div className="bg-cream rounded-xl p-4 hidden md:block">
                <div className="text-[11px] font-medium uppercase tracking-widest text-warm-gray mb-3 font-dm">
                  My Quizzes
                </div>
                {quizItems.map((item, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2.5 rounded-lg text-[13px] mb-1.5 font-dm
                    ${item.active ? "bg-amber text-white font-medium" : "text-ink hover:bg-ink/5"}`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-fraunces text-xl font-semibold text-ink">
                    Chapter 5 Review Quiz
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 bg-amber/10 text-amber text-xs font-medium px-2.5 py-1 rounded-full font-dm">
                      <Clock size={10} /> 20 min
                    </span>
                    <span className="bg-sage/10 text-sage text-xs font-medium px-2.5 py-1 rounded-full font-dm">
                      ● Live
                    </span>
                  </div>
                </div>
                <QuestionCard
                  num="1"
                  total="5"
                  text="What is the powerhouse of the cell?"
                  options={["Mitochondria", "Nucleus", "Ribosome", "Cell Wall"]}
                  correct={0}
                />
                <QuestionCard
                  num="2"
                  total="5"
                  text="Which process converts glucose to energy?"
                  options={[
                    "Photosynthesis",
                    "Cellular Respiration",
                    "Mitosis",
                    "Diffusion",
                  ]}
                  correct={1}
                />
                <div className="flex gap-2.5 mt-4 justify-end">
                  <button className="px-4 py-2 rounded-full border border-ink/20 text-ink text-sm font-medium font-dm">
                    📄 Export PDF
                  </button>
                  <button className="px-4 py-2 rounded-full border border-ink/20 text-ink text-sm font-medium font-dm">
                    🔗 Share
                  </button>
                  <button className="px-4 py-2 rounded-full bg-amber text-white text-sm font-medium font-dm">
                    📊 Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
