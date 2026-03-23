import React from 'react';
import {
  Target,
  Trophy,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import Hero from '../Hero';
import PlatformHighlights from '../PlatformHighlights';

const OverviewPage: React.FC = () => {
  const stats = [
    { label: 'Problems Solved', value: '1,247', icon: Target, change: '+12%', color: 'text-emerald-400' },
    { label: 'Current Streak', value: '45 days', icon: Trophy, change: 'Personal best', color: 'text-[#F25116]' },
    { label: 'Global Rank', value: '#2,487', icon: TrendingUp, change: '↑ 124 spots', color: 'text-sky-400' },
    { label: 'Active Contests', value: '8', icon: Users, change: 'Join now', color: 'text-violet-400' },
  ];

  const trendingProblems = [
    { title: 'Two Sum', difficulty: 'Easy', submissions: '2.4M', acceptance: '45%' },
    { title: 'Reverse Linked List', difficulty: 'Medium', submissions: '1.8M', acceptance: '62%' },
    { title: 'Merge Intervals', difficulty: 'Medium', submissions: '1.2M', acceptance: '38%' },
  ];

  const upcomingContests = [
    { title: 'Weekly Challenge #45', date: 'Dec 15, 2025', time: '2:00 PM', prize: '$1,000' },
    { title: 'AI Hackathon', date: 'Dec 20, 2025', time: '10:00 AM', prize: '$5,000' },
    { title: 'New Year Special', date: 'Jan 1, 2026', time: '12:00 PM', prize: 'Premium Subscription' },
  ];

  return (
    <div className="space-y-8">
      <Hero />

      {/* Stats row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl bg-[#020f59] border border-white/10 p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#010440] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#F2EEE9]" />
                  </div>
                  <span className="text-xs text-[#8A8BA6]">{stat.label}</span>
                </div>
                <Clock className="w-3 h-3 text-[#8A8BA6]" />
              </div>
              <p className="text-lg font-semibold text-[#F2EEE9]">{stat.value}</p>
              <p className={`mt-1 text-[11px] ${stat.color}`}>{stat.change}</p>
            </div>
          );
        })}
      </section>

      {/* Trending & contests */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Trending problems */}
        <div className="lg:col-span-2 rounded-2xl bg-[#020f59] border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#F2EEE9]">
                Trending problems
              </h2>
              <p className="text-xs text-[#8A8BA6]">
                Pick a problem and keep your streak alive.
              </p>
            </div>
            <button className="inline-flex items-center text-xs font-medium text-[#F25116] hover:text-[#F2EEE9]">
              View problem set
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {trendingProblems.map(problem => (
              <div
                key={problem.title}
                className="rounded-xl bg-[#010440] border border-white/10 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-[#F2EEE9]">
                    {problem.title}
                  </p>
                  <p className="text-[11px] text-[#8A8BA6]">
                    {problem.submissions} submissions • {problem.acceptance} acceptance
                  </p>
                </div>
                <div className="flex flex-col items-end text-[11px]">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      problem.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                  <button className="mt-2 inline-flex items-center text-xs text-[#F25116] hover:text-[#F2EEE9]">
                    Solve now
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming contests */}
        <div className="rounded-2xl bg-[#020f59] border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#F2EEE9]">
                Upcoming contests
              </h2>
              <p className="text-xs text-[#8A8BA6]">
                Reserve your spot in the next live event.
              </p>
            </div>
            <Calendar className="w-4 h-4 text-[#8A8BA6]" />
          </div>

          <div className="space-y-3">
            {upcomingContests.map(contest => (
              <div
                key={contest.title}
                className="rounded-xl bg-[#010440] border border-white/10 px-4 py-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#F2EEE9]">
                      {contest.title}
                    </p>
                    <p className="text-[11px] text-[#8A8BA6]">
                      {contest.date} • {contest.time}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#F25116]">
                    {contest.prize}
                  </span>
                </div>
                <button className="mt-2 inline-flex items-center text-xs text-[#F2EEE9] hover:text-[#F25116]">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PlatformHighlights />
    </div>
  );
};

export default OverviewPage;
