import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface AddQuestionFormProps {
  onClose: () => void;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    category: 'Quantitative Aptitude',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  });

  const categories = [
    'Quantitative Aptitude',
    'Logical Reasoning',
    'Verbal Ability',
    'Data Interpretation',
  ];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.question.trim() || formData.options.some(opt => !opt.trim()) || !formData.explanation.trim()) {
      alert('Please fill in all fields including explanation');
      return;
    }

    console.log('New Question Data:', formData);
    alert('Question added successfully! (Frontend Simulation)');
    onClose();
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Plus className="w-6 h-6 text-orange-500" />
          Add New Question
        </h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-navy text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Question Text</label>
          <textarea
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="Enter the question here..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors min-h-[100px] resize-y"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-400">Options (Select the correct one)</label>
          {formData.options.map((option, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, correctAnswer: idx })}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all shrink-0 ${
                  formData.correctAnswer === idx
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/5 text-gray-500 hover:text-white border border-white/10'
                }`}
                title="Mark as correct answer"
              >
                {String.fromCharCode(65 + idx)}
              </button>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Explanation</label>
          <textarea
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            placeholder="Explain why the correct answer is right..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors min-h-[100px] resize-y"
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Save className="w-5 h-5" />
            Save Question
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionForm;
