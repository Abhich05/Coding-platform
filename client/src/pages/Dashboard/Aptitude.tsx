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
    { title: "Quantitative Aptitude", icon: <Calculator className="w-5 h-5 text-[var(--accent-strong)]" />, color: "bg-[var(--accent-strong)]/10" },
    { title: "Logical Reasoning", icon: <Brain className="w-5 h-5 text-[var(--accent)]" />, color: "bg-[var(--accent)]/10" },
    { title: "Verbal Ability", icon: <Brain className="w-5 h-5 text-[var(--accent)]" />, color: "bg-[var(--accent)]/10" },
    { title: "Data Interpretation", icon: <Calculator className="w-5 h-5 text-[var(--accent-strong)]" />, color: "bg-[var(--accent-strong)]/10" },
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
    <div className="p-6 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--accent-strong)]/15">
            <Brain className="w-7 h-7 text-[var(--accent-strong)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Aptitude Practice
            </h1>
            <p className="muted-text text-sm">
              Master your logical and numerical skills
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddMode(true)}
            className="btn-solid flex items-center gap-2 text-sm"
          >
            <PlusCircle className="w-5 h-5" />
            Add Question
          </button>
        )}
      </div>

      {/* TOPICS */}
      <div className="grid md:grid-cols-2 gap-5">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            onClick={() => startQuiz(topic.title)}
            className="
              surface-card group cursor-pointer
              hover:border-[var(--accent-strong)]
              hover:scale-[1.01]
              transition-all
              flex items-center justify-between
            "
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${topic.color}`}>
                {topic.icon}
              </div>

              <h3 className="
                font-semibold text-[var(--text-primary)]
                group-hover:text-[var(--accent-strong)]
                transition-colors
              ">
                {topic.title}
              </h3>
            </div>

            <ChevronRight className="w-5 h-5 muted-text group-hover:text-[var(--accent)] transition" />
          </div>
        ))}
      </div>

      {/* QUICK TEST PANEL */}
      <div className="
        surface-panel p-8
        bg-gradient-to-br
        from-[var(--accent)]/10
        to-[var(--accent-strong)]/10
      ">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="max-w-md text-center md:text-left">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Ready for a quick challenge?
            </h2>
            <p className="muted-text text-sm mb-4">
              Take a 10-minute aptitude diagnostic test to identify your strengths.
            </p>

            <button
              onClick={() => startQuiz(null)}
              className="btn-solid px-6 py-2.5 text-sm"
            >
              Start
            </button>
          </div>

          <div className="flex gap-4">
            <div className="card-glass text-center min-w-[100px]">
              <Clock className="w-5 h-5 text-[var(--accent-strong)] mx-auto mb-1" />
              <div className="text-lg font-bold text-[var(--text-primary)]">15m</div>
              <div className="text-[10px] muted-text uppercase">Duration</div>
            </div>

            <div className="card-glass text-center min-w-[100px]">
              <Brain className="w-5 h-5 text-[var(--accent)] mx-auto mb-1" />
              <div className="text-lg font-bold text-[var(--text-primary)]">20</div>
              <div className="text-[10px] muted-text uppercase">Questions</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Aptitude;
