import { useState } from "react";
import type { FC } from "react";
import { Brain, Calculator, Clock, ChevronRight, PlusCircle } from "lucide-react";
import AptitudeQuiz from "./AptitudeQuiz";
import { useUserStore } from "../../store/useUserStore";
import AddQuestionForm from "./AddQuestionForm";

const Aptitude: FC = () => {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const topics = [
    { title: "Quantitative Aptitude", icon: <Calculator className="w-5 h-5 text-orange-400" />, color: "bg-orange-400/10" },
    { title: "Logical Reasoning", icon: <Brain className="w-5 h-5 text-blue-400" />, color: "bg-blue-400/10" },
    { title: "Verbal Ability", icon: <Brain className="w-5 h-5 text-green-400" />, color: "bg-green-400/10" },
    { title: "Data Interpretation", icon: <Calculator className="w-5 h-5 text-purple-400" />, color: "bg-purple-400/10" },
  ];

  const startQuiz = (category: string | null = null) => {
    setSelectedCategory(category);
    setIsQuizMode(true);
    setIsAddMode(false);
  };

  if (isQuizMode) {
    return (
      <div className="p-6">
        <AptitudeQuiz 
          category={selectedCategory} 
          onBack={() => {
            setIsQuizMode(false);
            setSelectedCategory(null);
          }} 
        />
      </div>
    );
  }

  if (isAddMode) {
    return (
      <div className="p-6">
        <AddQuestionForm onClose={() => setIsAddMode(false)} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/20">
            <Brain className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Aptitude Practice</h1>
            <p className="text-gray-400 text-sm">Master your logical and numerical skills</p>
          </div>
        </div>

        {isAdmin && (
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 self-start md:self-center"
            onClick={() => setIsAddMode(true)}
          >
            <PlusCircle className="w-5 h-5" />
            Add Question
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic, idx) => (
          <div 
            key={idx}
            onClick={() => startQuiz(topic.title)}
            className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${topic.color}`}>
                {topic.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                  {topic.title}
                </h3>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-white mb-2 text-center md:text-left">Ready for a quick challenge?</h2>
            <p className="text-gray-400 text-sm mb-4 text-center md:text-left">Take a 10-minute aptitude diagnostic test to identify your strengths and weaknesses.</p>
            <div className="flex justify-center md:justify-start">
              <button 
                onClick={() => startQuiz(null)}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-lg shadow-orange-500/20"
              >
                Start
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5 min-w-[100px]">
              <Clock className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <div className="text-lg font-bold">15m</div>
              <div className="text-[10px] text-gray-500 uppercase">Duration</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5 min-w-[100px]">
              <Brain className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-lg font-bold">20</div>
              <div className="text-[10px] text-gray-500 uppercase">Questions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aptitude;
