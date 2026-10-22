export type Grade = 6 | 7 | 8 | 9;

export type Topic = 
  | 'doc-hieu' 
  | 'tieng-viet' 
  | 'viet' 
  | 'van-hoc' 
  | 'tong-hop';

export type AppMode = 'qa' | 'quiz' | 'reading' | 'writing' | 'mindmap';

export type CharacterState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'praised';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  highlightClues?: string[];
  suggestedFollowUp?: string[];
}

export interface QuizQuestion {
  id: string;
  grade: Grade;
  topic: Topic;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  pedagogicalNote?: string;
  bookSeriesNote?: string;
}

export interface ReadingQuestion {
  id: string;
  level: 'nhan_biet' | 'thong_hieu' | 'van_dung';
  levelLabel: string;
  text: string;
  guidePrompt: string;
  textualEvidenceHint: string;
}

export interface ReadingPassage {
  id: string;
  grade: Grade;
  title: string;
  genre: string;
  isSelfComposedDemo: boolean;
  sourceAnnotation: string;
  excerpt: string;
  lineCount: number;
  vocabularyNotes: { word: string; meaning: string }[];
  questions: ReadingQuestion[];
}

export interface WritingPrompt {
  id: string;
  grade: Grade;
  genre: 'tu_su' | 'bieu_cam' | 'thuyet_minh' | 'nghi_luan_xh' | 'nghi_luan_vh';
  genreLabel: string;
  title: string;
  prompt: string;
  guidelines: string[];
  suggestedOutlines: string[];
}

export interface WritingCritiqueResponse {
  strengths: string[];
  improvements: string[];
  sentenceEdits: {
    original: string;
    suggested: string;
    reason: string;
  }[];
  encouragement: string;
  isAiGenerated?: boolean;
}

export interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'theme' | 'branch' | 'detail' | 'quote' | 'emotion';
  color?: string;
  children?: MindMapNode[];
}

export interface TeacherCustomData {
  customQuizzes: QuizQuestion[];
  customPassages: ReadingPassage[];
  customPrompts: WritingPrompt[];
}
