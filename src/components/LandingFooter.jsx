import { useNavigate } from "react-router-dom";

const testimonials = [
  {
    emoji: "👩‍🏫",
    text: '"I used to spend 45 minutes making a quiz in Word. Now it takes me 5 minutes and it actually looks good!"',
    name: "Sarah M.",
    role: "8th Grade Science, Texas",
  },
  {
    emoji: "👨‍🏫",
    text: '"The timer feature is a game changer for exams. Students can\'t drag it out and I get results instantly."',
    name: "James K.",
    role: "High School History, UK",
  },
  {
    emoji: "👩‍🎓",
    text: '"Students actually LIKE taking quizzes now because they get instant feedback on which answers were wrong."',
    name: "Emily R.",
    role: "5th Grade Math, California",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6">
      <p className="text-center text-xs font-medium tracking-[2px] uppercase text-amber mb-4 font-dm">
        Testimonials
      </p>
      <h2
        className="font-fraunces font-black text-center leading-none mb-16 mx-auto max-w-xl"
        style={{ fontSize: "clamp(36px, 5vw, 60px)", letterSpacing: "-2px" }}
      >
        Teachers <em className="not-italic font-light text-amber">love</em> it
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-card rounded-2xl p-7 border border-ink/7 hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-amber text-sm tracking-[-1px] mb-4">★★★★★</div>
            <p className="text-sm text-ink leading-relaxed italic mb-5 font-dm">
              {t.text}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-xl">
                {t.emoji}
              </div>
              <div>
                <div className="text-[13px] font-medium text-ink font-dm">
                  {t.name}
                </div>
                <div className="text-xs text-warm-gray font-dm">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CTA() {
  const navigate = useNavigate();
  return (
    <section
      className="py-24 px-6 text-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(232,130,26,0.08) 0%, transparent 50%, rgba(74,103,65,0.06) 100%)",
      }}
    >
      <p className="text-xs font-medium tracking-[2px] uppercase text-amber mb-4 font-dm">
        Get started today
      </p>
      <h2
        className="font-fraunces font-black leading-none mb-5 mx-auto max-w-xl"
        style={{ fontSize: "clamp(36px, 5vw, 60px)", letterSpacing: "-2px" }}
      >
        Your next quiz is{" "}
        <em className="not-italic font-light text-amber">5 minutes</em> away
      </h2>
      <p className="text-lg text-warm-gray font-light mb-3 font-dm">
        Join 500+ teachers who stopped fighting with Google Forms.
      </p>
      <p className="text-sm text-warm-gray mb-10 font-dm">
        2-week · Full access · No credit card needed
      </p>
      <button
        onClick={() => navigate("/signup")}
        className="font-dm font-medium bg-amber text-white px-12 py-5 rounded-full text-lg hover:bg-ink transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(232,130,26,0.35)]"
      >
        Start your 2-week free trial
      </button>
      <p className="text-sm text-warm-gray mt-4 font-dm">
        Made for teachers ❤️ · Works on any device · Cancel anytime
      </p>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <div className="font-fraunces font-black text-xl text-white">
        Quiz<span className="text-amber">Craft</span>
        <span className="text-white/30 text-xs font-dm font-normal ml-2">
          Made for teachers ❤️
        </span>
      </div>
      <p className="text-[13px] text-white/40 font-dm">
        © 2026 QuizCraft. All rights reserved.
      </p>
      <div className="flex gap-6 items-center justify-center">
        <a
          href="mailto:iammailingsanjaysharma@gmail.com"
          className="text-[13px] text-amber hover:text-white transition-colors no-underline font-dm"
        >
          Contact Us
        </a>
        {["Privacy", "Terms"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-[13px] text-white/40 hover:text-white transition-colors no-underline font-dm"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
