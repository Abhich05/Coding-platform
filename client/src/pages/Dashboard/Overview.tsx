import React, { useEffect, useState } from "react";
import {
  Flame,
  CheckCircle2,
  Target,
  Trophy,
  Calendar,
  Clock,
  Code,
  Award,
  ShieldCheck,
  AlertCircle,
  Star,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { profileService } from "../../services/profileService";
import { useNavigate } from "react-router-dom";

// Helper: email -> nice name
const getNameFromEmail = (email?: string): string => {
  if (!email) return "Guest";

  const raw = email.split("@")[0];

  const parts = raw
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean);

  if (parts.length === 0) return "Guest";

  return parts
    .map(
      (p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
    )
    .join(" ");
};

// Types
interface Task {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  status: "completed" | "active" | "locked";
  iconType: "circle" | "dot";
}

interface Skill {
  name: string;
  percentage: number;
}

interface WeeklyPerformance {
  week: string;
  percentage: number;
}

interface DashboardData {
  user: {
    name: string;
    role: string;
    rank: number;
    avatarInitials: string;
    badges: { icon: string; label: string }[];
    stats: {
      solved: string;
      successRate: string;
      hours: string;
    };
  };
  metrics: {
    streak: number;
    solved: number;
    accuracy: string;
    globalRank: string;
  };
  todaysTask: {
    date: string;
    tasks: Task[];
  };
  performance: {
    weekly: WeeklyPerformance[];
    activityMap: boolean[];
    activeDaysCount: number;
  };
  skills: Skill[];
  analysis: {
    strengths: string[];
    weaknesses: string[];
  };
}

const initialDashboardData: DashboardData = {
  user: {
    name: "",
    role: "",
    rank: 0,
    avatarInitials: "",
    badges: [
      { icon: "code", label: "Coder" },
      { icon: "brain", label: "Thinker" },
      { icon: "cup", label: "Achiever" },
    ],
    stats: {
      solved: "0/0",
      successRate: "0%",
      hours: "0 hrs",
    },
  },
  metrics: { streak: 0, solved: 0, accuracy: "0%", globalRank: "#0" },
  todaysTask: { date: new Date().toDateString(), tasks: [] },
  performance: { weekly: [], activityMap: [], activeDaysCount: 0 },
  skills: [],
  analysis: { strengths: [], weaknesses: [] },
};

const Overview: React.FC = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData);
  const [isLoading, setIsLoading] = useState(true);

  // ⭐ NEW STATE FOR TEST ENTRY
  const [testCode, setTestCode] = useState("");
  const [testEntryError, setTestEntryError] = useState("");
  const navigate = useNavigate();

  const handleStartTest = () => {
    if (!testCode.trim()) {
      setTestEntryError("Please enter a valid test code before continuing.");
      return;
    }
    setTestEntryError("");
    navigate(`/test/${testCode}`);
  };

  const { user, metrics, todaysTask, performance, skills, analysis } =
    dashboardData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserRaw = localStorage.getItem("user-storage");
        const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

        const email =
          storedUser?.email ||
          storedUser?.user?.email ||
          storedUser?.state?.user?.email ||
          undefined;

        const profile = await profileService.getMyProfile();
        const overview = await dashboardService.getOverviewStats();

        const name = getNameFromEmail(email);
        const role: string = profile?.bio || "";

        const initials: string = name
          ? name
            .split(" ")
            .filter(Boolean)
            .map((p: string) => p[0])
            .join("")
            .toUpperCase()
          : "G";

        const solvedCount = overview.solvedCount ?? 0;
        const totalProblems = overview.totalProblems ?? solvedCount;

        const updated: DashboardData = {
          user: {
            name,
            role,
            rank: overview.globalRank ?? 0,
            avatarInitials: initials,
            badges: initialDashboardData.user.badges,
            stats: {
              solved: `${solvedCount}/${totalProblems}`,
              successRate: `${overview.accuracy ?? 0}%`,
              hours: `${overview.practiceHours ?? 0} hrs`,
            },
          },
          metrics: {
            streak: overview.streak ?? 0,
            solved: solvedCount,
            accuracy: `${overview.accuracy ?? 0}%`,
            globalRank: `#${overview.globalRank ?? 0}`,
          },
          todaysTask: {
            date: overview.todayDate || new Date().toDateString(),
            tasks: overview.todayTasks || [],
          },
          performance: {
            weekly: overview.weeklyAccuracy || [],
            activityMap: overview.activityMap || [],
            activeDaysCount: overview.activeDaysCount || 0,
          },
          skills: (profile.skills || []).map((s: string, idx: number) => ({
            name: s,
            percentage:
              overview.skillPercentages?.[s] ??
              (70 + (idx * 5) % 25),
          })),
          analysis: {
            strengths: overview.strengths || [],
            weaknesses: overview.weaknesses || [],
          },
        };

        setDashboardData(updated);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-10">
        <div className="surface-card px-6 py-4 text-sm muted-text">Loading dashboard...</div>
      </div>
    );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <header className="surface-card-dark p-8 relative overflow-hidden border border-[var(--border)]">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">
              {user.name && `Welcome back, ${user.name.split(" ")[0]}!`}
            </h1>
            <p className="text-[var(--text-secondary)]">
              Ready to level up your coding skills today?
            </p>
          </div>
        </header>

        {/* ⭐⭐⭐ TEST ENTRY SECTION */}
        <section className="surface-card">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Placement Test Access
          </h2>

          {testEntryError && (
            <div className="status-card error mb-4" role="status" aria-live="polite">
              {testEntryError}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">

            {/* Input */}
            <input
              value={testCode}
              onChange={(e) => setTestCode(e.target.value)}
              placeholder="Enter Test Code"
              className="input-field flex-1"
            />

            {/* Button */}
            <button
              onClick={handleStartTest}
              className="btn-solid"
            >
              Start Test
            </button>

          </div>
        </section>


        {/* REST OF YOUR ORIGINAL CODE CONTINUES EXACTLY SAME BELOW */}




        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="surface-card p-6 flex flex-col justify-between h-40 border border-[var(--accent-strong)]">
            <div className="w-10 h-10 bg-[var(--accent-strong)] rounded-lg flex items-center justify-center text-white mb-2">
              <Flame size={20} />
            </div>
            <div>
              <span className="text-3xl font-bold text-[var(--accent-strong)] block">
                {metrics.streak}
              </span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent-strong)] text-xs px-2 py-1 rounded-md font-semibold inline-block mt-1">
                Daily Streak
              </span>
            </div>
          </div>
          <div className="surface-card p-6 flex flex-col justify-between h-40 border border-[var(--border)]">
            <div className="w-10 h-10 bg-[var(--border)] rounded-lg flex items-center justify-center text-white mb-2">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-3xl font-bold text-[var(--text-primary)] block">
                {metrics.solved}
              </span>
              <span className="bg-[var(--border)]/20 text-[var(--text-primary)] text-xs px-2 py-1 rounded-md font-semibold inline-block mt-1">
                Problem Solved
              </span>
            </div>
          </div>
          <div className="surface-card p-6 flex flex-col justify-between h-40 border border-[var(--accent-strong)]">
            <div className="w-10 h-10 bg-[var(--accent-strong)] rounded-lg flex items-center justify-center text-white mb-2">
              <Target size={20} />
            </div>
            <div>
              <span className="text-3xl font-bold text-[var(--accent-strong)] block">
                {metrics.accuracy}
              </span>
              <span className="bg-[var(--accent)]/20 text-[var(--accent-strong)] text-xs px-2 py-1 rounded-md font-semibold inline-block mt-1">
                Accuracy
              </span>
            </div>
          </div>
          <div className="surface-card p-6 flex flex-col justify-between h-40 border border-[var(--border)]">
            <div className="w-10 h-10 bg-[var(--border)] rounded-lg flex items-center justify-center text-white mb-2">
              <Trophy size={20} />
            </div>
            <div>
              <span className="text-3xl font-bold text-[var(--text-primary)] block">
                {metrics.globalRank}
              </span>
              <span className="bg-[var(--border)]/20 text-[var(--text-primary)] text-xs px-2 py-1 rounded-md font-semibold inline-block mt-1">
                Global rank
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 surface-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Today&apos;s Task
              </h2>
              <div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] px-4 py-1.5 rounded-lg flex items-center gap-2 font-medium text-sm border border-[var(--border)]">
                <Calendar size={16} />
                {todaysTask.date}
              </div>
            </div>
            <div className="space-y-4">
              {todaysTask.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`surface-card border-2 ${task.status === "active"
                    ? "border-[var(--accent-strong)]"
                    : "border-[var(--border)]"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${task.status === "completed"
                          ? "bg-[var(--accent-strong)]"
                          : "border-2 border-[var(--border)]"
                          }`}
                      >
                        {task.status === "completed" && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] text-lg">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${task.difficulty === "Hard"
                              ? "bg-[var(--error-bg)] text-[var(--text-primary)]"
                              : "bg-[var(--border)]/20 border-[var(--border)] text-[var(--text-primary)]"
                              } font-semibold`}
                          >
                            {task.difficulty}
                          </span>
                          <span className="text-[var(--text-secondary)] text-xs flex items-center gap-1">
                            <Clock size={12} /> {task.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    {task.status === "active" && (
                      <button className="btn-solid text-xs">
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-10 w-32 h-32 bg-[var(--accent-strong)]/20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative mb-3">
              <div className="w-24 h-24 bg-[var(--accent-strong)] rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-[var(--bg-primary)] shadow-lg">
                {user.avatarInitials}
              </div>
              <div className="absolute bottom-0 right-0 bg-[var(--border)] p-1 rounded-full border-2 border-[var(--bg-primary)]">
                <Star size={14} fill="currentColor" className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {user.name}
            </h2>
            {user.role && (
              <span className="mt-1 px-3 py-1 border border-[var(--accent-strong)] text-[var(--accent-strong)] text-xs rounded-full bg-[var(--accent)]/10">
                {user.role}
              </span>
            )}

            <div className="flex gap-4 mt-4 mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[var(--accent-strong)] rounded-lg flex items-center justify-center text-white">
                  <Code size={16} />
                </div>
                <span className="text-[10px] muted-text">
                  Coder
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[var(--border)] rounded-lg flex items-center justify-center text-white">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-[10px] muted-text">
                  Thinker
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[var(--accent-strong)] rounded-lg flex items-center justify-center text-white">
                  <Award size={16} />
                </div>
                <span className="text-[10px] muted-text">
                  Achiever
                </span>
              </div>
            </div>

            <div className="w-full bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border)]">
              <div className="bg-[var(--accent)]/40 text-[var(--text-primary)] text-xs font-bold py-1 px-2 rounded-md mb-3 inline-block">
                Overall Performance
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-[var(--bg-primary)] rounded-md border border-[var(--border)]">
                  <span className="muted-text text-xs">
                    Problem Solved
                  </span>
                  <span className="font-bold text-[var(--text-primary)] text-xs">
                    {user.stats.solved}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-[var(--bg-primary)] rounded-md border border-[var(--border)]">
                  <span className="muted-text text-xs">
                    Success Rate
                  </span>
                  <span className="font-bold text-[var(--text-primary)] text-xs">
                    {user.stats.successRate}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-[var(--bg-primary)] rounded-md border border-[var(--border)]">
                  <span className="muted-text text-xs">
                    Practice Hours
                  </span>
                  <span className="font-bold text-[var(--text-primary)] text-xs">
                    {user.stats.hours}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Performance & Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 surface-card">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              Performance
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 rounded-2xl p-5 border border-[var(--accent-strong)]">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={20} className="text-[var(--accent-strong)]" />
                  <h3 className="font-bold text-[var(--text-primary)]">
                    Accuracy Rate
                  </h3>
                </div>
                <div className="space-y-4">
                  {performance.weekly.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs muted-text mb-1">
                        <span>{item.week}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent-strong)] rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 rounded-2xl p-5 border border-[var(--accent-strong)] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="rotate-180 flex items-end gap-1 h-5">
                    <div className="w-1 h-2 bg-[var(--accent-strong)]" />
                    <div className="w-1 h-4 bg-[var(--accent-strong)]" />
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)]">
                    Daily Consistency
                  </h3>
                </div>
                <div className="flex-grow grid grid-cols-5 gap-2">
                  {performance.activityMap.map((active, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square rounded-md ${active ? "bg-[var(--accent-strong)]" : "bg-[var(--border)]"}`}
                    />
                  ))}
                </div>
                <div className="mt-4 bg-[var(--bg-secondary)] py-2 rounded-lg text-center text-xs font-bold muted-text">
                  {performance.activeDaysCount} active days this month
                </div>
              </div>
            </div>
          </section>
          <section className="surface-card">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Skills
            </h2>
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {skill.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[var(--accent)]/20 text-[var(--text-primary)]">
                      {skill.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full border border-[var(--border)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent-strong)]"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="surface-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Analysis
          </h2>
          <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[var(--text-primary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-lg w-fit">
                <ShieldCheck size={16} />
                <span className="text-sm font-bold">
                  Strengths
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.strengths.map((str, i) => (
                  <span
                    key={i}
                    className="bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--border)] shadow-sm"
                  >
                    {str}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[var(--error-text)] bg-[var(--error-bg)] px-3 py-1 rounded-lg w-fit">
                <AlertCircle size={16} />
                <span className="text-sm font-bold">
                  Weakness
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.weaknesses.map((wk, i) => (
                  <span
                    key={i}
                    className="bg-[var(--error-bg)] text-[var(--error-text)] text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--error-bg)] shadow-sm"
                  >
                    {wk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Overview;
