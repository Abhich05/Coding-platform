import React, { useEffect, useState } from "react";
import {
  Flame,
  CheckCircle2,
  Target,
  Trophy,
  Calendar,
  Clock,
  Code,
  Brain,
  Award,
  ShieldCheck,
  AlertCircle,
  Star,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { profileService } from "../../services/profileService";

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
  const { user, metrics, todaysTask, performance, skills, analysis } =
    dashboardData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Read user from localStorage (Zustand-like shape)
        const storedUserRaw = localStorage.getItem("user-storage");

        const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

        // email is nested: { state: { user: { email } } }
        const email = storedUser?.state?.user?.email as string | undefined;
        
        const profile = await profileService.getMyProfile();
        const overview = await dashboardService.getOverviewStats();

        // Name from email only
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
      <div className="min-h-screen flex items-center justify-center bg-[#F2EEE9]">
        <p className="text-[#020F59] font-semibold">
          Loading dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-[#F2EEE9]">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-[#010440] text-white rounded-3xl p-8 border-6 border-[#F25116] shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              {user.name && `Welcome back, ${user.name.split(" ")[0]}!`}
            </h1>
            <p className="text-gray-300">
              Ready to level up your coding skills today?
            </p>
          </div>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border-3 border-[#F25116] shadow-sm flex flex-col justify-between h-40">
            <div className="w-10 h-10 bg-[#F25116] rounded-lg flex items-center justify-center text-white mb-2">
              <Flame size={20} />
            </div>
            <div>
              <span className="text-3xl font-bold text-[#F25116] block">
                {metrics.streak}
              </span>
              <span className="bg-[#F25116]/10 text-[#F25116] text-xs px-2 py-1 rounded-md font-semibold inline-block mt-1">
                Daily Streak
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-3 border-[#020F59] shadow-sm flex flex-col justify-between h-40">
            <div className="w-10 h-10 bg-[#020F59] rounded-lg flex items-center justify-center text-white mb-2">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-3xl font-bold text-[#020F59] block">
                {metrics.solved}
              </span>
              <span className="bg-[#020F59]/10 text-[#020F59] text-xs px-2 py-1 rounded-md font-semibold inline-block mt-1">
                Problem Solved
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-3 border-[#F25116] shadow-sm flex flex-col justify-between h-40">
            <div className="w-10 h-10 bg-[#F25116] rounded-lg flex items-center justify-center text-white mb-2">
              <Target size={20} />
            </div>
            <div>
              <span className="text-3xl font-bold text-[#F25116] block">
                {metrics.accuracy}
              </span>
              <span className="bg-[#F25116]/10 text-[#F25116] text-xs px-2 py-1 rounded-md font-semibold inline-block mt-1">
                Accuracy
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-3 border-[#020F59] shadow-sm flex flex-col justify-between h-40">
            <div className="w-10 h-10 bg-[#020F59] rounded-lg flex items-center justify-center text-white mb-2">
              <Trophy size={20} />
            </div>
            <div>
              <span className="text-3xl font-bold text-[#020F59] block">
                {metrics.globalRank}
              </span>
              <span className="bg-[#020F59]/10 text-[#020F59] text-xs px-2 py-1 rounded-md font-semibold inline-block mt-1">
                Global rank
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-[#F2EEE9] border-3 border-[#020F59] rounded-3xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#020F59]">
                Today&apos;s Task
              </h2>
              <div className="bg-[#8A8BA6]/20 text-[#020F59] px-4 py-1.5 rounded-lg flex items-center gap-2 font-medium text-sm">
                <Calendar size={16} />
                {todaysTask.date}
              </div>
            </div>
            <div className="space-y-4">
              {todaysTask.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg[#F2EEE9] border-3 ${
                    task.status === "active"
                      ? "border-[#F25116] bg-white"
                      : "border-[#020F59]/60"
                  } rounded-2xl p-4 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        task.status === "completed"
                          ? "bg-[#010440]"
                          : "border-2 border-[#8A8BA6]"
                      }`}
                    >
                      {task.status === "completed" && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#020F59] text-lg">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded border ${
                            task.difficulty === "Hard"
                              ? "bg-[#F25116]/10 border-[#F25116] text-[#F25116]"
                              : "bg-[#020F59]/10 border-[#020F59] text-[#020F59]"
                          } font-semibold`}
                        >
                          {task.difficulty}
                        </span>
                        <span className="text-[#8A8BA6] text-xs flex items-center gap-1">
                          <Clock size={12} /> {task.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  {task.status === "active" && (
                    <button className="bg-[#F25116] text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-[#d1400e] transition">
                      Start
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#F2EEE9] border-3 border-[#020F59] rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-10 w-32 h-32 bg-[#F25116]/20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative mb-3">
              <div className="w-24 h-24 bg-[#F25116] rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                {user.avatarInitials}
              </div>
              <div className="absolute bottom-0 right-0 bg-[#010440] p-1 rounded-full border-2 border-white">
                <Star size={14} fill="white" className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-[#020F59]">
              {user.name}
            </h2>
            {user.role && (
              <span className="mt-1 px-3 py-1 border border-[#F25116] text-[#F25116] text-xs rounded-full bg-[#F25116]/5">
                {user.role}
              </span>
            )}

            <div className="flex gap-4 mt-4 mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[#F25116] rounded-lg flex items-center justify-center text-white">
                  <Code size={16} />
                </div>
                <span className="text-[10px] text-[#8A8BA6]">
                  Coder
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[#020F59] rounded-lg flex items-center justify-center text-white">
                  <Brain size={16} />
                </div>
                <span className="text-[10px] text-[#8A8BA6]">
                  Thinker
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-[#F25116] rounded-lg flex items-center justify-center text-white">
                  <Award size={16} />
                </div>
                <span className="text-[10px] text-[#8A8BA6]">
                  Achiever
                </span>
              </div>
            </div>

            <div className="w-full bg-[#020F59]/5 rounded-xl p-4 border border-[#020F59]/10">
              <div className="bg-[#F25116]/20 text-[#020F59] text-xs font-bold py-1 px-2 rounded-md mb-3 inline-block">
                Overall Performance
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-white/50 rounded-md border border-gray-200">
                  <span className="text-[#8A8BA6] text-xs">
                    Problem Solved
                  </span>
                  <span className="font-bold text-[#020F59] text-xs">
                    {user.stats.solved}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-white/50 rounded-md border border-gray-200">
                  <span className="text-[#8A8BA6] text-xs">
                    Success Rate
                  </span>
                  <span className="font-bold text-[#020F59] text-xs">
                    {user.stats.successRate}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-white/50 rounded-md border border-gray-200">
                  <span className="text-[#8A8BA6] text-xs">
                    Practice Hours
                  </span>
                  <span className="font-bold text-[#020F59] text-xs">
                    {user.stats.hours}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Performance & Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-[#F2EEE9] border-3 border-[#F25116] rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-[#020F59] mb-6">
              Performance
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 rounded-2xl p-5 border-3 border-[#F25116] shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={20} className="text-[#F25116]" />
                  <h3 className="font-bold text-[#020F59]">
                    Accuracy Rate
                  </h3>
                </div>
                <div className="space-y-4">
                  {performance.weekly.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs text-[#8A8BA6] mb-1">
                        <span>{item.week}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-[#F2EEE9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F25116] rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 rounded-2xl p-5 border-3 border-[#F25116] shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="rotate-180 flex items-end gap-1 h-5">
                    <div className="w-1 h-2 bg-[#020F59]" />
                    <div className="w-1 h-4 bg-[#020F59]" />
                  </div>
                  <h3 className="font-bold text-[#020F59]">
                    Daily Consistency
                  </h3>
                </div>
                <div className="flex-grow grid grid-cols-5 gap-2">
                  {performance.activityMap.map((active, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square rounded-md ${
                        active ? "bg-[#010440]" : "bg-[#8A8BA6]/40"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-4 bg-[#8A8BA6]/20 py-2 rounded-lg text-center text-xs font-bold text-[#020F59]">
                  {performance.activeDaysCount} active days this month
                </div>
              </div>
            </div>
          </section>
          <section className="bg-[#F2EEE9] border-3 border-[#F25116] rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-[#020F59] mb-4">
              Skills
            </h2>
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-[#020F59]">
                      {skill.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        idx % 2 === 0
                          ? "bg-[#F25116]/20 text-[#F25116]"
                          : "bg-[#020F59]/20 text-[#020F59]"
                      }`}
                    >
                      {skill.percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full border border-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx % 2 === 0
                          ? "bg-[#F25116]"
                          : "bg-[#020F59]"
                      }`}
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-[#F2EEE9] border-3 border-[#020F59] rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-[#020F59]">
            Analysis
          </h2>
          <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#020F59] bg-[#020F59]/10 px-3 py-1 rounded-lg w-fit">
                <ShieldCheck size={16} />
                <span className="text-sm font-bold">
                  Strengths
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.strengths.map((str, i) => (
                  <span
                    key={i}
                    className="bg-[#8A8BA6]/30 text-[#020F59] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#020F59]/20 shadow-sm"
                  >
                    {str}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#F25116] bg-[#F25116]/10 px-3 py-1 rounded-lg w-fit">
                <AlertCircle size={16} />
                <span className="text-sm font-bold">
                  Weakness
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.weaknesses.map((wk, i) => (
                  <span
                    key={i}
                    className="bg-[#F25116]/10 text-[#F25116] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#F25116]/30 shadow-sm"
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
