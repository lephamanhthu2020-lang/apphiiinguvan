import React from 'react';
import { Volume2, Square, MessageSquareText } from 'lucide-react';

interface SubtitlesBarProps {
  currentSubtitle: string;
  speaker: 'van_ai' | 'student' | 'system';
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onReplayAudio?: () => void;
}

export const SubtitlesBar: React.FC<SubtitlesBarProps> = ({
  currentSubtitle,
  speaker,
  isSpeaking,
  onStopSpeaking,
  onReplayAudio,
}) => {
  if (!currentSubtitle && !isSpeaking) return null;

  return (
    <div className="w-full bg-slate-900/95 text-white backdrop-blur-md border-t border-violet-800/40 px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl z-30 transition-all duration-300">
      <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
        <span
          className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
            speaker === 'van_ai'
              ? 'bg-violet-600 text-white'
              : speaker === 'student'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-700 text-slate-200'
          }`}
        >
          {speaker === 'van_ai' ? 'Văn AI' : speaker === 'student' ? 'Học sinh' : 'Hệ thống'}
        </span>

        <p className="text-sm font-medium text-slate-100 truncate sm:text-clip select-text">
          {currentSubtitle || '...'}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Dừng phát giọng đọc ngay lập tức"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Dừng phát</span>
          </button>
        )}

        {!isSpeaking && onReplayAudio && (
          <button
            onClick={onReplayAudio}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-violet-300 text-xs font-medium transition-all cursor-pointer"
            title="Nghe lại câu này"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nghe lại</span>
          </button>
        )}
      </div>
    </div>
  );
};
