import React, { useState, useRef, useEffect } from 'react';
import { Grade, MindMapNode } from '../types';
import { MINDMAP_TEMPLATES } from '../data/curriculumData';
import {
  Network,
  Download,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  RotateCcw,
  BookOpen,
  Info,
  Check,
  X,
  FileImage,
} from 'lucide-react';

interface ModeMindmapProps {
  grade: Grade;
  onGenerateMindmap: (topic: string, grade: Grade) => Promise<MindMapNode>;
  isLoading: boolean;
  onPraiseCharacter: () => void;
}

export const ModeMindmap: React.FC<ModeMindmapProps> = ({
  grade,
  onGenerateMindmap,
  isLoading,
  onPraiseCharacter,
}) => {
  const [rootNode, setRootNode] = useState<MindMapNode>(MINDMAP_TEMPLATES[grade]);
  const [topicInput, setTopicInput] = useState('');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  // Update root node when grade changes
  useEffect(() => {
    setRootNode(MINDMAP_TEMPLATES[grade]);
  }, [grade]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isLoading) return;
    const generated = await onGenerateMindmap(topicInput.trim(), grade);
    setRootNode(generated);
    onPraiseCharacter();
  };

  const handleResetToTemplate = () => {
    setRootNode(MINDMAP_TEMPLATES[grade]);
    setTopicInput('');
  };

  // Add child to a node
  const handleAddChild = (parentId: string) => {
    const addRecursive = (node: MindMapNode): MindMapNode => {
      if (node.id === parentId) {
        const newChild: MindMapNode = {
          id: `node-${Date.now()}`,
          label: 'Nhánh ý tưởng mới (bấm sửa)',
          type: node.type === 'root' ? 'theme' : 'branch',
        };
        return {
          ...node,
          children: [...(node.children || []), newChild],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(addRecursive),
        };
      }
      return node;
    };

    setRootNode(addRecursive(rootNode));
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === rootNode.id) return; // Cannot delete root

    const deleteRecursive = (node: MindMapNode): MindMapNode => {
      if (!node.children) return node;
      return {
        ...node,
        children: node.children.filter((child) => child.id !== nodeId).map(deleteRecursive),
      };
    };

    setRootNode(deleteRecursive(rootNode));
  };

  // Edit node label
  const handleStartEdit = (node: MindMapNode) => {
    setEditingNodeId(node.id);
    setEditText(node.label);
  };

  const handleSaveEdit = (nodeId: string) => {
    if (!editText.trim()) return;

    const editRecursive = (node: MindMapNode): MindMapNode => {
      if (node.id === nodeId) {
        return { ...node, label: editText.trim() };
      }
      if (node.children) {
        return { ...node, children: node.children.map(editRecursive) };
      }
      return node;
    };

    setRootNode(editRecursive(rootNode));
    setEditingNodeId(null);
  };

  // Export as SVG file
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `so-do-tu-duy-lop-${grade}-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export as PNG file via HTML5 canvas
  const handleExportPNG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `so-do-tu-duy-lop-${grade}-${Date.now()}.png`;
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-violet-50/80 via-indigo-50/40 to-white px-5 py-3 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-violet-600 text-white">
            <Network className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-indigo-950 font-serif-vi">
              Chế độ E: Sơ đồ tư duy Ngữ văn Lớp {grade}
            </h2>
            <p className="text-[11px] text-slate-500">
              Khung dàn ý logic • Thêm/sửa nhánh trực tiếp • Xuất ảnh PNG & SVG chất lượng cao
            </p>
          </div>
        </div>

        {/* Action Tools: Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSVG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            title="Xuất file vector SVG sắc nét"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất SVG</span>
          </button>

          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Xuất ảnh PNG để chèn vào bài học hoặc máy chiếu"
          >
            <FileImage className="w-3.5 h-3.5" />
            <span>Xuất PNG</span>
          </button>
        </div>
      </div>

      {/* Topic Prompt Search & Generator Bar */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <form onSubmit={handleGenerate} className="flex-1 flex items-center gap-2 max-w-xl">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder={`Nhập tác phẩm / chủ đề Lớp ${grade} (ví dụ: Đồng dao mùa xuân, Văn bản nghị luận, Thuyết minh...)`}
            className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            disabled={!topicInput.trim() || isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isLoading ? 'Đang tạo...' : 'Tạo sơ đồ mới'}</span>
          </button>
        </form>

        <button
          onClick={handleResetToTemplate}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-700 px-2 py-1 rounded-lg hover:bg-white transition-colors cursor-pointer"
          title="Khôi phục sơ đồ mẫu chuẩn Lớp hiện tại"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Sơ đồ mẫu chuẩn</span>
        </button>
      </div>

      {/* Main Interactive Canvas & Interactive Node Tree */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto bg-slate-50/50 flex flex-col justify-between">
        {/* Visual SVG Diagram for Direct Viewing & Export */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-sm overflow-x-auto min-h-[460px] flex items-center justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 1200 800"
            className="w-full max-w-[1100px] h-auto select-none font-sans"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="rootNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
              <linearGradient id="themeNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Background Rect for Canvas PNG export */}
            <rect width="1200" height="800" fill="#f8fafc" rx="16" />

            {/* Decorative Classroom Watermark / Header in SVG */}
            <text x="40" y="45" fill="#4338ca" fontSize="18" fontWeight="bold">
              VĂN AI • SƠ ĐỒ TƯ DUY NGỮ VĂN GDPT 2018 (LỚP {grade})
            </text>
            <text x="40" y="70" fill="#64748b" fontSize="12">
              Khung dàn ý sư phạm • Tự biên tập & phân tích dẫn chứng văn bản
            </text>

            {/* Center Root Node */}
            <g transform="translate(180, 400)">
              <rect
                x="-140"
                y="-36"
                width="280"
                height="72"
                rx="20"
                fill="url(#rootNodeGrad)"
                filter="url(#nodeShadow)"
              />
              <text
                x="0"
                y="6"
                fill="#ffffff"
                fontSize="15"
                fontWeight="bold"
                textAnchor="middle"
              >
                {rootNode.label.length > 28 ? rootNode.label.slice(0, 26) + '...' : rootNode.label}
              </text>
            </g>

            {/* Branch Level 1 (Themes) & Level 2 (Details) */}
            {rootNode.children &&
              rootNode.children.map((themeNode, tIdx) => {
                const totalThemes = rootNode.children!.length;
                const spacing = 700 / (totalThemes + 1);
                const themeY = 100 + (tIdx + 1) * spacing;
                const themeX = 520;

                return (
                  <g key={themeNode.id}>
                    {/* Connecting Curved Line from Root to Theme */}
                    <path
                      d={`M 320,400 C 420,400 420,${themeY} ${themeX - 110},${themeY}`}
                      stroke="#818cf8"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Theme Node Rect */}
                    <rect
                      x={themeX - 110}
                      y={themeY - 26}
                      width="220"
                      height="52"
                      rx="14"
                      fill="url(#themeNodeGrad)"
                      filter="url(#nodeShadow)"
                    />
                    <text
                      x={themeX}
                      y={themeY + 5}
                      fill="#ffffff"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {themeNode.label.length > 24 ? themeNode.label.slice(0, 22) + '...' : themeNode.label}
                    </text>

                    {/* Sub-children details on the right */}
                    {themeNode.children &&
                      themeNode.children.map((detailNode, dIdx) => {
                        const totalDetails = themeNode.children!.length;
                        const dSpacing = 42;
                        const detailY = themeY - ((totalDetails - 1) * dSpacing) / 2 + dIdx * dSpacing;
                        const detailX = 860;

                        return (
                          <g key={detailNode.id}>
                            {/* Branch connector */}
                            <path
                              d={`M ${themeX + 110},${themeY} C ${themeX + 160},${themeY} ${detailX - 120},${detailY} ${detailX - 100},${detailY}`}
                              stroke="#c7d2fe"
                              strokeWidth="2.5"
                              fill="none"
                            />

                            {/* Detail Node Pill */}
                            <rect
                              x={detailX - 110}
                              y={detailY - 18}
                              width="250"
                              height="36"
                              rx="10"
                              fill="#ffffff"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                              filter="url(#nodeShadow)"
                            />
                            <circle cx={detailX - 96} cy={detailY} r="4" fill="#6366f1" />
                            <text
                              x={detailX - 84}
                              y={detailY + 4}
                              fill="#1e293b"
                              fontSize="11"
                              fontWeight="500"
                            >
                              {detailNode.label.length > 30
                                ? detailNode.label.slice(0, 28) + '...'
                                : detailNode.label}
                            </text>
                          </g>
                        );
                      })}
                  </g>
                );
              })}
          </svg>
        </div>

        {/* Interactive Editing Tree Panel for Direct Adjustments */}
        <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-violet-600" />
              Biên tập & tuỳ chỉnh các nhánh ý tưởng:
            </span>
            <button
              onClick={() => handleAddChild(rootNode.id)}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 font-semibold cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm Luận điểm chính</span>
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {/* Root item */}
            <div className="flex items-center justify-between p-2.5 bg-violet-50 rounded-xl border border-violet-200">
              {editingNodeId === rootNode.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-white border border-violet-400 rounded-lg px-2 py-1 text-xs"
                    autoFocus
                  />
                  <button onClick={() => handleSaveEdit(rootNode.id)} className="text-emerald-600 p-1">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingNodeId(null)} className="text-slate-400 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold text-violet-950">
                    🌟 Chủ đề gốc: {rootNode.label}
                  </span>
                  <button
                    onClick={() => handleStartEdit(rootNode)}
                    className="text-xs text-slate-500 hover:text-violet-700 p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            {/* Sub-branches */}
            {rootNode.children?.map((theme) => (
              <div key={theme.id} className="pl-4 space-y-1.5 border-l-2 border-violet-200">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {editingNodeId === theme.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 bg-white border border-indigo-400 rounded-lg px-2 py-1 text-xs"
                        autoFocus
                      />
                      <button onClick={() => handleSaveEdit(theme.id)} className="text-emerald-600 p-1">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingNodeId(null)} className="text-slate-400 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-semibold text-indigo-900">{theme.label}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAddChild(theme.id)}
                          title="Thêm ý chi tiết vào nhánh này"
                          className="p-1 text-violet-600 hover:text-violet-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(theme)}
                          title="Sửa tên nhánh"
                          className="p-1 text-slate-500 hover:text-indigo-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNode(theme.id)}
                          title="Xóa nhánh này"
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Sub details */}
                {theme.children?.map((detail) => (
                  <div key={detail.id} className="pl-6 flex items-center justify-between p-1.5 bg-white rounded-md border border-slate-100 text-[11px] text-slate-700">
                    {editingNodeId === detail.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs"
                          autoFocus
                        />
                        <button onClick={() => handleSaveEdit(detail.id)} className="text-emerald-600">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingNodeId(null)} className="text-slate-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="truncate mr-2">• {detail.label}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => handleStartEdit(detail)} className="text-slate-400 hover:text-indigo-600">
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleDeleteNode(detail.id)} className="text-slate-400 hover:text-rose-600">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 italic flex items-center gap-1 pt-1 border-t border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Mọi nhánh là DÀN Ý/KHUNG gợi ý nếu thiếu văn bản gốc, không giả vờ phân tích tác phẩm chưa có nguồn.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
