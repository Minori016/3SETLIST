import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';
import { QUESTIONS, QuestionOption } from '../data/questions.ts';

interface SurveyViewProps {
  currentQuestionIndex: number;
  answers: Record<number, 'A' | 'B' | 'C'>;
  onSelectOption: (optionKey: 'A' | 'B' | 'C') => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const SurveyView: React.FC<SurveyViewProps> = ({
  currentQuestionIndex,
  answers,
  onSelectOption,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
}) => {
  const question = QUESTIONS[currentQuestionIndex];
  const selectedKey = answers[question.id];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100);

  // Lắng nghe phím A/B/C hoặc 1/2/3
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;
      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') {
        onSelectOption('A');
      } else if (key === 'B' || key === '2') {
        onSelectOption('B');
      } else if (key === 'C' || key === '3') {
        onSelectOption('C');
      } else if (e.key === 'Enter' && selectedKey) {
        if (isLastQuestion) {
          onSubmit();
        } else {
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, selectedKey, isLastQuestion, isSubmitting, onSelectOption, onNext, onSubmit]);

  return (
    <div className="py-6 sm:py-10 max-w-3xl mx-auto px-4 sm:px-6">
      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#713D38] mb-2">
          <span>Câu hỏi {currentQuestionIndex + 1} / {QUESTIONS.length}</span>
          <span>{progressPercent}% hoàn thành</span>
        </div>
        <div className="w-full h-2.5 bg-[#EBEEE8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#CE9893] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-[#FAF5F5] rounded-3xl p-6 sm:p-10 border border-[#EAD4D2] shadow-sm mb-8 transition-all">
        <div className="mb-6">
          <span className="inline-block text-xs uppercase tracking-wider font-semibold text-[#819266] mb-2">
            Câu {question.id}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1F1D] font-bold leading-snug">
            {question.title}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3.5">
          {question.options.map((opt: QuestionOption) => {
            const isSelected = selectedKey === opt.key;

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onSelectOption(opt.key)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 relative group ${
                  isSelected
                    ? 'border-[#CE9893] bg-[#F3E8E7] shadow-sm'
                    : 'border-[#DADFD3] bg-white hover:border-[#CE9893]/60 hover:bg-[#FAF5F5]'
                }`}
              >
                {/* Option Letter Badge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#CE9893] text-[#1F1F1D]'
                      : 'bg-[#EBEEE8] text-[#505B3E] group-hover:bg-[#EAD4D2]'
                  }`}
                >
                  {opt.key}
                </div>

                {/* Pure Option Content */}
                <div className="flex-1 pr-4">
                  <p className="text-sm sm:text-base text-[#1F1F1D] font-medium leading-relaxed">
                    {opt.text}
                  </p>
                </div>

                {/* Selection Indicator */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-[#B96C65] bg-[#B96C65] text-white'
                      : 'border-[#DADFD3] bg-white group-hover:border-[#CE9893]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
            isSubmitting
              ? 'opacity-40 cursor-not-allowed text-[#A4B190]'
              : 'text-[#505B3E] hover:bg-[#EBEEE8] border border-[#DADFD3] cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentQuestionIndex === 0 ? 'Sửa thông tin' : 'Quay lại'}</span>
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!selectedKey || isSubmitting}
            className={`flex items-center gap-2 px-7 py-3 rounded-2xl text-base font-semibold transition-all shadow-md ${
              !selectedKey || isSubmitting
                ? 'opacity-50 cursor-not-allowed bg-[#EAD4D2] text-[#713D38]'
                : 'bg-[#CE9893] hover:bg-[#D5A6A2] active:bg-[#B96C65] text-[#1F1F1D] cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang phân tích kết quả...</span>
              </>
            ) : (
              <>
                <span>Xem kết quả của tôi</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!selectedKey}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-base font-semibold transition-all shadow-md ${
              !selectedKey
                ? 'opacity-50 cursor-not-allowed bg-[#EAD4D2] text-[#713D38]'
                : 'bg-[#CE9893] hover:bg-[#D5A6A2] active:bg-[#B96C65] text-[#1F1F1D] cursor-pointer'
            }`}
          >
            <span>Tiếp tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-6 text-center text-xs text-[#713D38]/80">
        Mẹo: Bạn có thể nhấn phím <kbd className="px-1.5 py-0.5 rounded bg-[#EBEEE8] border border-[#DADFD3] font-mono text-[11px]">A</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-[#EBEEE8] border border-[#DADFD3] font-mono text-[11px]">B</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-[#EBEEE8] border border-[#DADFD3] font-mono text-[11px]">C</kbd> trên bàn phím để chọn nhanh.
      </div>
    </div>
  );
};
