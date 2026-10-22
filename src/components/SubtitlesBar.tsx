import React from 'react';
import { Volume2, Square, MessageSquareText } from 'lucide-react';

interface SubtitlesBarProps {
  currentSubtitle: string;
  speaker: 'van_ai' | 'student' | 'system';
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onReplayAudio?: () => void;
  speechRate?: number;
  onToggleSpeechRate?: () => void;
}

export const SubtitlesBar: React.FC<SubtitlesBarProps> = ({
  currentSubtitle,
  speaker,
  isSpeaking,
  onStopSpeaking,
  onReplayAudio,
  speechRate = 1.0,
  onToggleSpeechRate,
}) => {
  if (!currentSubtitle && !isSpeaking) return null;

  return (
    <div className="w-full bg-slate-950/95 text-white backdrop-blur-md border-t border-violet-800/50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl z-30 transition-all duration-300">
      <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
        <span
          className={`shrink-0 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
            speaker === 'van_ai'
              ? 'bg-violet-600 text-white shadow-xs'
              : speaker === 'student'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-700 text-slate-200'
          }`}
        >
          {speaker === 'van_ai' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />}
          {speaker === 'van_ai' ? 'Văn AI (Giọng Tiếng Việt)' : speaker === 'student' ? 'Học sinh' : 'Hệ thống'}
        </span>

        <p className="text-sm font-medium text-slate-100 truncate sm:text-clip select-text leading-snug">
          {currentSubtitle || '...'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Speed toggle */}
        {onToggleSpeechRate && (
          <button
            onClick={onToggleSpeechRate}
            className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-violet-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            title="Đổi tốc độ đọc: 0.85x (Chậm rõ) - 1.0x (Chuẩn) - 1.15x (Nhanh)"
          >
            Tốc độ: {speechRate}x
          </button>
        )}

        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer animate-pulse"
            title="Dừng phát giọng đọc ngay lập tức"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Dừng phát</span>
          </button>
        )}

        {!isSpeaking && onReplayAudio && (
          <button
            onClick={onReplayAudio}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-violet-300 hover:text-white text-xs font-semibold transition-all cursor-pointer border border-slate-700"
            title="Nghe lại câu này bằng giọng tiếng Việt"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Nghe lại</span>
          </button>
        )}
      </div>
    </div>
  );
};
