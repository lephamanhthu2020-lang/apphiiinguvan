import React, { useState, useRef, useEffect } from 'react';
import { Grade, Topic, ChatMessage } from '../types';
import { SAMPLE_QA_SUGGESTIONS, GRADE_THEMES } from '../data/curriculumData';
import { Send, Mic, MicOff, Trash2, Sparkles, BookOpen, User, Bot, HelpCircle, AlertCircle } from 'lucide-react';

interface ModeQAProps {
  grade: Grade;
  topic: Topic;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearHistory: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  isListening: boolean;
  transcript: string;
  speechSupported: boolean;
}

export const ModeQA: React.FC<ModeQAProps> = ({
  grade,
  topic,
  messages,
  onSendMessage,
  isLoading,
  onClearHistory,
  onStartListening,
  onStopListening,
  isListening,
  transcript,
  speechSupported,
}) => {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const handleSelectSuggestion = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const currentTheme = GRADE_THEMES[grade];
  const suggestions = SAMPLE_QA_SUGGESTIONS[grade] || [];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      {/* Top Pedagogical Context Card */}
      <div className="bg-gradient-to-r from-violet-50/80 via-indigo-50/40 to-white px-5 py-3 border-b border-indigo-100/80 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-indigo-950 font-serif-vi">
              Chế độ A: Hỏi đáp Ngữ văn Lớp {grade}
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
              Gợi mở & Sư phạm
            </span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            Trọng tâm Lớp {grade}: {currentTheme.focus}
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="Xóa toàn bộ hội thoại của lượt học này"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xoá phiên</span>
          </button>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-violet-700 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Học sinh hỏi nhanh:
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectSuggestion(s)}
            disabled={isLoading}
            className="text-xs px-3 py-1 bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-900 border border-slate-200 hover:border-violet-300 rounded-full transition-all whitespace-nowrap shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3 shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-indigo-950 font-serif-vi">
              Chào em! Văn AI sẵn sàng đồng hành cùng em.
            </h3>
            <p className="text-xs text-slate-600 max-w-md mt-1 leading-relaxed">
              Em có thể bấm <strong>Micro</strong> để nói bằng tiếng Việt hoặc gõ câu hỏi vào ô bên dưới về biện pháp tu từ, ngôi kể, cách phân tích đoạn thơ hoặc lập dàn ý nhé!
            </p>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 max-w-md text-left flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Quy tắc sư phạm:</strong> Văn AI sẽ giảng giải bản chất và đặt câu hỏi gợi mở, không viết toàn bộ bài làm hộ học sinh.
              </span>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                      : 'bg-gradient-to-tr from-violet-600 to-indigo-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-slate-100/90 text-slate-800 rounded-tl-xs border border-slate-200/70 shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap select-text">{msg.content}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? 'text-emerald-100 text-right' : 'text-slate-400 text-left'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-600 rounded-tl-xs border border-slate-200 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-ping" />
              <span>Văn AI đang suy ngẫm câu trả lời chuẩn sư phạm...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Listening State Banner */}
      {isListening && (
        <div className="px-4 py-2 bg-violet-600 text-white text-xs flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-300" />
            <span>Đang thu giọng nói học sinh bằng tiếng Việt... (Hãy nói rõ ràng vào micro)</span>
          </div>
          <button
            type="button"
            onClick={onStopListening}
            className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] font-bold cursor-pointer"
          >
            Dừng nghe
          </button>
        </div>
      )}

      {/* Speech input support warning if browser lacks Web Speech */}
      {!speechSupported && (
        <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Trình duyệt hiện tại chưa hỗ trợ Web Speech API tiếng Việt. Em có thể gõ trực tiếp câu hỏi vào ô bên dưới.</span>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
        {/* Voice Input Button */}
        {speechSupported && (
          <button
            type="button"
            onClick={isListening ? onStopListening : onStartListening}
            title={isListening ? 'Bấm để dừng thu âm' : 'Bấm để nói bằng tiếng Việt'}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-400'
                : 'bg-white hover:bg-violet-50 text-slate-700 hover:text-violet-700 border border-slate-300'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-violet-600" />}
          </button>
        )}

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Hỏi Văn AI về thể loại, biện pháp tu từ, ngôi kể hoặc gợi ý dàn ý..."
          disabled={isLoading}
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-60 placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          title="Gửi câu hỏi cho Văn AI"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
