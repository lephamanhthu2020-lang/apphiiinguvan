import React, { useState } from 'react';
import { Grade, Topic, QuizQuestion, ReadingPassage, WritingPrompt } from '../types';
import {
  GraduationCap,
  X,
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
  CheckCircle,
  Tv,
  BookOpen,
  Award,
  FileText,
  PenTool,
} from 'lucide-react';

interface TeacherPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomQuiz: (q: QuizQuestion) => void;
  onAddCustomPassage: (p: ReadingPassage) => void;
  onAddCustomPrompt: (wp: WritingPrompt) => void;
  customQuizzes: QuizQuestion[];
  customPassages: ReadingPassage[];
  customPrompts: WritingPrompt[];
  onClearCustomData: () => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({
  isOpen,
  onClose,
  onAddCustomQuiz,
  onAddCustomPassage,
  onAddCustomPrompt,
  customQuizzes,
  customPassages,
  customPrompts,
  onClearCustomData,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'reading' | 'writing' | 'display'>('quiz');

  // Form states for creating a new Quiz Question
  const [qGrade, setQGrade] = useState<Grade>(7);
  const [qTopic, setQTopic] = useState<Topic>('tieng-viet');
  const [qQuestion, setQQuestion] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [qExplanation, setQExplanation] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for creating a new Reading Passage
  const [rGrade, setRGrade] = useState<Grade>(7);
  const [rTitle, setRTitle] = useState('');
  const [rGenre, setRGenre] = useState('');
  const [rExcerpt, setRExcerpt] = useState('');
  const [rQ1, setRQ1] = useState('');
  const [rQ2, setRQ2] = useState('');
  const [rQ3, setRQ3] = useState('');

  // Form states for creating a Writing Prompt
  const [wGrade, setWGrade] = useState<Grade>(8);
  const [wTitle, setWTitle] = useState('');
  const [wGenre, setWGenre] = useState<'tu_su' | 'bieu_cam' | 'thuyet_minh' | 'nghi_luan_xh' | 'nghi_luan_vh'>('nghi_luan_xh');
  const [wPrompt, setWPrompt] = useState('');
  const [wGuideline, setWGuideline] = useState('');

  if (!isOpen) return null;

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qQuestion.trim() || !qOptA || !qOptB || !qOptC || !qOptD) return;

    const newQ: QuizQuestion = {
      id: `custom-q-${Date.now()}`,
      grade: qGrade,
      topic: qTopic,
      question: qQuestion.trim(),
      options: {
        A: qOptA.trim(),
        B: qOptB.trim(),
        C: qOptC.trim(),
        D: qOptD.trim(),
      },
      correctOption: qCorrect,
      explanation: qExplanation.trim() || 'Giải thích từ giáo viên bộ môn.',
      pedagogicalNote: 'Đề bài do giáo viên biên soạn trực tiếp trên lớp.',
    };

    onAddCustomQuiz(newQ);
    setQQuestion('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
    showSuccess();
  };

  const handleSavePassage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rTitle.trim() || !rExcerpt.trim() || !rQ1.trim()) return;

    const newPassage: ReadingPassage = {
      id: `custom-p-${Date.now()}`,
      grade: rGrade,
      title: rTitle.trim(),
      genre: rGenre.trim() || 'Văn bản đọc hiểu giáo viên cung cấp',
      isSelfComposedDemo: false,
      sourceAnnotation: 'Ngữ liệu do giáo viên biên soạn phục vụ bài dạy trên lớp',
      excerpt: rExcerpt.trim(),
      lineCount: rExcerpt.split('\n').length,
      vocabularyNotes: [],
      questions: [
        {
          id: `crq-1-${Date.now()}`,
          level: 'nhan_biet',
          levelLabel: 'Nhận biết',
          text: rQ1.trim(),
          guidePrompt: 'Tìm chi tiết, từ ngữ trực tiếp trong đoạn trích.',
          textualEvidenceHint: 'Bám sát câu chữ trong văn bản.',
        },
        {
          id: `crq-2-${Date.now()}`,
          level: 'thong_hieu',
          levelLabel: 'Thông hiểu',
          text: rQ2.trim() || 'Nêu ý nghĩa hoặc tác dụng của chi tiết/biện pháp tu từ trong bài.',
          guidePrompt: 'Giải thích vì sao tác giả lại sử dụng hình ảnh đó.',
          textualEvidenceHint: 'Phân tích ý nghĩa nghệ thuật.',
        },
        {
          id: `crq-3-${Date.now()}`,
          level: 'van_dung',
          levelLabel: 'Vận dụng',
          text: rQ3.trim() || 'Rút ra bài học hoặc liên hệ thực tế đời sống.',
          guidePrompt: 'Liên hệ suy nghĩ và hành động của bản thân.',
          textualEvidenceHint: 'Vận dụng thông điệp vào thực tiễn.',
        },
      ],
    };

    onAddCustomPassage(newPassage);
    setRTitle('');
    setRGenre('');
    setRExcerpt('');
    setRQ1('');
    setRQ2('');
    setRQ3('');
    showSuccess();
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wTitle.trim() || !wPrompt.trim()) return;

    const newPrompt: WritingPrompt = {
      id: `custom-wp-${Date.now()}`,
      grade: wGrade,
      genre: wGenre,
      genreLabel: wGenre === 'tu_su' ? 'Văn Tự sự' : wGenre === 'bieu_cam' ? 'Văn Biểu cảm' : 'Văn Nghị luận',
      title: wTitle.trim(),
      prompt: wPrompt.trim(),
      guidelines: wGuideline ? wGuideline.split('\n').filter(Boolean) : ['Bám sát yêu cầu đề bài và chuẩn kiến thức GDPT 2018.'],
      suggestedOutlines: ['Mở đoạn: Nêu vấn đề', 'Thân đoạn: Triển khai luận điểm & dẫn chứng', 'Kết đoạn: Đánh giá & cảm nghĩ'],
    };

    onAddCustomPrompt(newPrompt);
    setWTitle('');
    setWPrompt('');
    setWGuideline('');
    showSuccess();
  };

  const showSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Export custom data JSON
  const handleExportData = () => {
    const data = {
      customQuizzes,
      customPassages,
      customPrompts,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `van-ai-giao-vien-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/10 text-amber-300">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-vi">
                Góc Giáo viên & Soạn bài Giảng dạy
              </h2>
              <p className="text-xs text-violet-200">
                Biên soạn câu hỏi, đoạn trích đọc hiểu, đề bài viết & thiết lập máy chiếu 16:9
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'border-violet-600 text-violet-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Thêm Đố vui ({customQuizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reading')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reading'
                ? 'border-violet-600 text-violet-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Thêm Đoạn trích Đọc hiểu ({customPassages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('writing')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'writing'
                ? 'border-violet-600 text-violet-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Thêm Đề Luyện viết ({customPrompts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('display')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'display'
                ? 'border-violet-600 text-violet-700 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Hướng dẫn Trình chiếu</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu thành công vào giáo trình phiên dạy của thầy/cô!</span>
            </div>
          )}

          {/* TAB 1: ADD QUIZ QUESTION */}
          {activeTab === 'quiz' && (
            <form onSubmit={handleSaveQuiz} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Khối Lớp:</label>
                  <select
                    value={qGrade}
                    onChange={(e) => setQGrade(Number(e.target.value) as Grade)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chủ đề:</label>
                  <select
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value as Topic)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="tieng-viet">Tiếng Việt & Tu từ</option>
                    <option value="doc-hieu">Đọc hiểu văn bản</option>
                    <option value="viet">Thực hành Viết</option>
                    <option value="van-hoc">Tri thức Ngữ văn</option>
                    <option value="tong-hop">Tổng hợp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nội dung câu hỏi:</label>
                <input
                  type="text"
                  required
                  value={qQuestion}
                  onChange={(e) => setQQuestion(e.target.value)}
                  placeholder="Ví dụ: Trong câu thơ sau, tác giả sử dụng biện pháp tu từ nào?"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phương án A:</label>
                  <input
                    type="text"
                    required
                    value={qOptA}
                    onChange={(e) => setQOptA(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phương án B:</label>
                  <input
                    type="text"
                    required
                    value={qOptB}
                    onChange={(e) => setQOptB(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phương án C:</label>
                  <input
                    type="text"
                    required
                    value={qOptC}
                    onChange={(e) => setQOptC(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phương án D:</label>
                  <input
                    type="text"
                    required
                    value={qOptD}
                    onChange={(e) => setQOptD(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Đáp án đúng:</label>
                  <select
                    value={qCorrect}
                    onChange={(e) => setQCorrect(e.target.value as 'A' | 'B' | 'C' | 'D')}
                    className="w-full bg-emerald-50 border border-emerald-300 font-bold text-emerald-800 rounded-lg p-2 text-xs"
                  >
                    <option value="A">Phương án A</option>
                    <option value="B">Phương án B</option>
                    <option value="C">Phương án C</option>
                    <option value="D">Phương án D</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Lời giải thích chuẩn GDPT 2018:</label>
                  <input
                    type="text"
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    placeholder="Giải thích vì sao phương án đó đúng để Văn AI đọc cho học sinh..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Lưu câu hỏi đố vui vào tiết dạy</span>
              </button>
            </form>
          )}

          {/* TAB 2: ADD READING PASSAGE */}
          {activeTab === 'reading' && (
            <form onSubmit={handleSavePassage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Khối Lớp:</label>
                  <select
                    value={rGrade}
                    onChange={(e) => setRGrade(Number(e.target.value) as Grade)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tên bài đọc:</label>
                  <input
                    type="text"
                    required
                    value={rTitle}
                    onChange={(e) => setRTitle(e.target.value)}
                    placeholder="Ví dụ: Bức thư gửi mẹ..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Thể loại:</label>
                  <input
                    type="text"
                    value={rGenre}
                    onChange={(e) => setRGenre(e.target.value)}
                    placeholder="Ví dụ: Truyện ngắn / Thơ 5 chữ"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Đoạn trích văn bản (có thể dán trích đoạn SGK hoặc bài tự sáng tác):
                </label>
                <textarea
                  rows={6}
                  required
                  value={rExcerpt}
                  onChange={(e) => setRExcerpt(e.target.value)}
                  placeholder="Dán hoặc gõ đoạn trích tại đây..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">3 Câu hỏi đọc hiểu theo cấp độ:</span>
                <input
                  type="text"
                  required
                  value={rQ1}
                  onChange={(e) => setRQ1(e.target.value)}
                  placeholder="Câu 1 [Nhận biết]: Ví dụ: Tìm các chi tiết miêu tả..."
                  className="w-full bg-blue-50/70 border border-blue-200 rounded-lg p-2 text-xs"
                />
                <input
                  type="text"
                  value={rQ2}
                  onChange={(e) => setRQ2(e.target.value)}
                  placeholder="Câu 2 [Thông hiểu]: Ví dụ: Biện pháp nghệ thuật đó có tác dụng gì?"
                  className="w-full bg-violet-50/70 border border-violet-200 rounded-lg p-2 text-xs"
                />
                <input
                  type="text"
                  value={rQ3}
                  onChange={(e) => setRQ3(e.target.value)}
                  placeholder="Câu 3 [Vận dụng]: Ví dụ: Rút ra bài học nhân văn cho bản thân em?"
                  className="w-full bg-amber-50/70 border border-amber-200 rounded-lg p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm đoạn trích đọc hiểu vào bài giảng</span>
              </button>
            </form>
          )}

          {/* TAB 3: ADD WRITING PROMPT */}
          {activeTab === 'writing' && (
            <form onSubmit={handleSavePrompt} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Khối Lớp:</label>
                  <select
                    value={wGrade}
                    onChange={(e) => setWGrade(Number(e.target.value) as Grade)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kiểu bài viết:</label>
                  <select
                    value={wGenre}
                    onChange={(e) => setWGenre(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  >
                    <option value="tu_su">Văn Tự sự (Kể lại trải nghiệm)</option>
                    <option value="bieu_cam">Văn Biểu cảm</option>
                    <option value="thuyet_minh">Văn Thuyết minh / Thông tin</option>
                    <option value="nghi_luan_xh">Văn Nghị luận xã hội</option>
                    <option value="nghi_luan_vh">Văn Nghị luận văn học</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên đề bài:</label>
                <input
                  type="text"
                  required
                  value={wTitle}
                  onChange={(e) => setWTitle(e.target.value)}
                  placeholder="Ví dụ: Bàn về sự kiên trì trong học tập..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Yêu cầu cụ thể của đề bài:</label>
                <textarea
                  rows={3}
                  required
                  value={wPrompt}
                  onChange={(e) => setWPrompt(e.target.value)}
                  placeholder="Viết đoạn văn khoảng 150 - 200 chữ..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tiêu chí chấm / Hướng dẫn (mỗi dòng một ý):
                </label>
                <textarea
                  rows={3}
                  value={wGuideline}
                  onChange={(e) => setWGuideline(e.target.value)}
                  placeholder="Có câu mở đoạn rõ ràng&#10;Có ít nhất 1 bằng chứng thực tế&#10;Liên kết câu mạch lạc"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Lưu đề luyện viết mới</span>
              </button>
            </form>
          )}

          {/* TAB 4: CLASSROOM PROJECTION GUIDE */}
          {activeTab === 'display' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-950 flex items-center gap-1.5 text-sm font-serif-vi">
                  <Tv className="w-4 h-4 text-indigo-600" />
                  <span>Kinh nghiệm trình chiếu 16:9 trên lớp học:</span>
                </h4>
                <ul className="space-y-2 list-disc list-inside leading-relaxed">
                  <li>
                    <strong>Tỷ lệ 16:9:</strong> Bấm nút TV ở thanh tiêu đề hoặc góc robot để phóng toàn màn hình, giao diện tự động dàn trải tối ưu cho máy chiếu trường học và tivi tương tác (Smart Board).
                  </li>
                  <li>
                    <strong>Tương tác micro tại lớp:</strong> Thầy cô có thể gọi học sinh lên bảng nói vào mic máy tính. Học sinh chỉ cần nói "Chọn A", "Đáp án C" hoặc trả lời câu hỏi đọc hiểu.
                  </li>
                  <li>
                    <strong>Sơ đồ tư duy trên bảng:</strong> Thầy cô có thể xuất PNG hoặc SVG để chèn trực tiếp vào slide PowerPoint bài giảng.
                  </li>
                  <li>
                    <strong>Chế độ giảm chuyển động:</strong> Nếu máy chiếu tần số quét thấp, bấm nút con mắt trên nhân vật để tắt chuyển động nhấp nháy, giúp mắt học sinh không mỏi.
                  </li>
                </ul>
              </div>

              {/* Data backup / reset */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800">Sao lưu & Quản lý dữ liệu giáo viên:</h5>
                  <p className="text-[11px] text-slate-500">
                    Tải về file JSON các câu hỏi & đoạn trích đã tạo để dùng lại cho các lớp khác.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất file JSON</span>
                  </button>
                  {(customQuizzes.length > 0 || customPassages.length > 0 || customPrompts.length > 0) && (
                    <button
                      onClick={onClearCustomData}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa dữ liệu đã tạo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
