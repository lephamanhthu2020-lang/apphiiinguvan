import React, { useState, useEffect } from 'react';
import { Grade, ReadingPassage, ReadingQuestion } from '../types';
import { READING_PASSAGES } from '../data/curriculumData';
import {
  FileText,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  Info,
  ChevronRight,
  Send,
} from 'lucide-react';

interface ModeReadingProps {
  grade: Grade;
  customPassages?: ReadingPassage[];
  onSpeakText: (text: string) => void;
  onGetReadingFeedback: (
    passageTitle: string,
    excerpt: string,
    questionText: string,
    questionLevel: string,
    studentAnswer: string
  ) => Promise<string>;
  isLoading: boolean;
  speechSupported: boolean;
  isListening: boolean;
  transcript: string;
  onStartListening: () => void;
  onStopListening: () => void;
}

export const ModeReading: React.FC<ModeReadingProps> = ({
  grade,
  customPassages = [],
  onSpeakText,
  onGetReadingFeedback,
  isLoading,
  speechSupported,
  isListening,
  transcript,
  onStartListening,
  onStopListening,
}) => {
  const allPassages = [...READING_PASSAGES, ...customPassages].filter((p) => p.grade === grade);
  const [selectedPassageId, setSelectedPassageId] = useState<string>('');
  const [activeQuestionId, setActiveQuestionId] = useState<string>('');
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [activeVocab, setActiveVocab] = useState<{ word: string; meaning: string } | null>(null);

  const currentPassage = allPassages.find((p) => p.id === selectedPassageId) || allPassages[0];

  useEffect(() => {
    if (allPassages.length > 0 && (!selectedPassageId || !allPassages.find((p) => p.id === selectedPassageId))) {
      setSelectedPassageId(allPassages[0].id);
      setActiveQuestionId(allPassages[0].questions[0]?.id || '');
      setStudentAnswer('');
      setFeedback('');
    }
  }, [grade, allPassages, selectedPassageId]);

  useEffect(() => {
    if (currentPassage && (!activeQuestionId || !currentPassage.questions.find((q) => q.id === activeQuestionId))) {
      setActiveQuestionId(currentPassage.questions[0]?.id || '');
      setStudentAnswer('');
      setFeedback('');
    }
  }, [currentPassage, activeQuestionId]);

  useEffect(() => {
    if (transcript && isListening) {
      setStudentAnswer(transcript);
    }
  }, [transcript, isListening]);

  const activeQuestion: ReadingQuestion | undefined = currentPassage?.questions.find(
    (q) => q.id === activeQuestionId
  );

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim() || !activeQuestion || !currentPassage || isLoading) return;

    const res = await onGetReadingFeedback(
      currentPassage.title,
      currentPassage.excerpt,
      activeQuestion.text,
      activeQuestion.levelLabel,
      studentAnswer
    );
    setFeedback(res);
  };

  const handleReadPassage = () => {
    if (!currentPassage) return;
    onSpeakText(`Văn bản đọc hiểu: ${currentPassage.title}. ${currentPassage.excerpt}`);
  };

  if (!currentPassage) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl border border-indigo-100">
        <FileText className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Chưa có văn bản đọc hiểu cho Lớp {grade}</h3>
        <p className="text-xs text-slate-500 mt-1">
          Thầy cô có thể thêm ngữ liệu đọc hiểu tùy chọn trong "Góc Giáo viên".
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-violet-50/80 via-indigo-50/40 to-white px-5 py-3 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-violet-600 text-white">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-indigo-950 font-serif-vi">
              Chế độ C: Đọc hiểu văn bản Lớp {grade}
            </h2>
            <p className="text-[11px] text-slate-500">
              Rèn kỹ năng bám sát dẫn chứng & 3 cấp độ: Nhận biết • Thông hiểu • Vận dụng
            </p>
          </div>
        </div>

        {/* Passage Switcher if multiple */}
        {allPassages.length > 1 && (
          <select
            value={currentPassage.id}
            onChange={(e) => {
              setSelectedPassageId(e.target.value);
              setStudentAnswer('');
              setFeedback('');
            }}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700"
          >
            {allPassages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Split Grid: Left = Passage & Vocab, Right = Question & Answer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: Literary Excerpt */}
        <div className="lg:col-span-6 p-4 sm:p-5 overflow-y-auto space-y-3 bg-slate-50/40">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 border border-violet-200 inline-block mb-1">
                {currentPassage.genre}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif-vi">
                {currentPassage.title}
              </h3>
            </div>

            <button
              onClick={handleReadPassage}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-violet-50 text-slate-600 hover:text-violet-700 transition-colors cursor-pointer shrink-0"
              title="Văn AI đọc diễn cảm đoạn trích"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
            {currentPassage.sourceAnnotation}
          </p>

          {/* Excerpt with line numbers */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 font-serif-vi text-sm sm:text-base leading-relaxed text-slate-800 shadow-2xs whitespace-pre-wrap select-text">
            {currentPassage.excerpt}
          </div>

          {/* Vocabulary Annotations */}
          {currentPassage.vocabularyNotes.length > 0 && (
            <div className="p-3 bg-violet-50/70 border border-violet-100 rounded-xl space-y-1.5">
              <span className="text-[11px] font-bold text-violet-900 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-violet-600" />
                Chú thích từ ngữ:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentPassage.vocabularyNotes.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVocab(activeVocab?.word === v.word ? null : v)}
                    className={`text-xs px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                      activeVocab?.word === v.word
                        ? 'bg-violet-600 text-white border-violet-700'
                        : 'bg-white text-slate-700 border-violet-200 hover:bg-violet-100'
                    }`}
                  >
                    {v.word}
                  </button>
                ))}
              </div>
              {activeVocab && (
                <div className="p-2 bg-white rounded-lg text-xs text-slate-700 border border-violet-200 mt-1">
                  <strong>{activeVocab.word}:</strong> {activeVocab.meaning}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: 3-tier Questions & Answer Input */}
        <div className="lg:col-span-6 p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-y-auto">
          {/* Question Selector Tabs */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700">Chọn câu hỏi đọc hiểu:</span>
            <div className="grid grid-cols-3 gap-1.5">
              {currentPassage.questions.map((q, idx) => {
                const isSelected = q.id === activeQuestionId;
                const levelColors = {
                  nhan_biet: isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 border-blue-200',
                  thong_hieu: isSelected ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-700 border-violet-200',
                  van_dung: isSelected ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 border-amber-200',
                }[q.level];

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionId(q.id);
                      setStudentAnswer('');
                      setFeedback('');
                    }}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${levelColors}`}
                  >
                    <span>Câu {idx + 1}: </span>
                    <span className="block text-[10px] font-medium">{q.levelLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Details */}
          {activeQuestion && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white uppercase">
                  {activeQuestion.levelLabel}
                </span>
                <span className="text-xs text-slate-500 font-medium">Bám sát văn bản</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {activeQuestion.text}
              </h4>
              <div className="p-2.5 bg-violet-50/60 rounded-lg text-xs text-violet-900 border border-violet-100 flex items-start gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Gợi ý suy nghĩ:</strong> {activeQuestion.guidePrompt}
                </span>
              </div>
            </div>
          )}

          {/* Student Answer Input Area */}
          <form onSubmit={handleSubmitAnswer} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Câu trả lời của học sinh:
              </label>

              {speechSupported && (
                <button
                  type="button"
                  onClick={isListening ? onStopListening : onStartListening}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-700 border border-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-violet-600" />}
                  <span>{isListening ? 'Dừng nói' : 'Nói câu trả lời'}</span>
                </button>
              )}
            </div>

            <textarea
              rows={3}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="Nhập câu trả lời hoặc trích dẫn từ ngữ từ đoạn trích bên trái..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />

            <button
              type="submit"
              disabled={!studentAnswer.trim() || isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? 'Văn AI đang đối chiếu dẫn chứng...' : 'Nộp câu trả lời & Nhận góp ý'}</span>
            </button>
          </form>

          {/* AI Pedagogical Feedback Display */}
          {feedback && (
            <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-xs sm:text-sm leading-relaxed text-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-violet-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Nhận xét sư phạm từ Văn AI:</span>
              </div>
              <p className="whitespace-pre-wrap select-text">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
