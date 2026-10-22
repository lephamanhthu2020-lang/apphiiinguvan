import React, { useState, useEffect } from 'react';
import { Grade, WritingPrompt, WritingCritiqueResponse } from '../types';
import { WRITING_PROMPTS } from '../data/curriculumData';
import {
  PenTool,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  RotateCcw,
  BookOpen,
  Send,
  HelpCircle,
} from 'lucide-react';

interface ModeWritingProps {
  grade: Grade;
  customPrompts?: WritingPrompt[];
  onGetWritingCritique: (
    genre: string,
    promptTitle: string,
    promptText: string,
    studentEssay: string
  ) => Promise<WritingCritiqueResponse>;
  isLoading: boolean;
  onPraiseCharacter: () => void;
}

export const ModeWriting: React.FC<ModeWritingProps> = ({
  grade,
  customPrompts = [],
  onGetWritingCritique,
  isLoading,
  onPraiseCharacter,
}) => {
  const allPrompts = [...WRITING_PROMPTS, ...customPrompts].filter((p) => p.grade === grade);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [studentEssay, setStudentEssay] = useState<string>('');
  const [critique, setCritique] = useState<WritingCritiqueResponse | null>(null);

  const currentPrompt = allPrompts.find((p) => p.id === selectedPromptId) || allPrompts[0];

  useEffect(() => {
    if (allPrompts.length > 0 && (!selectedPromptId || !allPrompts.find((p) => p.id === selectedPromptId))) {
      setSelectedPromptId(allPrompts[0].id);
      setStudentEssay('');
      setCritique(null);
    }
  }, [grade, allPrompts, selectedPromptId]);

  // Real-time writing statistics
  const wordCount = studentEssay.trim() ? studentEssay.trim().split(/\s+/).length : 0;
  const charCount = studentEssay.length;
  const paragraphCount = studentEssay.trim() ? studentEssay.split(/\n+/).filter(Boolean).length : 0;

  const handleSubmitEssay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEssay.trim() || !currentPrompt || isLoading) return;

    const res = await onGetWritingCritique(
      currentPrompt.genreLabel,
      currentPrompt.title,
      currentPrompt.prompt,
      studentEssay
    );

    setCritique(res);
    if (res.strengths.length > 0) {
      onPraiseCharacter();
    }
  };

  const handleClear = () => {
    setStudentEssay('');
    setCritique(null);
  };

  if (!currentPrompt) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl border border-indigo-100">
        <PenTool className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Chưa có đề bài luyện viết cho Lớp {grade}</h3>
        <p className="text-xs text-slate-500 mt-1">
          Thầy cô có thể thêm đề bài mới trong "Góc Giáo viên".
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
            <PenTool className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-indigo-950 font-serif-vi">
              Chế độ D: Luyện viết đoạn văn Lớp {grade}
            </h2>
            <p className="text-[11px] text-slate-500">
              Nhận xét 3 mục: Điểm tốt • Điều cần cải thiện • Gợi ý chỉnh 1-2 câu
            </p>
          </div>
        </div>

        {/* Prompt Switcher if multiple */}
        {allPrompts.length > 1 && (
          <select
            value={currentPrompt.id}
            onChange={(e) => {
              setSelectedPromptId(e.target.value);
              setStudentEssay('');
              setCritique(null);
            }}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700"
          >
            {allPrompts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Split Grid: Left = Prompt & Checklist, Right = Editor & Critique */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left Column: Prompt Guidelines & Outlines */}
        <div className="lg:col-span-5 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200 uppercase">
              {currentPrompt.genreLabel}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1.5 font-serif-vi">
              {currentPrompt.title}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed mt-2 p-3 bg-white rounded-xl border border-slate-200">
              {currentPrompt.prompt}
            </p>
          </div>

          {/* GDPT 2018 Guidelines */}
          <div className="p-3.5 bg-violet-50/70 border border-violet-100 rounded-xl space-y-2">
            <span className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-violet-600" />
              Tiêu chí rèn luyện (GDPT 2018):
            </span>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              {currentPrompt.guidelines.map((g, idx) => (
                <li key={idx} className="leading-snug">
                  {g}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Outline Framework */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200/70 rounded-xl space-y-2">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Gợi ý cấu trúc đoạn văn:
            </span>
            <div className="text-xs text-slate-700 space-y-1">
              {currentPrompt.suggestedOutlines.map((o, idx) => (
                <div key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Essay Editor & 3-Part Critique */}
        <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-y-auto">
          {/* Writing Area */}
          <form onSubmit={handleSubmitEssay} className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Khu vực bài viết của học sinh:</span>
              <div className="flex items-center gap-3 text-slate-500 font-medium">
                <span>Số từ: <strong className="text-violet-700">{wordCount}</strong></span>
                <span>Đoạn: <strong>{paragraphCount}</strong></span>
                <span>Kí tự: <strong>{charCount}</strong></span>
              </div>
            </div>

            <textarea
              rows={8}
              value={studentEssay}
              onChange={(e) => setStudentEssay(e.target.value)}
              placeholder="Học sinh bắt đầu viết đoạn văn tại đây. Hãy diễn đạt tự nhiên theo cảm xúc và lí lẽ chân thực của mình..."
              className="w-full p-4 bg-white border border-slate-300 rounded-xl text-sm leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 shadow-inner resize-y font-sans"
            />

            <div className="flex items-center justify-between gap-2">
              {studentEssay.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Viết lại</span>
                </button>
              )}

              <button
                type="submit"
                disabled={wordCount < 10 || isLoading}
                className="ml-auto flex items-center gap-2 py-2.5 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-40 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isLoading ? 'Văn AI đang đọc & thẩm định bài...' : 'Nhận xét 3 mục từ Văn AI'}</span>
              </button>
            </div>
          </form>

          {/* Structured 3-Part Critique Display */}
          {critique && (
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-violet-200 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5 font-serif-vi">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Góp ý sư phạm từ Văn AI</span>
                </h4>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Thẩm định GDPT 2018
                </span>
              </div>

              {/* 1. Điểm tốt */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  1. Điểm tốt của đoạn văn:
                </span>
                <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc">
                  {critique.strengths.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Điều cần cải thiện */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  2. Điều cần lưu ý & cải thiện:
                </span>
                <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc">
                  {critique.improvements.map((imp, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Gợi ý chỉnh 1-2 câu cụ thể */}
              {critique.sentenceEdits && critique.sentenceEdits.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-violet-600" />
                    3. Gợi ý trau chuốt 1 - 2 câu:
                  </span>
                  <div className="space-y-2">
                    {critique.sentenceEdits.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-violet-100 text-xs space-y-1.5 shadow-2xs">
                        <div className="text-slate-500">
                          <span className="font-semibold text-rose-700">Câu gốc: </span>
                          <span className="italic">"{item.original}"</span>
                        </div>
                        <div className="text-slate-800">
                          <span className="font-semibold text-emerald-700">Gợi ý sửa: </span>
                          <span className="font-medium text-indigo-950">"{item.suggested}"</span>
                        </div>
                        <div className="text-[11px] text-violet-700 font-medium">
                          💡 <em>Lí do:</em> {item.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lời động viên sư phạm */}
              {critique.encouragement && (
                <div className="p-3 bg-violet-100/60 rounded-xl text-xs text-violet-950 font-medium italic border border-violet-200">
                  💖 {critique.encouragement}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
