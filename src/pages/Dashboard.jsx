import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Pencil,
  Link2,
  BarChart2,
  PlusCircle,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import AppNav from "../components/AppNav";

const DAILY_QUIZ_LIMIT = 10;
const CHECKOUT_URL = "https://getquizcraft.lemonsqueezy.com/buy/YOUR_LINK";

const notifyCountChanged = () =>
  window.dispatchEvent(new Event("quizCountChanged"));

export default function Dashboard() {
  const { user, isPro, trialActive, trialDaysLeft, isExpired, canUseApp } =
    useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setQuizzes(data || []);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("quizzes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", start.toISOString());
    setTodayCount(count || 0);
    setLoading(false);
  };

  const handleCreateQuiz = () => {
    if (isExpired) return;
    if (!isPro && todayCount >= DAILY_QUIZ_LIMIT) {
      setShowUpgrade(true);
      return;
    }
    navigate("/create");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from("quizzes").delete().eq("id", deleteTarget.id);
    setQuizzes((prev) => prev.filter((q) => q.id !== deleteTarget.id));
    setDeleteTarget(null);
    notifyCountChanged();
  };

  const copyLink = () => {
    const url = `${window.location.origin}/quiz/${shareTarget.share_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dailyLimitReached =
    !isPro && trialActive && todayCount >= DAILY_QUIZ_LIMIT;
  const quizzesToday = `${todayCount}/${DAILY_QUIZ_LIMIT} quizzes today`;

  // ── EXPIRED SCREEN ──
  if (isExpired)
    return (
      <div className="min-h-screen bg-cream">
        <AppNav />
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">⏰</div>
          <h1 className="font-fraunces font-black text-3xl text-ink mb-3">
            Your trial has ended
          </h1>
          <p className="text-warm-gray text-sm font-dm leading-relaxed mb-8">
            Your 2-week free trial is over. Upgrade to Pro to continue creating
            quizzes, viewing results, and sharing with students.
          </p>
          <div className="bg-card rounded-2xl p-6 border border-ink/7 mb-8 text-left">
            <div className="text-sm font-medium text-ink mb-4 font-dm">
              Everything in Pro:
            </div>
            {[
              "Unlimited quizzes",
              "Full student analytics",
              "Answer review for teachers & students",
              "PDF export",
              "Priority support",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-sm text-ink py-2 border-b border-ink/5 last:border-0 font-dm"
              >
                <span className="text-sage font-bold">✓</span> {f}
              </div>
            ))}
          </div>
          <button
            onClick={() => window.open(CHECKOUT_URL, "_blank")}
            className="w-full bg-amber text-white py-4 rounded-xl font-medium hover:bg-ink transition-colors font-dm text-base"
          >
            Upgrade to Pro — $8/month
          </button>
          <p className="text-xs text-warm-gray mt-3 font-dm">
            Cancel anytime · Instant access
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream">
      <AppNav />

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          style={{ animation: "fadeIn 0.15s ease both" }}
        >
          <div
            className="bg-card rounded-2xl p-8 max-w-sm w-full shadow-[0_32px_80px_rgba(26,18,8,0.3)] border border-ink/8"
            style={{ animation: "modalIn 0.2s ease both" }}
          >
            <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="font-fraunces font-black text-xl text-ink text-center mb-2">
              Delete Quiz?
            </h3>
            <p className="text-warm-gray text-sm text-center font-dm mb-1">
              You're about to delete
            </p>
            <p className="text-ink text-sm font-medium text-center font-dm mb-6">
              "{deleteTarget.title}"
            </p>
            <p className="text-warm-gray text-xs text-center font-dm mb-6">
              This will also delete all student results. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-ink/15 text-ink text-sm font-medium hover:bg-cream transition-colors font-dm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors font-dm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Share Modal ── */}
      {shareTarget && (
        <div
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          style={{ animation: "fadeIn 0.15s ease both" }}
        >
          <div
            className="bg-card rounded-2xl p-8 max-w-sm w-full shadow-[0_32px_80px_rgba(26,18,8,0.3)] border border-ink/8"
            style={{ animation: "modalIn 0.2s ease both" }}
          >
            <div className="flex items-center justify-center w-14 h-14 bg-amber/10 rounded-full mx-auto mb-4">
              <Link2 size={26} className="text-amber" />
            </div>
            <h3 className="font-fraunces font-black text-xl text-ink text-center mb-1">
              Share Quiz
            </h3>
            <p className="text-warm-gray text-sm text-center font-dm mb-6">
              Send this link to your students
            </p>
            <div className="bg-cream rounded-xl border border-ink/12 px-4 py-3 mb-4 flex items-center gap-3">
              <span className="text-xs text-warm-gray font-dm truncate flex-1">
                {window.location.origin}/quiz/{shareTarget.share_id}
              </span>
            </div>
            <button
              onClick={copyLink}
              className={`w-full py-3 rounded-xl font-medium text-sm transition-all font-dm mb-3
                ${copied ? "bg-sage text-white" : "bg-amber text-white hover:bg-ink"}`}
            >
              {copied ? "✅ Link Copied!" : "📋 Copy Link"}
            </button>
            <button
              onClick={() => { setShareTarget(null); setCopied(false); }}
              className="w-full py-3 rounded-xl border border-ink/15 text-warm-gray text-sm hover:text-ink transition-colors font-dm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Daily Limit Modal ── */}
      {showUpgrade && (
        <div
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          style={{ animation: "fadeIn 0.15s ease both" }}
        >
          <div
            className="bg-card rounded-3xl p-8 max-w-md w-full shadow-[0_32px_80px_rgba(26,18,8,0.3)] border border-ink/8"
            style={{ animation: "modalIn 0.2s ease both" }}
          >
            <div className="text-5xl mb-4 text-center">🚀</div>
            <h2 className="font-fraunces font-black text-2xl text-ink text-center mb-2">
              Daily limit reached!
            </h2>
            <p className="text-warm-gray text-sm text-center mb-6 font-dm leading-relaxed">
              You've created{" "}
              <strong className="text-ink">10 quizzes today</strong> on the free
              trial. Upgrade to Pro for unlimited daily quiz creation.
            </p>
            <button
              onClick={() => window.open(CHECKOUT_URL, "_blank")}
              className="w-full bg-amber text-white py-3.5 rounded-xl font-medium text-sm hover:bg-ink transition-colors font-dm mb-3"
            >
              Upgrade to Pro — $8/month
            </button>
            <button
              onClick={() => setShowUpgrade(false)}
              className="w-full py-3 rounded-xl border border-ink/15 text-warm-gray text-sm hover:text-ink transition-colors font-dm"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Trial banner */}
        {trialActive && !isPro && (
          <div
            className={`rounded-2xl px-5 py-4 mb-6 flex items-center justify-between flex-wrap gap-3
            ${trialDaysLeft <= 2 ? "bg-red-50 border border-red-200" : "bg-amber/10 border border-amber/25"}`}
          >
            <div>
              <span
                className={`font-medium text-sm font-dm ${trialDaysLeft <= 2 ? "text-red-500" : "text-amber"}`}
              >
                ⏳{" "}
                {trialDaysLeft >= 7
                  ? `${Math.ceil(trialDaysLeft / 7)} week${Math.ceil(trialDaysLeft / 7) !== 1 ? "s" : ""}`
                  : `${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""}`}{" "}
                left in trial —
              </span>
              <span className="text-ink text-sm font-dm">{quizzesToday}</span>
            </div>
            <button
              onClick={() => window.open(CHECKOUT_URL, "_blank")}
              className="bg-amber text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-ink transition-colors font-dm"
            >
              Upgrade to Pro →
            </button>
          </div>
        )}

        {/* Pro banner */}
        {isPro && (
          <div className="bg-sage/10 border border-sage/25 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <span className="text-sage font-medium text-sm font-dm">
              Pro Plan active — Unlimited quizzes, PDF export &amp; full analytics!
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-fraunces font-black text-3xl text-ink">
              My Quizzes
            </h1>
            <p className="text-warm-gray text-sm mt-1 font-dm">
              {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} total
              {!isPro && trialActive && ` · ${quizzesToday}`}
            </p>
          </div>
          <button
            onClick={handleCreateQuiz}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-colors font-dm
              ${dailyLimitReached
                ? "bg-ink/10 text-warm-gray cursor-not-allowed"
                : "bg-amber text-white hover:bg-ink shadow-[0_4px_16px_rgba(232,130,26,0.3)]"}`}
          >
            {dailyLimitReached ? <Lock size={14} /> : <PlusCircle size={15} />}
            {dailyLimitReached ? "Daily limit reached" : "Create Quiz"}
          </button>
        </div>

        {loading && (
          <div className="text-center py-20 text-warm-gray font-dm">
            Loading your quizzes...
          </div>
        )}

        {!loading && quizzes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="font-fraunces font-semibold text-xl text-ink mb-2">
              No quizzes yet
            </h3>
            <p className="text-warm-gray text-sm mb-6 font-dm">
              Create your first quiz in minutes
            </p>
            <button
              onClick={() => navigate("/create")}
              className="bg-amber text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-ink transition-colors font-dm"
            >
              Create your first quiz
            </button>
          </div>
        )}

        {/* Quiz Grid */}
        {!loading && quizzes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-card rounded-2xl p-6 border border-ink/7 hover:shadow-[0_8px_32px_rgba(26,18,8,0.1)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-amber/12 text-amber text-xs font-medium px-2.5 py-1 rounded-full font-dm">
                    {quiz.question_count || 0} questions
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-dm font-medium
                    ${quiz.published ? "bg-sage/12 text-sage" : "bg-ink/8 text-warm-gray"}`}
                  >
                    {quiz.published ? "● Live" : "○ Draft"}
                  </span>
                </div>
                <h3 className="font-fraunces font-semibold text-lg text-ink mb-1 leading-tight">
                  {quiz.title}
                </h3>
                <p className="text-xs text-warm-gray mb-4 font-dm">
                  {new Date(quiz.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/edit/${quiz.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-ink/15 text-ink hover:border-ink transition-colors font-dm"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => { setShareTarget(quiz); setCopied(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-ink/15 text-ink hover:border-amber hover:text-amber transition-colors font-dm"
                  >
                    <Link2 size={12} /> Share
                  </button>
                  <button
                    onClick={() => navigate(`/results/${quiz.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-ink/15 text-ink hover:border-sage hover:text-sage transition-colors font-dm"
                  >
                    <BarChart2 size={12} /> Results
                  </button>
                  <button
                    onClick={() => setDeleteTarget(quiz)}
                    className="flex items-center justify-center py-2 px-3 rounded-lg border border-ink/15 text-warm-gray hover:border-red-300 hover:text-red-500 transition-colors font-dm"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom upgrade CTA */}
        {!isPro && trialActive && quizzes.length > 0 && (
          <div className="mt-10 bg-ink rounded-2xl p-8 text-center">
            <h3 className="font-fraunces font-black text-2xl text-cream mb-2">
              Love QuizCraft?
            </h3>
            <p className="text-white/60 text-sm mb-6 font-dm">
              Upgrade to Pro before your trial ends — unlimited quizzes, PDF
              export &amp; full analytics.
            </p>
            <button
              onClick={() => window.open(CHECKOUT_URL, "_blank")}
              className="bg-amber text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-amber/80 transition-colors font-dm"
            >
              Upgrade to Pro — $8/month
            </button>
          </div>
        )}
      </main>
    </div>
  );
}