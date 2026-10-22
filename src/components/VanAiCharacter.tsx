import React, { useState } from 'react';
import { CharacterState } from '../types';
import { Volume2, VolumeX, Sparkles, HelpCircle, Eye, Radio, Maximize2, Minimize2 } from 'lucide-react';

interface VanAiCharacterProps {
  state: CharacterState;
  isMuted: boolean;
  onToggleMute: () => void;
  isReducedMotion: boolean;
  onToggleReducedMotion: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onCharacterWave?: () => void;
}

export const VanAiCharacter: React.FC<VanAiCharacterProps> = ({
  state,
  isMuted,
  onToggleMute,
  isReducedMotion,
  onToggleReducedMotion,
  isFullscreen,
  onToggleFullscreen,
  onCharacterWave,
}) => {
  const [isWaving, setIsWaving] = useState(false);

  const triggerWave = () => {
    setIsWaving(true);
    if (onCharacterWave) onCharacterWave();
    setTimeout(() => setIsWaving(false), 2000);
  };

  // State-specific status labels & badge colors
  const statusConfig = {
    idle: {
      text: 'Đang lắng nghe & chờ lệnh',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-500',
    },
    listening: {
      text: 'Đang tiếp nhận tiếng Việt...',
      badge: 'bg-violet-100 text-violet-800 border-violet-400 ring-2 ring-violet-300',
      dot: 'bg-violet-600 animate-ping',
    },
    thinking: {
      text: 'Đang suy ngẫm kiến thức...',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      dot: 'bg-amber-500 animate-bounce',
    },
    speaking: {
      text: 'Văn AI đang giảng giải...',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-400',
      dot: 'bg-indigo-600 animate-pulse',
    },
    praised: {
      text: 'Xuất sắc! Văn AI tán thưởng!',
      badge: 'bg-pink-100 text-pink-800 border-pink-400 shadow-sm',
      dot: 'bg-pink-500',
    },
  }[state];

  return (
    <div className="relative flex flex-col items-center justify-between h-full w-full rounded-2xl bg-gradient-to-b from-indigo-950 via-slate-900 to-violet-950 text-white p-5 shadow-xl border border-violet-800/40 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls Bar */}
      <div className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-violet-800/40">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.dot}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusConfig.dot}`} />
          </span>
          <span className="text-xs font-semibold text-violet-200 tracking-wide uppercase">
            Robot Trợ giảng
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Wave action */}
          <button
            onClick={triggerWave}
            title="Văn AI vẫy tay chào học sinh"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-violet-200 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Chào em</span>
          </button>

          {/* Mute button */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh giọng đọc' : 'Tắt âm thanh'}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-violet-200 hover:text-white transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>

          {/* Reduced motion button */}
          <button
            onClick={onToggleReducedMotion}
            title={isReducedMotion ? 'Bật lại chuyển động nhân vật' : 'Chế độ giảm chuyển động'}
            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
              isReducedMotion ? 'bg-amber-500/30 text-amber-200' : 'bg-white/10 text-violet-200 hover:bg-white/20'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Fullscreen toggle for classroom 16:9 projection */}
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Thu nhỏ giao diện' : 'Toàn màn hình máy chiếu lớp học'}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-violet-200 hover:text-white transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3D-inspired SVG Character Canvas */}
      <div className="relative my-auto flex items-center justify-center py-4 w-full max-w-[280px] aspect-square">
        {/* Glowing Aura Ring when listening */}
        {state === 'listening' && (
          <div className="absolute inset-0 rounded-full border-4 border-violet-400/80 animate-van-halo shadow-[0_0_50px_rgba(168,85,247,0.6)] pointer-events-none" />
        )}

        {/* Orbiting particles when thinking */}
        {state === 'thinking' && (
          <div className="absolute inset-2 border-2 border-dashed border-amber-300/60 rounded-full animate-van-orbit pointer-events-none flex items-start justify-center">
            <span className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_12px_#f59e0b] -mt-1.5" />
          </div>
        )}

        {/* Celebration Stars when praised */}
        {state === 'praised' && (
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-2 left-6 text-2xl animate-star-glow">✨</span>
            <span className="absolute top-4 right-6 text-xl animate-star-glow" style={{ animationDelay: '0.4s' }}>🌟</span>
            <span className="absolute bottom-6 left-8 text-2xl animate-star-glow" style={{ animationDelay: '0.8s' }}>⭐</span>
            <span className="absolute bottom-8 right-8 text-xl animate-star-glow" style={{ animationDelay: '1.2s' }}>💫</span>
          </div>
        )}

        {/* SVG Robot Figure */}
        <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ${isReducedMotion ? '' : 'animate-van-float'}`}>
          <svg
            viewBox="0 0 280 280"
            className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] select-none"
            aria-label="Nhân vật robot Văn AI 3D học thuật"
          >
            <defs>
              {/* Metallic Body Gradient */}
              <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#f3f4f6" />
                <stop offset="85%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#c7d2fe" />
              </linearGradient>

              {/* Head Visor Screen Gradient */}
              <linearGradient id="visorScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="50%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#2e1065" />
              </linearGradient>

              {/* Glowing Purple Accent */}
              <linearGradient id="accentPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>

              {/* Warm Gold Cream Gradient */}
              <linearGradient id="warmGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              {/* Eye Glow Filter */}
              <filter id="eyeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Academic Cap / Scholar Finial on Top of Antenna */}
            <g transform="translate(140, 26)">
              {/* Antenna Stem */}
              <rect x="-3" y="14" width="6" height="20" rx="3" fill="#a5b4fc" />
              {/* Antenna Orb */}
              <circle cx="0" cy="12" r="7" fill="url(#warmGoldGrad)" filter="url(#eyeGlow)" />
              {/* Academic Quill Tip Top */}
              <path d="M 0,2 L 5,12 L -5,12 Z" fill="#fde047" />
            </g>

            {/* Left Ear Antenna Speaker */}
            <g transform="translate(48, 92)">
              <rect x="0" y="0" width="12" height="34" rx="6" fill="#818cf8" />
              <circle cx="6" cy="17" r="4" fill="#c7d2fe" />
              {state === 'listening' && (
                <path d="M -8,5 Q -14,17 -8,29" stroke="#c084fc" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Right Ear Antenna Speaker */}
            <g transform="translate(220, 92)">
              <rect x="0" y="0" width="12" height="34" rx="6" fill="#818cf8" />
              <circle cx="6" cy="17" r="4" fill="#c7d2fe" />
              {state === 'listening' && (
                <path d="M 20,5 Q 26,17 20,29" stroke="#c084fc" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Head Outer Frame */}
            <rect
              x="58"
              y="54"
              width="164"
              height="112"
              rx="44"
              fill="url(#robotBodyGrad)"
              stroke="#818cf8"
              strokeWidth="3.5"
            />

            {/* Subtle Head Highlights */}
            <path d="M 90,62 Q 140,56 190,62" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />

            {/* Digital Screen Visor */}
            <rect
              x="74"
              y="70"
              width="132"
              height="80"
              rx="28"
              fill="url(#visorScreenGrad)"
              stroke="#4338ca"
              strokeWidth="2.5"
            />

            {/* EYES (Expressive & Glowing) */}
            <g className={isReducedMotion ? '' : 'animate-van-blink'} style={{ transformOrigin: '140px 105px' }}>
              {state === 'praised' ? (
                // Happy curved eyes when praised
                <>
                  <path
                    d="M 98,108 Q 112,94 126,108"
                    stroke="#f472b6"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#eyeGlow)"
                  />
                  <path
                    d="M 154,108 Q 168,94 182,108"
                    stroke="#f472b6"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#eyeGlow)"
                  />
                </>
              ) : (
                // Standard Glowing Digital Eyes
                <>
                  {/* Left Eye */}
                  <rect
                    x="100"
                    y="95"
                    width="24"
                    height="20"
                    rx="9"
                    fill={state === 'thinking' ? '#f59e0b' : '#38bdf8'}
                    filter="url(#eyeGlow)"
                  />
                  <circle cx="106" cy="100" r="3" fill="#ffffff" />

                  {/* Right Eye */}
                  <rect
                    x="156"
                    y="95"
                    width="24"
                    height="20"
                    rx="9"
                    fill={state === 'thinking' ? '#f59e0b' : '#38bdf8'}
                    filter="url(#eyeGlow)"
                  />
                  <circle cx="162" cy="100" r="3" fill="#ffffff" />
                </>
              )}
            </g>

            {/* MOUTH / SPEECH WAVE VISUALIZER */}
            {state === 'speaking' ? (
              // Dynamic Audio Waveform Mouth
              <g transform="translate(110, 128)">
                <line x1="8" y1="6" x2="8" y2="18" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
                <line x1="18" y1="2" x2="18" y2="22" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="28" y1="0" x2="28" y2="24" stroke="#e879f9" strokeWidth="4" strokeLinecap="round" className="animate-ping" />
                <line x1="38" y1="2" x2="38" y2="22" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="48" y1="6" x2="48" y2="18" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
              </g>
            ) : state === 'listening' ? (
              // Attentive Oval Sound-detecting Mouth
              <ellipse cx="140" cy="136" rx="8" ry="4" fill="#a855f7" filter="url(#eyeGlow)" />
            ) : state === 'praised' ? (
              // Sweet Warm Smile
              <path d="M 126,132 Q 140,144 154,132" stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            ) : (
              // Friendly Gentle Arc Smile
              <path d="M 128,134 Q 140,142 152,134" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" fill="none" />
            )}

            {/* Neck Joint */}
            <rect x="124" y="166" width="32" height="12" rx="5" fill="#6366f1" />

            {/* Robot Torso Body */}
            <path
              d="M 88,178 L 192,178 Q 206,242 190,264 L 90,264 Q 74,242 88,178 Z"
              fill="url(#robotBodyGrad)"
              stroke="#818cf8"
              strokeWidth="3.5"
            />

            {/* Chest Center Emblem: SÁCH & LÔNG BÚT (Book & Feather Pen) */}
            <g transform="translate(140, 218)">
              {/* Emblem Glow Backdrop */}
              <circle cx="0" cy="0" r="22" fill="#312e81" stroke="#a5b4fc" strokeWidth="2" />
              {/* Open Book Wings */}
              <path
                d="M -12,-6 Q -5,-10 0,-7 Q 5,-10 12,-6 L 12,6 Q 5,2 0,5 Q -5,2 -12,6 Z"
                fill="url(#warmGoldGrad)"
              />
              {/* Spine of Book */}
              <line x1="0" y1="-7" x2="0" y2="5" stroke="#78350f" strokeWidth="1.5" />
              {/* Feather Quill Cross */}
              <path
                d="M 6,-14 Q 9,-4 0,7 L -2,4 Q 3,-6 6,-14 Z"
                fill="#fbcfe8"
                stroke="#ec4899"
                strokeWidth="1"
              />
            </g>

            {/* Left Arm & Hand */}
            <g transform="translate(58, 186)">
              <rect x="0" y="0" width="18" height="46" rx="9" fill="url(#robotBodyGrad)" stroke="#818cf8" strokeWidth="2.5" />
              <circle cx="9" cy="46" r="7" fill="#818cf8" />
            </g>

            {/* Right Arm & Hand (Waving when clicked or triggered) */}
            <g
              transform={isWaving ? 'translate(204, 160) rotate(-45)' : 'translate(204, 186)'}
              className="transition-transform duration-300"
            >
              <rect x="0" y="0" width="18" height="46" rx="9" fill="url(#robotBodyGrad)" stroke="#818cf8" strokeWidth="2.5" />
              <circle cx="9" cy="46" r="7" fill="#818cf8" />
            </g>
          </svg>
        </div>
      </div>

      {/* Character State Status Card */}
      <div className="relative z-10 w-full flex flex-col items-center gap-1.5 pt-2">
        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors duration-300 ${statusConfig.badge}`}>
          <Radio className="w-3 h-3 animate-pulse" />
          <span>{statusConfig.text}</span>
        </div>

        {/* Persona Transparency Disclaimer */}
        <p className="text-[11px] text-violet-300/80 text-center leading-tight flex items-center justify-center gap-1 mt-1">
          <HelpCircle className="w-3 h-3 shrink-0 text-violet-400" />
          <span>Văn AI là Trợ giảng số học thuật • Không phải người thật</span>
        </p>
      </div>
    </div>
  );
};
