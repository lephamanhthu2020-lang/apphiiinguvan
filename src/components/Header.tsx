import React from 'react';
import { Grade, Topic, AppMode } from '../types';
import { TOPIC_LABELS } from '../data/curriculumData';
import {
  BookOpen,
  HelpCircle,
  Award,
  FileText,
  PenTool,
  Network,
  GraduationCap,
  Tv,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
  currentTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isAiConnected: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenTeacherPanel: () => void;
  onOpenSafetyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGrade,
  onSelectGrade,
  currentTopic,
  onSelectTopic,
  currentMode,
  onSelectMode,
  isAiConnected,
  isFullscreen,
  onToggleFullscreen,
  onOpenTeacherPanel,
  onOpenSafetyModal,
}) => {
  const modes: { id: AppMode; label: string; icon: React.ReactNode; shortLabel: string }[] = [
    { id: 'qa', label: '1. Hỏi đáp Ngữ văn', shortLabel: 'Hỏi đáp', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'quiz', label: '2. Đố vui & Thử thách', shortLabel: 'Đố vui', icon: <Award className="w-4 h-4" /> },
    { id: 'reading', label: '3. Đọc hiểu văn bản', shortLabel: 'Đọc hiểu', icon: <FileText className="w-4 h-4" /> },
    { id: 'writing', label: '4. Luyện viết đoạn văn', shortLabel: 'Luyện viết', icon: <PenTool className="w-4 h-4" /> },
    { id: 'mindmap', label: '5. Sơ đồ tư duy', shortLabel: 'Sơ đồ', icon: <Network className="w-4 h-4" /> },
  ];

  return (
    <header className="w-full bg-white border-b border-indigo-100 shadow-xs sticky top-0 z-40">
      {/* Top Banner: Brand, Grade selector, Status & Classroom tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-indigo-950 tracking-tight flex items-center gap-1.5 font-serif-vi">
                <span>VĂN AI</span>
                <span className="text-[11px] font-sans font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                  THCS
                </span>
              </h1>
            </div>
            <p className="text-[11px] font-medium text-slate-500 -mt-0.5">
              TRỢ GIẢNG NGỮ VĂN GDPT 2018 (LỚP 6–9)
            </p>
          </div>
        </div>

        {/* Grade Selection Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-500 px-2 hidden sm:inline">Khối:</span>
          {([6, 7, 8, 9] as Grade[]).map((grade) => (
            <button
              key={grade}
              onClick={() => onSelectGrade(grade)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                currentGrade === grade
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-900 hover:bg-slate-200/60'
              }`}
            >
              Lớp {grade}
            </button>
          ))}
        </div>

        {/* Right Tools & Indicators */}
        <div className="flex items-center gap-2">
          {/* Connection Mode Indicator */}
          <div
            title={
              isAiConnected
                ? 'Đã kết nối AI theo lượt (Gemini API server-side). Không phải Live giả.'
                : 'Chế độ Giáo trình minh họa GDPT 2018 (Demo độc lập, không cần API Key).'
            }
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isAiConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isAiConnected ? 'AI Theo lượt' : 'Chế độ Minh hoạ'}</span>
          </div>

          {/* Teacher Panel Button */}
          <button
            onClick={onOpenTeacherPanel}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/80 transition-all cursor-pointer"
            title="Mở bảng điều khiển dành riêng cho Giáo viên"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Góc Giáo viên</span>
          </button>

          {/* Classroom 16:9 Presentation Toggle */}
          <button
            onClick={onToggleFullscreen}
            className={`p-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-violet-600 text-white border-violet-700'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
            title="Chế độ trình chiếu máy chiếu lớp học (16:9)"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Safety & Student Data Info */}
          <button
            onClick={onOpenSafetyModal}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all cursor-pointer"
            title="Chính sách bảo vệ an toàn học sinh & bản quyền dữ liệu"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* Mode Navigation & Topic Strip */}
      <div className="bg-gradient-to-r from-violet-50/50 via-slate-50 to-indigo-50/50 border-t border-slate-200/60 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          {/* Five Main Modes */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {modes.map((m) => {
              const isActive = currentMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-sm ring-2 ring-violet-400/40'
                      : 'bg-white text-slate-700 hover:bg-violet-50/80 hover:text-violet-900 border border-slate-200/80'
                  }`}
                >
                  {m.icon}
                  <span className="hidden lg:inline">{m.label}</span>
                  <span className="lg:hidden">{m.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Topic selector */}
          <div className="flex items-center gap-1.5 self-end md:self-auto text-xs">
            <span className="text-slate-500 font-medium">Chủ đề:</span>
            <select
              value={currentTopic}
              onChange={(e) => onSelectTopic(e.target.value as Topic)}
              className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer shadow-2xs"
            >
              {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
