import React from 'react';
import { ShieldCheck, X, Lock, CheckCircle2, AlertTriangle, EyeOff, Bot, FileText } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAiConnected: boolean;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose, isAiConnected }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/10 text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-vi">
                Cam kết An toàn Học sinh & Bản quyền Giáo dục
              </h2>
              <p className="text-xs text-emerald-100">
                Tuân thủ bảo vệ dữ liệu lứa tuổi THCS & Chương trình GDPT 2018
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Card 1: Privacy */}
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-emerald-700" />
              <span>1. Không thu thập thông tin nhận dạng cá nhân (PII)</span>
            </h4>
            <p className="text-slate-700">
              Ứng dụng <strong>VĂN AI</strong> tuyệt đối không yêu cầu họ tên, ngày sinh, trường lớp, số điện thoại hay email của học sinh. Mọi dữ liệu đoạn văn hay câu hỏi chỉ lưu tạm thời trong phiên học hiện tại trên trình duyệt và tự động biến mất khi đóng tab hoặc bấm "Xóa phiên".
            </p>
          </div>

          {/* Card 2: Voice & Audio Data */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-700" />
              <span>2. Minh bạch về xử lý Giọng nói & AI bên thứ ba</span>
            </h4>
            <p className="text-slate-700">
              - Khi học sinh sử dụng micro, âm thanh được nhận dạng cục bộ thông qua trình duyệt (Web Speech API).
              <br />- Ở chế độ có API Key, các yêu cầu gửi đến mô hình Gemini diễn ra an toàn qua máy chủ backend, <strong>không bao giờ lưu trữ file ghi âm dài hạn</strong> trên máy chủ.
              <br />- Trạng thái hiện tại: <strong>{isAiConnected ? 'Đã kết nối AI theo lượt (Turn-based)' : 'Chế độ Giáo trình minh họa GDPT 2018'}</strong>.
            </p>
          </div>

          {/* Card 3: Academic Integrity */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>3. Liêm chính học thuật & Hướng dẫn sử dụng trung thực</span>
            </h4>
            <p className="text-slate-700">
              - Văn AI được thiết kế theo nguyên tắc sư phạm: <strong>chỉ gợi ý, giải thích bản chất và đặt câu hỏi mở</strong>, kiên quyết không viết toàn bộ bài văn hoặc giải bài hộ học sinh.
              <br />- Không tự bịa dẫn chứng văn học hay lời thơ. Mọi ngữ liệu mẫu trong ứng dụng đều được đánh dấu rõ là văn bản minh họa chuẩn GDPT 2018.
            </p>
          </div>

          {/* Card 4: Persona identity */}
          <div className="p-3.5 bg-violet-50/80 border border-violet-200 rounded-xl space-y-1.5">
            <h4 className="font-bold text-violet-950 text-sm flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-violet-700" />
              <span>4. Định vị nhân vật AI</span>
            </h4>
            <p className="text-slate-700">
              Nhân vật Văn AI là trợ giảng kỹ thuật số sử dụng trí tuệ nhân tạo, không tự nhận là người thật và luôn khuyến khích học sinh lắng nghe sự hướng dẫn trực tiếp từ quý thầy cô giáo bộ môn trên lớp.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            Đã hiểu & Tiếp tục học tập
          </button>
        </div>
      </div>
    </div>
  );
};
