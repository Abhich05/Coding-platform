import React from 'react';
import { ArrowRight, Database, Cpu, Globe, Shield } from 'lucide-react';

const PlatformHighlights: React.FC = () => {
  const categories = [
    { name: 'Algorithms', count: 450, icon: Cpu, color: 'bg-[#020f59] text-[#F2EEE9]' },
    { name: 'Data Structures', count: 320, icon: Database, color: 'bg-[#010440] text-[#F2EEE9]' },
    { name: 'Web Development', count: 280, icon: Globe, color: 'bg-[#020f59] text-[#F2EEE9]' },
    { name: 'Artificial Intelligence', count: 180, icon: Cpu, color: 'bg-[#010440] text-[#F2EEE9]' },
    { name: 'System Design', count: 150, icon: Shield, color: 'bg-[#020f59] text-[#F2EEE9]' },
    { name: 'Database', count: 220, icon: Database, color: 'bg-[#010440] text-[#F2EEE9]' },
  ];

  const learningPaths = [
    { title: 'Beginner Track', description: 'Start your coding journey', level: 'Beginner', topics: 12, duration: '4 weeks' },
    { title: 'Interview Prep', description: 'Ace your technical interviews', level: 'Intermediate', topics: 24, duration: '8 weeks' },
    { title: 'Advanced Algorithms', description: 'Master complex algorithms', level: 'Advanced', topics: 36, duration: '12 weeks' },
  ];

  return (
    <section className="mt-8 space-y-8">
      {/* Categories */}
      <div className="rounded-2xl bg-[#010440] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#F2EEE9]">
              Explore problem categories
            </h2>
            <p className="text-xs text-[#8A8BA6]">
              Practice problems with detailed solutions, curated by difficulty and topic.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="flex items-center gap-3 rounded-xl bg-[#020f59] border border-white/10 px-3 py-3"
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#F2EEE9]">{cat.name}</p>
                  <p className="text-[11px] text-[#8A8BA6]">{cat.count}+ problems</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning paths */}
      <div className="rounded-2xl bg-[#020f59] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#F2EEE9]">
              Guided learning paths
            </h2>
            <p className="text-xs text-[#8A8BA6]">
              Structured roadmaps to keep you accountable and interview‑ready.
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center text-xs font-medium text-[#F25116] hover:text-[#F2EEE9]">
            View all paths
            <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {learningPaths.map(path => (
            <div
              key={path.title}
              className="rounded-xl bg-[#010440] border border-white/10 p-4 flex flex-col justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-[#F2EEE9]">{path.title}</p>
                <p className="mt-1 text-xs text-[#8A8BA6]">{path.description}</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#8A8BA6]">
                <span>{path.level}</span>
                <span>{path.topics} topics</span>
                <span>{path.duration}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full sm:hidden inline-flex items-center justify-center gap-1 text-xs font-medium text-[#F25116] hover:text-[#F2EEE9]">
          View all paths
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
};

export default PlatformHighlights;
