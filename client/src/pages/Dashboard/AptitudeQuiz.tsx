import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  explanation: string;
}

const AptitudeQuiz: React.FC<{ category: string | null; onBack: () => void }> = ({ category, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questions.json");
        const data = await response.json();
        setQuestions(data);

        if (category) {
          setFilteredQuestions(data.filter((q: Question) => q.category === category));
        } else {
          // Diagnostic: 5 random from each of the 4 categories
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

    // Reshuffle for diagnostic if retaking
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
      if (category) {
        // For practice mode, go back to home instead of showing result
        onBack();
      } else {
        setShowResult(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    filteredQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-400">Loading questions...</p>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    const percentage = (score / filteredQuestions.length) * 100;

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-3xl border border-white/10 max-w-2xl mx-auto">
        <div className="p-4 rounded-full bg-orange-500/20 mb-6">
          <CheckCircle className="w-16 h-16 text-orange-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
        <p className="text-gray-400 mb-8">Here is your performance summary</p>

        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-sm text-gray-500 uppercase mb-1">Score</div>
            <div className="text-4xl font-bold text-white">{score}/{filteredQuestions.length}</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-sm text-gray-500 uppercase mb-1">Accuracy</div>
            <div className="text-4xl font-bold text-orange-500">{percentage.toFixed(0)}%</div>
          </div>
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={handleRetake}
            className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Retake Quiz
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
          >
            Back to Aptitude Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[currentQuestionIdx];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex items-center gap-4">
          {!category && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          )}
          <div className="text-sm text-gray-400">
            Question <span className="text-white font-bold">{currentQuestionIdx + 1}</span> of {filteredQuestions.length}
          </div>
        </div>
      </div>

      <div className="mb-6 h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${((currentQuestionIdx + 1) / filteredQuestions.length) * 100}%` }}
        />
      </div>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 mb-8">
        <div className="inline-block px-3 py-1 rounded-lg bg-orange-500/10 text-orange-500 text-xs font-bold uppercase mb-4">
          {currentQuestion.category}
        </div>
        <h3 className="text-xl font-medium text-white mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${selectedAnswers[currentQuestion.id] === idx
                  ? "bg-orange-500/20 border-orange-500 text-white"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                }`}
            >
              <span className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${selectedAnswers[currentQuestion.id] === idx ? "bg-orange-500 text-white" : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                  }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </span>
              {selectedAnswers[currentQuestion.id] === idx && <CheckCircle className="w-5 h-5 text-orange-500" />}
            </button>
          ))}
        </div>

        {category && selectedAnswers[currentQuestion.id] !== undefined && (
          <div className="mt-8 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-orange-500">Explanation</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIdx === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentQuestionIdx === 0 ? "opacity-30 cursor-not-allowed text-gray-500" : "bg-white/5 hover:bg-white/10 text-white"
            }`}
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/20"
        >
          {currentQuestionIdx === filteredQuestions.length - 1
            ? (category ? "Finish Practice" : "Submit Quiz")
            : "Next Question"} <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AptitudeQuiz;