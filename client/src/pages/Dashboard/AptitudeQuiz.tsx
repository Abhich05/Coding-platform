import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const AptitudeQuiz: React.FC<{ category: string | null; onBack: () => void }> = ({ category, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questions.json");
        const data = await response.json();
        setQuestions(data);

        if (category) {
          setFilteredQuestions(data.filter((q: Question) => q.category === category));
        } else {
          const categories = ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation"];
          let diagnosticSet: Question[] = [];
          categories.forEach(cat => {
            const catQuestions = data.filter((q: Question) => q.category === cat);
            const shuffled = [...catQuestions].sort(() => 0.5 - Math.random());
            diagnosticSet = [...diagnosticSet, ...shuffled.slice(0, 5)];
          });
          setFilteredQuestions(diagnosticSet.sort(() => 0.5 - Math.random()));
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !loading && !category) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !category) {
      setShowResult(true);
    }
  }, [timeLeft, showResult, category, loading]);

  const handleRetake = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setShowResult(false);
    setTimeLeft(900);

    if (!category) {
      const categories = ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation"];
      let diagnosticSet: Question[] = [];
      categories.forEach(cat => {
        const catQuestions = questions.filter((q: Question) => q.category === cat);
        const shuffled = [...catQuestions].sort(() => 0.5 - Math.random());
        diagnosticSet = [...diagnosticSet, ...shuffled.slice(0, 5)];
      });
      setFilteredQuestions(diagnosticSet.sort(() => 0.5 - Math.random()));
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [filteredQuestions[currentQuestionIdx].id]: optionIdx
    });
  };

  const handleNext = () => {
    if (currentQuestionIdx < filteredQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      if (category) onBack();
      else setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) setCurrentQuestionIdx(currentQuestionIdx - 1);
  };

  const calculateScore = () => {
    let score = 0;
    filteredQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-12 h-12 text-[var(--accent-strong)] animate-spin mb-4" />
        <p className="muted-text">Loading questions...</p>
      </div>
    );
  }

  /* RESULT SCREEN */
  if (showResult) {
    const score = calculateScore();
    const percentage = (score / filteredQuestions.length) * 100;

    return (
      <div className="surface-panel p-10 max-w-2xl mx-auto text-center">
        <div className="p-4 rounded-full bg-[var(--accent-strong)]/15 inline-block mb-6">
          <CheckCircle className="w-16 h-16 text-[var(--accent-strong)]" />
        </div>

        <h2 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">
          Quiz Completed!
        </h2>
        <p className="muted-text mb-8">Here is your performance summary</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="surface-card text-center">
            <div className="text-sm muted-text uppercase mb-1">Score</div>
            <div className="text-4xl font-bold">{score}/{filteredQuestions.length}</div>
          </div>

          <div className="surface-card text-center">
            <div className="text-sm muted-text uppercase mb-1">Accuracy</div>
            <div className="text-4xl font-bold text-[var(--accent-strong)]">
              {percentage.toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={handleRetake} className="btn-solid w-full py-3">
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Retake Quiz
          </button>

          <button onClick={onBack} className="btn-ghost w-full py-3">
            Back to Aptitude Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-ghost flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex items-center gap-4">
          {!category && (
            <div className="surface-card px-4 py-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent-strong)]" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          )}

          <div className="muted-text text-sm">
            Question <b>{currentQuestionIdx + 1}</b> of {filteredQuestions.length}
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent-strong)] transition-all"
          style={{ width: `${((currentQuestionIdx + 1) / filteredQuestions.length) * 100}%` }}
        />
      </div>

      {/* QUESTION */}
      <div className="surface-panel p-8">
        <div className="inline-block px-3 py-1 rounded-lg bg-[var(--accent-strong)]/10 text-[var(--accent-strong)] text-xs font-bold uppercase mb-4">
          {currentQuestion.category}
        </div>

        <h3 className="text-xl font-medium mb-8">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                selectedAnswers[currentQuestion.id] === idx
                  ? "bg-[var(--accent-strong)]/20 border-[var(--accent-strong)] text-white"
                  : "surface-card hover:border-[var(--accent)]"
              }`}
            >
              <span className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center font-bold bg-[var(--accent)]/20">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </span>

              {selectedAnswers[currentQuestion.id] === idx && (
                <CheckCircle className="w-5 h-5 text-[var(--accent-strong)]" />
              )}
            </button>
          ))}
        </div>

        {category && selectedAnswers[currentQuestion.id] !== undefined && (
          <div className="mt-8 card-glass">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-[var(--accent-strong)]" />
              <span className="font-bold text-[var(--accent-strong)]">
                Explanation
              </span>
            </div>
            <p className="muted-text leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* NAV BUTTONS */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIdx === 0}
          className={`btn-ghost px-6 ${
            currentQuestionIdx === 0 && "opacity-40 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5 inline mr-1" />
          Previous
        </button>

        <button onClick={handleNext} className="btn-solid px-8">
          {currentQuestionIdx === filteredQuestions.length - 1
            ? category ? "Finish Practice" : "Submit Quiz"
            : "Next Question"}
          <ChevronRight className="w-5 h-5 inline ml-1" />
        </button>
      </div>

    </div>
  );
};

export default AptitudeQuiz;
