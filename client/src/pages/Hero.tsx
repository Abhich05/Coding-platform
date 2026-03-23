import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#010440] via-[#020f59] to-[#020f59] text-[#F2EEE9] p-6 sm:p-8 lg:p-10">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-[#F25116] blur-3xl absolute -top-16 -right-10" />
        <div className="w-72 h-72 rounded-full bg-[#8A8BA6] blur-3xl absolute -bottom-24 -left-16" />
      </div>

      <div className="relative flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#010440] border border-white/10 px-3 py-1 text-xs font-medium text-[#F2EEE9] mb-4">
            <Globe className="w-4 h-4 text-[#F25116]" />
            <span>CodePlatform • For Developers, By Developers</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight mb-3">
            Practice coding, prepare for interviews, and compete with the best.
          </h1>
          <p className="text-sm sm:text-base text-[#D4D4E0] max-w-xl mb-6">
            Build consistent problem‑solving habits with curated challenges,
            real‑world interview questions, and live contests designed for modern developers.
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <button className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#F25116] text-[#F2EEE9] hover:bg-[#ff6a33] transition-colors shadow-lg">
              Start practicing now
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/20 text-[#F2EEE9] hover:bg-[#010440] transition-colors">
              View upcoming contests
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#8A8BA6]">
            <span>• Daily practice goals</span>
            <span>• Company‑tagged problems</span>
            <span>• Real‑time leaderboards</span>
          </div>
        </div>

        <div className="flex-1 w-full lg:max-w-sm">
          <div className="rounded-2xl bg-[#010440] border border-white/10 p-4 text-xs text-[#F2EEE9]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Today&apos;s snapshot</span>
              <span className="text-[#8A8BA6]">UTC</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-[#020f59] border border-white/5 p-3">
                <p className="text-[11px] text-[#8A8BA6] mb-1">Problems solved</p>
                <p className="text-lg font-semibold">8</p>
              </div>
              <div className="rounded-lg bg-[#020f59] border border-white/5 p-3">
                <p className="text-[11px] text-[#8A8BA6] mb-1">Streak</p>
                <p className="text-lg font-semibold text-[#F25116]">14 days</p>
              </div>
              <div className="rounded-lg bg-[#020f59] border border-white/5 p-3">
                <p className="text-[11px] text-[#8A8BA6] mb-1">Rank</p>
                <p className="text-lg font-semibold">#2,487</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-[#8A8BA6]">
              Join millions of developers practicing coding, preparing for interviews, and competing in global contests.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
