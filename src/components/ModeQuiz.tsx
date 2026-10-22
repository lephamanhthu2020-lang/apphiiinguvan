import React, { useState, useEffect, useMemo } from 'react';
import { Grade, Topic, QuizQuestion } from '../types';
import { QUIZ_DATABASE } from '../data/curriculumData';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  ChevronRight,
  Flame,
  Sparkles,
  BookOpen,
  Mic,
  MicOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModeQuizProps {
  grade: Grade;
  topic: Topic;
  customQuestions?: QuizQuestion[];
  onSpeakText: (text: string) => void;
  onPraiseCharacter: () => void;
  transcript?: string;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  speechSupported?: boolean;
}

export const ModeQuiz: React.FC<ModeQuizProps> = ({
  grade,
  topic,
  customQuestions = [],
  onSpeakText,
  onPraiseCharacter,
  transcript = '',
  isListening = false,
  onStartListening,
  onStopListening,
  speechSupported = false,
}) => {
  // Combine official database and any teacher-created questions
  const availableQuestions = useMemo(() => {
    const combined = [...QUIZ_DATABASE, ...customQuestions];
    const filtered = combined.filter((q) => q.grade === grade);
    // If topic is not 'tong-hop', prioritize topic matching, else fall back to all questions for that grade
    const topicFiltered = topic === 'tong-hop' ? filtered : filtered.filter((q) => q.topic === topic);
    return topicFiltered.length > 0 ? topicFiltered : filtered;
  }, [grade, topic, customQuestions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Voice command detection for A, B, C, D
  useEffect(() => {
    if (!transcript || isAnswered) return;
    const clean = transcript.toLowerCase();
    if (clean.includes('chọn a') || clean.includes('đáp án a') || clean.includes('phương án a') || clean.endsWith(' a')) {
      handleSelectOption('A');
    } else if (clean.includes('chọn b') || clean.includes('đáp án b') || clean.includes('phương án b') || clean.endsWith(' b')) {
      handleSelectOption('B');
    } else if (clean.includes('chọn c') || clean.includes('đáp án c') || clean.includes('phương án c') || clean.endsWith(' c')) {
      handleSelectOption('C');
    } else if (clean.includes('chọn d') || clean.includes('đáp án d') || clean.includes('phương án d') || clean.endsWith(' d')) {
      handleSelectOption('D');
    }
  }, [transcript, isAnswered]);

  // Reset when grade or topic changes
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setSessionCompleted(false);
  }, [grade, topic]);

  const currentQ = availableQuestions[currentIndex];

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(key);
    setIsAnswered(true);

    const isCorrect = key === currentQ.correctOption;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      onPraiseCharacter();

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#6366f1', '#fbbf24', '#34d399'],
        });
      } catch (e) {
        // ignore if not supported
      }

      onSpeakText(`Chính xác! ${currentQ.explanation}`);
    } else {
      setStreak(0);
      onSpeakText(`Chưa đúng rồi em nhé. Đáp án đúng là ${currentQ.correctOption}. ${currentQ.explanation}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < availableQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setSessionCompleted(false);
  };

  const readQuestionAloud = () => {
    if (!currentQ) return;
    const fullText = `Câu hỏi: ${currentQ.question}. Phương án A: ${currentQ.options.A}. Phương án B: ${currentQ.options.B}. Phương án C: ${currentQ.options.C}. Phương án D: ${currentQ.options.D}.`;
    onSpeakText(fullText);
  };

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl border border-indigo-100">
        <HelpCircle className="w-12 h-12 text-slate-400 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Chưa có câu hỏi cho bộ lọc này</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Thầy cô có thể thêm câu hỏi vào "Góc Giáo viên" hoặc chuyển sang chủ đề khác của Lớp {grade}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-violet-50/80 via-indigo-50/40 to-white px-5 py-3 border-b border-indigo-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-violet-600 text-white">
            <Award className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-indigo-950 font-serif-vi">
              Chế độ B: Đố vui Ngữ văn Lớp {grade}
            </h2>
            <p className="text-[11px] text-slate-500">
              Câu {currentIndex + 1} / {availableQuestions.length} • Chuẩn kiến thức GDPT 2018
            </p>
          </div>
        </div>

        {/* Stats: Score & Streak */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đúng: {score}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Chuỗi: {streak}</span>
            </div>
          )}

          <button
            onClick={readQuestionAloud}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 transition-colors cursor-pointer"
            title="Văn AI đọc to câu hỏi và 4 phương án"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between space-y-4">
        {sessionCompleted ? (
          /* Completion Screen */
          <div className="my-auto flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-950 font-serif-vi">
                Hoàn thành lượt Đố vui Lớp {grade}!
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Em đã trả lời đúng <strong>{score}</strong> / <strong>{availableQuestions.length}</strong> câu hỏi.
              </p>
            </div>

            <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl max-w-md text-xs text-violet-900 text-left">
              <strong>Lời khen từ Văn AI:</strong> {score >= availableQuestions.length * 0.8
                ? 'Em nắm kiến thức Ngữ văn rất chắc chắn và có tư duy ngôn ngữ nhanh nhạy! Hãy phát huy ở các bài đọc hiểu và luyện viết nhé.'
                : 'Em đã nỗ lực rất tốt! Ngữ văn là hành trình bồi đắp từng ngày, em có thể làm lại để ghi nhớ sâu sắc hơn nhé.'}
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Thử thách lại lượt này</span>
            </button>
          </div>
        ) : (
          /* Question & Options */
          <>
            {/* Question Text */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider block mb-1">
                Câu hỏi môn Ngữ văn Lớp {grade}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((key) => {
                const text = currentQ.options[key];
                const isSelected = selectedOption === key;
                const isCorrect = key === currentQ.correctOption;

                let cardStyle = 'bg-white hover:bg-violet-50/70 border-slate-200 text-slate-800 hover:border-violet-300';
                if (isAnswered) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300/60';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                  } else {
                    cardStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={key}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(key)}
                    className={`p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer disabled:cursor-default ${cardStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isAnswered && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isAnswered && isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {key}
                    </span>
                    <span className="text-sm font-medium leading-relaxed pt-0.5">{text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Pedagogical feedback banner */}
            {isAnswered && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all ${
                  selectedOption === currentQ.correctOption
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {selectedOption === currentQ.correctOption ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Chính xác! Đáp án đúng là {currentQ.correctOption}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Chưa đúng! Đáp án đúng là phương án {currentQ.correctOption}</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-slate-700">{currentQ.explanation}</p>
                {currentQ.pedagogicalNote && (
                  <p className="mt-2 text-[11px] text-slate-500 italic border-t border-slate-200/60 pt-1.5">
                    💡 <strong>Ghi chú GDPT 2018:</strong> {currentQ.pedagogicalNote}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Action Footer */}
      {!sessionCompleted && (
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {speechSupported && onStartListening && onStopListening && (
              <button
                type="button"
                onClick={isListening ? onStopListening : onStartListening}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-300'
                }`}
                title="Bấm và nói: 'Chọn A', 'Chọn B', 'Đáp án C', 'D'"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-violet-600" />}
                <span>{isListening ? 'Đang nghe...' : 'Nói đáp án'}</span>
              </button>
            )}

            <span className="text-xs text-slate-500">
              Bấm chọn hoặc bật mic nói: <em>"Chọn A", "Đáp án C"...</em>
            </span>
          </div>

          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer ml-auto"
            >
              <span>{currentIndex + 1 < availableQuestions.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
