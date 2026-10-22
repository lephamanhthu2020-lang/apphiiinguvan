import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Grade,
  Topic,
  AppMode,
  CharacterState,
  ChatMessage,
  QuizQuestion,
  ReadingPassage,
  WritingPrompt,
  WritingCritiqueResponse,
  MindMapNode,
} from './types';
import { Header } from './components/Header';
import { VanAiCharacter } from './components/VanAiCharacter';
import { SubtitlesBar } from './components/SubtitlesBar';
import { ModeQA } from './components/ModeQA';
import { ModeQuiz } from './components/ModeQuiz';
import { ModeReading } from './components/ModeReading';
import { ModeWriting } from './components/ModeWriting';
import { ModeMindmap } from './components/ModeMindmap';
import { TeacherPanel } from './components/TeacherPanel';
import { SafetyModal } from './components/SafetyModal';

export default function App() {
  // Navigation & Grade States
  const [grade, setGrade] = useState<Grade>(7);
  const [topic, setTopic] = useState<Topic>('tieng-viet');
  const [mode, setMode] = useState<AppMode>('qa');

  // Character & Accessibility States
  const [characterState, setCharacterState] = useState<CharacterState>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Subtitles & Audio
  const [currentSubtitle, setCurrentSubtitle] = useState<string>(
    'Chào em! Văn AI là trợ giảng Ngữ văn THCS. Em hãy chọn Lớp và bài học để cùng khám phá nhé!'
  );
  const [subtitleSpeaker, setSubtitleSpeaker] = useState<'van_ai' | 'student' | 'system'>('van_ai');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Connection & API Status
  const [isAiConnected, setIsAiConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Dialog & Modals
  const [isTeacherPanelOpen, setIsTeacherPanelOpen] = useState<boolean>(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);

  // Q&A Chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Teacher Custom Storage
  const [customQuizzes, setCustomQuizzes] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('van_ai_custom_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customPassages, setCustomPassages] = useState<ReadingPassage[]>(() => {
    try {
      const saved = localStorage.getItem('van_ai_custom_passages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customPrompts, setCustomPrompts] = useState<WritingPrompt[]>(() => {
    try {
      const saved = localStorage.getItem('van_ai_custom_prompts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Speech Recognition (Web Speech API)
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  // Check backend status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setIsAiConnected(Boolean(data.hasApiKey));
      })
      .catch(() => {
        setIsAiConnected(false);
      });
  }, []);

  // Save custom teacher data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('van_ai_custom_quizzes', JSON.stringify(customQuizzes));
    } catch {}
  }, [customQuizzes]);

  useEffect(() => {
    try {
      localStorage.setItem('van_ai_custom_passages', JSON.stringify(customPassages));
    } catch {}
  }, [customPassages]);

  useEffect(() => {
    try {
      localStorage.setItem('van_ai_custom_prompts', JSON.stringify(customPrompts));
    } catch {}
  }, [customPrompts]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setCharacterState('listening');
      setSubtitleSpeaker('student');
      setCurrentSubtitle('Đang lắng nghe học sinh nói...');
    };

    recognition.onresult = (event: any) => {
      let currentResult = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentResult += event.results[i][0].transcript;
      }
      setTranscript(currentResult);
      setCurrentSubtitle(currentResult);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setCharacterState('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      setCharacterState('idle');
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Error starting speech recognition:', e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
      setIsListening(false);
      setCharacterState('idle');
    }
  }, [isListening]);

  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Preload and cache speech synthesis voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const vs = window.speechSynthesis.getVoices();
      if (vs && vs.length > 0) setSpeechVoices(vs);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const cleanTextForSpeech = (raw: string): string => {
    if (!raw) return '';
    return raw
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#+\s+/gm, '')
      .replace(/^\s*[-*•]\s+/gm, '')
      .replace(/[`_~>]/g, '')
      .replace(/[✨🌟⭐💫💖💡🎉]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const [speechRate, setSpeechRate] = useState<number>(1.0);

  const toggleSpeechRate = () => {
    setSpeechRate((prev) => {
      if (prev === 1.0) return 1.15;
      if (prev === 1.15) return 0.85;
      return 1.0;
    });
  };

  const fallbackWebSpeech = useCallback(
    (clean: string) => {
      if (!('speechSynthesis' in window)) {
        setIsSpeaking(false);
        setCharacterState('idle');
        return;
      }
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'vi-VN';
      utterance.rate = speechRate * 0.95;
      utterance.pitch = 1.0;

      const allVoices = speechVoices.length > 0 ? speechVoices : window.speechSynthesis.getVoices();
      const viVoice = allVoices.find((v) => {
        const l = (v.lang || '').toLowerCase();
        const n = (v.name || '').toLowerCase();
        return (
          l === 'vi-vn' ||
          l === 'vi_vn' ||
          l.startsWith('vi') ||
          n.includes('vietnam') ||
          n.includes('tiếng việt') ||
          n.includes('vietnamese') ||
          n.includes('hoaimy') ||
          n.includes('namminh') ||
          n.includes('linh') ||
          n.includes('an') ||
          n.includes('mai')
        );
      });

      if (viVoice) {
        utterance.voice = viVoice;
        utterance.lang = viVoice.lang || 'vi-VN';
      }

      utterance.onend = () => {
        setIsSpeaking(false);
        setCharacterState('idle');
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCharacterState('idle');
      };

      window.speechSynthesis.speak(utterance);
    },
    [speechRate, speechVoices]
  );

  // Speech Output (TTS) with authentic native Vietnamese MP3 + browser fallback
  const speakText = useCallback(
    async (text: string) => {
      if (isMuted || !text) return;

      // Stop previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(true);
      setCharacterState('speaking');
      setSubtitleSpeaker('van_ai');
      setCurrentSubtitle(text);

      const clean = cleanTextForSpeech(text);
      if (!clean) {
        setIsSpeaking(false);
        setCharacterState('idle');
        return;
      }

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: clean }),
        });
        const data = await response.json();

        if (data.audioBase64) {
          const audio = new Audio(`data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`);
          audioRef.current = audio;
          audio.playbackRate = speechRate;

          audio.onended = () => {
            setIsSpeaking(false);
            setCharacterState('idle');
            audioRef.current = null;
          };
          audio.onerror = () => {
            fallbackWebSpeech(clean);
          };

          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('Backend TTS failed, using browser Web Speech:', err);
      }

      fallbackWebSpeech(clean);
    },
    [isMuted, speechRate, fallbackWebSpeech]
  );

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCharacterState('idle');
  };

  // Praise action trigger (celebration)
  const praiseCharacter = () => {
    setCharacterState('praised');
    setTimeout(() => {
      setCharacterState('idle');
    }, 3000);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Mode A: Send Message
  const handleSendMessage = async (userText: string) => {
    if (!userText || !userText.trim()) return;
    const cleanUserText = userText.trim();

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: cleanUserText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setCharacterState('thinking');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cleanUserText,
          grade,
          topic,
          history: messages,
        }),
      });

      const data = await response.json();
      const reply =
        data.reply ||
        `Chào em! Về câu hỏi "${cleanUserText}" môn Ngữ văn Lớp ${grade}, thầy/cô Văn AI gợi ý em chú ý bám sát chi tiết và dẫn chứng trong văn bản để tự rút ra kết luận nhé!`;

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(reply);
    } catch (err) {
      // Pedagogical fallback to always maintain continuous learning without error alerts
      const fallbackReply = `Chào em! Thầy/cô Văn AI đã ghi nhận câu hỏi của em: "${cleanUserText}".\n\nĐối với nội dung này ở Lớp ${grade}:\n1. Em hãy chú ý xác định đúng thể loại và đặc trưng của văn bản.\n2. Phân tích tác dụng của từ ngữ, hình ảnh và biện pháp tu từ được dùng.\n3. Rút ra thông điệp hoặc bài học nhân văn cho bản thân.\n\nEm hãy thử đối chiếu câu hỏi của em với phần Đọc hiểu hoặc Đố vui để củng cố thêm nhé!`;
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: Date.now(),
        },
      ]);
      speakText(fallbackReply);
    } finally {
      setIsLoading(false);
    }
  };

  // Mode C: Reading Feedback
  const handleGetReadingFeedback = async (
    passageTitle: string,
    excerpt: string,
    questionText: string,
    questionLevel: string,
    answer: string
  ): Promise<string> => {
    setIsLoading(true);
    setCharacterState('thinking');

    try {
      const response = await fetch('/api/reading-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          passageTitle,
          excerpt,
          questionText,
          questionLevel,
          studentAnswer: answer,
        }),
      });

      const data = await response.json();
      const feedback = data.feedback || 'Em đã hoàn thành câu trả lời đọc hiểu.';
      speakText(feedback);
      return feedback;
    } catch (err) {
      const errNote = 'Chưa thể phân tích câu trả lời lúc này. Em hãy đọc lại văn bản và thử lại nhé.';
      speakText(errNote);
      return errNote;
    } finally {
      setIsLoading(false);
    }
  };

  // Mode D: Writing Critique
  const handleGetWritingCritique = async (
    genre: string,
    promptTitle: string,
    promptText: string,
    essay: string
  ): Promise<WritingCritiqueResponse> => {
    setIsLoading(true);
    setCharacterState('thinking');

    try {
      const response = await fetch('/api/writing-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          genre,
          promptTitle,
          promptText,
          studentEssay: essay,
        }),
      });

      const data: WritingCritiqueResponse = await response.json();
      const spokenSummary = `Văn AI đã đọc xong bài viết của em. ${data.encouragement || ''}`;
      speakText(spokenSummary);
      return data;
    } catch (err) {
      const fallbackCritique: WritingCritiqueResponse = {
        strengths: ['Đoạn văn có cảm xúc chân thực và nỗ lực bám sát đề bài.'],
        improvements: ['Cần chú ý thêm về các liên từ để các câu văn kết nối mượt mà hơn.'],
        sentenceEdits: [],
        encouragement: 'Văn AI rất tự hào về tinh thần chăm chỉ luyện viết của em!',
      };
      return fallbackCritique;
    } finally {
      setIsLoading(false);
    }
  };

  // Mode E: Mindmap Generation
  const handleGenerateMindmap = async (topicTitle: string, targetGrade: Grade): Promise<MindMapNode> => {
    setIsLoading(true);
    setCharacterState('thinking');

    try {
      const response = await fetch('/api/mindmap-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, grade: targetGrade }),
      });

      const data = await response.json();
      speakText(`Văn AI đã tạo khung sơ đồ tư duy cho chủ đề: ${topicTitle}.`);
      return data.root;
    } catch (err) {
      speakText(`Chưa thể tạo sơ đồ mới, Văn AI chuyển về khung dàn ý mẫu.`);
      return {
        id: 'fallback-root',
        label: topicTitle,
        type: 'root',
        children: [
          { id: 'fb-1', label: '1. Khái quát chủ đề', type: 'theme' },
          { id: 'fb-2', label: '2. Luận điểm then chốt', type: 'theme' },
          { id: 'fb-3', label: '3. Thông điệp nhân văn', type: 'emotion' },
        ],
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-100 text-slate-900 ${
        isReducedMotion ? 'reduced-motion' : ''
      }`}
    >
      {/* App Header */}
      <Header
        currentGrade={grade}
        onSelectGrade={(g) => {
          setGrade(g);
          speakText(`Đã chuyển sang chương trình Ngữ văn Lớp ${g}.`);
        }}
        currentTopic={topic}
        onSelectTopic={setTopic}
        currentMode={mode}
        onSelectMode={(m) => {
          setMode(m);
          stopSpeaking();
        }}
        isAiConnected={isAiConnected}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenTeacherPanel={() => setIsTeacherPanelOpen(true)}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
      />

      {/* Main Classroom Workspace (16:9 Optimized) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
          {/* Left Column (4 cols on lg, 3 on xl): Van AI Character */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
            <VanAiCharacter
              state={characterState}
              isMuted={isMuted}
              onToggleMute={() => {
                setIsMuted(!isMuted);
                if (!isMuted) stopSpeaking();
              }}
              isReducedMotion={isReducedMotion}
              onToggleReducedMotion={() => setIsReducedMotion(!isReducedMotion)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onCharacterWave={() => {
                speakText('Xin chào các em học sinh! Thầy cô Văn AI rất vui được đồng hành cùng các em.');
              }}
            />
          </div>

          {/* Right Column (8 cols on lg, 8 on xl): Active Educational Mode Card */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col">
            {mode === 'qa' && (
              <ModeQA
                grade={grade}
                topic={topic}
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onClearHistory={() => setMessages([])}
                onStartListening={startListening}
                onStopListening={stopListening}
                isListening={isListening}
                transcript={transcript}
                speechSupported={speechSupported}
              />
            )}

            {mode === 'quiz' && (
              <ModeQuiz
                grade={grade}
                topic={topic}
                customQuestions={customQuizzes}
                onSpeakText={speakText}
                onPraiseCharacter={praiseCharacter}
                transcript={transcript}
                isListening={isListening}
                onStartListening={startListening}
                onStopListening={stopListening}
                speechSupported={speechSupported}
              />
            )}

            {mode === 'reading' && (
              <ModeReading
                grade={grade}
                customPassages={customPassages}
                onSpeakText={speakText}
                onGetReadingFeedback={handleGetReadingFeedback}
                isLoading={isLoading}
                speechSupported={speechSupported}
                isListening={isListening}
                transcript={transcript}
                onStartListening={startListening}
                onStopListening={stopListening}
              />
            )}

            {mode === 'writing' && (
              <ModeWriting
                grade={grade}
                customPrompts={customPrompts}
                onGetWritingCritique={handleGetWritingCritique}
                isLoading={isLoading}
                onPraiseCharacter={praiseCharacter}
              />
            )}

            {mode === 'mindmap' && (
              <ModeMindmap
                grade={grade}
                onGenerateMindmap={handleGenerateMindmap}
                isLoading={isLoading}
                onPraiseCharacter={praiseCharacter}
              />
            )}
          </div>
        </div>
      </main>

      {/* Live Accurate Subtitles & Speech Controls Bar */}
      <SubtitlesBar
        currentSubtitle={currentSubtitle}
        speaker={subtitleSpeaker}
        isSpeaking={isSpeaking}
        onStopSpeaking={stopSpeaking}
        onReplayAudio={() => speakText(currentSubtitle)}
        speechRate={speechRate}
        onToggleSpeechRate={toggleSpeechRate}
      />

      {/* Teacher Panel Modal */}
      <TeacherPanel
        isOpen={isTeacherPanelOpen}
        onClose={() => setIsTeacherPanelOpen(false)}
        onAddCustomQuiz={(q) => setCustomQuizzes((prev) => [q, ...prev])}
        onAddCustomPassage={(p) => setCustomPassages((prev) => [p, ...prev])}
        onAddCustomPrompt={(wp) => setCustomPrompts((prev) => [wp, ...prev])}
        customQuizzes={customQuizzes}
        customPassages={customPassages}
        customPrompts={customPrompts}
        onClearCustomData={() => {
          setCustomQuizzes([]);
          setCustomPassages([]);
          setCustomPrompts([]);
          localStorage.removeItem('van_ai_custom_quizzes');
          localStorage.removeItem('van_ai_custom_passages');
          localStorage.removeItem('van_ai_custom_prompts');
        }}
      />

      {/* Safety & Student Data Modal */}
      <SafetyModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
        isAiConnected={isAiConnected}
      />
    </div>
  );
}
