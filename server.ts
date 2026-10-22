import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

app.use(express.json({ limit: '10mb' }));

// Health and Status Check
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    mode: apiKey ? 'ai_connected' : 'demo_curriculum',
    character: 'VĂN AI',
    curriculum: 'GDPT 2018 (Lớp 6–9)',
  });
});

// A. Hỏi đáp Ngữ văn (Interactive Q&A)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { prompt, grade = 7, topic = 'van-hoc', history = [] } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Nội dung câu hỏi không được để trống' });
    }

    if (!ai) {
      // Offline fallback pedagogical response
      return res.json({
        reply: `Chào em! Hiện tại hệ thống đang ở chế độ Giáo trình Mẫu GDPT 2018 (Chưa kích hoạt GEMINI_API_KEY). \n\nVới câu hỏi của em ở Lớp ${grade} về chủ đề này, thầy/cô Văn AI gợi ý:\n1. Hãy chú ý bám sát đặc trưng thể loại và bằng chứng ngôn ngữ trong bài.\n2. Vận dụng các kiến thức về từ ngữ, biện pháp tu từ và ngôi kể đã học.\n\nEm hãy thử đối chiếu với các câu hỏi gợi mở trong phần Đọc hiểu hoặc Đố vui để củng cố nhé!`,
        isAiGenerated: false,
      });
    }

    const systemInstruction = `Bạn là "VĂN AI" - Trợ giảng Ngữ văn THCS chuẩn mực, thân thiện và giàu tính sư phạm theo Chương trình Giáo dục phổ thông (GDPT 2018) của Việt Nam.
Đối tượng trò chuyện: Học sinh THCS (Lớp ${grade}).
Chủ đề hiện tại: ${topic}.
Nguyên tắc tương tác:
1. Luôn dùng 100% tiếng Việt chuẩn chính tả, ngữ pháp, xưng hô thân mật, lịch sự ("thầy/cô Văn AI" hoặc "Văn AI" và gọi học sinh là "em").
2. Giải thích ngắn gọn, dễ hiểu, phù hợp tâm lý lứa tuổi lớp ${grade}.
3. TUYỆT ĐỐI KHÔNG làm bài tập hộ hoặc viết toàn bộ bài văn thay học sinh. Hãy giải thích bản chất, nêu ví dụ minh họa và đặt câu hỏi gợi mở để học sinh tự suy nghĩ và tìm ra câu trả lời.
4. Tôn trọng mọi bộ sách giáo khoa (Cánh diều, Kết nối tri thức, Chân trời sáng tạo); bám sát chuẩn kiến thức kĩ năng GDPT 2018.
5. Không tự bịa lời thơ hoặc tên tác giả ngoài đời thực. Nếu thiếu ngữ liệu, hãy nhắc học sinh cung cấp đoạn trích để cùng phân tích.
6. Kết thúc câu trả lời bằng 1 câu hỏi gợi mở ngắn gọn kích thích học sinh tư duy.`;

    // Format history for Gemini contents
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history.slice(-6)) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Văn AI đã ghi nhận câu hỏi của em. Em có thể chia sẻ cụ thể hơn để cùng trao đổi nhé!';
    return res.json({ reply, isAiGenerated: true });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    return res.status(500).json({
      error: 'Không thể kết nối đến AI vào lúc này.',
      details: err?.message || 'Lỗi không xác định',
    });
  }
});

// C. Đọc hiểu: Đánh giá câu trả lời học sinh dựa trên văn bản
app.post('/api/reading-feedback', async (req: Request, res: Response) => {
  try {
    const { grade, passageTitle, excerpt, questionText, questionLevel, studentAnswer } = req.body;

    if (!studentAnswer || !studentAnswer.trim()) {
      return res.status(400).json({ error: 'Vui lòng cung cấp câu trả lời của học sinh' });
    }

    if (!ai) {
      return res.json({
        feedback: `Nhận xét mẫu (Chế độ minh họa): Câu trả lời của em đã bám sát câu hỏi ở mức độ "${questionLevel}". Em hãy nhớ trích dẫn thêm từ ngữ hoặc dòng thơ/câu văn cụ thể từ đoạn trích để luận cứ thêm vững chắc nhé!`,
        hasTextualEvidence: studentAnswer.length > 20,
        suggestedImprovement: 'Bổ sung dẫn chứng trực tiếp từ ngữ liệu.',
        isAiGenerated: false,
      });
    }

    const prompt = `Phân tích câu trả lời đọc hiểu của học sinh Lớp ${grade} theo chuẩn GDPT 2018:
Văn bản: "${passageTitle}"
Trích đoạn:
"""
${excerpt}
"""
Câu hỏi (${questionLevel}): "${questionText}"
Câu trả lời của học sinh:
"""
${studentAnswer}
"""

Hãy đưa ra nhận xét sư phạm theo định dạng:
1. [Ghi nhận]: Điểm đúng, điểm sáng tạo hoặc sự nỗ lực trong câu trả lời của em.
2. [Đối chiếu ngữ liệu]: Kiểm tra xem câu trả lời đã bám sát từ ngữ/chi tiết trong đoạn trích chưa.
3. [Gợi mở hoàn thiện]: Gợi ý 1 ý để câu trả lời trọn vẹn và sâu sắc hơn (KHÔNG chấm điểm số, KHÔNG viết đáp án mẫu dài dòng).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia thẩm định đọc hiểu Ngữ văn THCS. Nhận xét chân thành, tôn trọng suy nghĩ của học sinh, khích lệ tư duy phản biện dựa trên bằng chứng văn bản.',
        temperature: 0.6,
      },
    });

    return res.json({
      feedback: response.text || 'Em đã có câu trả lời rất đáng khích lệ! Hãy đối chiếu thêm các từ ngữ trong trích đoạn để câu chữ thêm sắc sảo.',
      isAiGenerated: true,
    });
  } catch (err: any) {
    console.error('Reading feedback error:', err);
    return res.status(500).json({ error: 'Lỗi khi phân tích câu trả lời đọc hiểu', details: err?.message });
  }
});

// D. Luyện viết: Đánh giá bài văn theo 3 mục
app.post('/api/writing-critique', async (req: Request, res: Response) => {
  try {
    const { grade, genre, promptTitle, promptText, studentEssay } = req.body;

    if (!studentEssay || studentEssay.trim().length < 15) {
      return res.status(400).json({ error: 'Đoạn văn của em còn quá ngắn để AI nhận xét. Hãy viết ít nhất một câu trọn vẹn nhé!' });
    }

    if (!ai) {
      return res.json({
        strengths: [
          'Đoạn văn có ý thức bám sát chủ đề đề bài yêu cầu.',
          'Sử dụng được từ ngữ gợi tả và cảm xúc chân thành của lứa tuổi học trò.',
        ],
        improvements: [
          'Cần chú ý thêm về các liên từ chuyển tiếp giữa các câu để đoạn văn mạch lạc hơn.',
          'Kiểm tra lại một vài dấu câu ngắt nghỉ để câu văn không bị quá dài.',
        ],
        sentenceEdits: [
          {
            original: studentEssay.split('.')[0] || studentEssay.slice(0, 50),
            suggested: 'Hãy mở đầu bằng một câu chủ đề rõ ràng, kết hợp từ ngữ gợi cảm để thu hút người đọc.',
            reason: 'Tăng tính hấp dẫn và định hình cảm xúc chủ đạo ngay từ câu đầu.',
          },
        ],
        encouragement: 'Văn AI rất ấn tượng với sự cố gắng của em! Hãy tiếp tục rèn luyện ngòi bút mỗi ngày nhé.',
        isAiGenerated: false,
      });
    }

    const systemInstruction = `Bạn là giám khảo và huấn luyện viên kỹ năng Viết môn Ngữ văn THCS GDPT 2018.
Nhiệm vụ: Nhận xét đoạn văn của học sinh Lớp ${grade} cho thể loại: ${genre}.
YÊU CẦU BẮT BUỘC:
- Trả về kết quả hoàn toàn theo định dạng JSON với cấu trúc:
{
  "strengths": ["điểm tốt 1", "điểm tốt 2", ...],
  "improvements": ["điều cần cải thiện 1", "điều cần cải thiện 2", ...],
  "sentenceEdits": [
    {
      "original": "câu gốc của học sinh trích từ bài",
      "suggested": "câu gợi ý chỉnh sửa hay hơn",
      "reason": "lí do chỉnh sửa sư phạm"
    }
  ],
  "encouragement": "lời khích lệ ngắn gọn, ấm áp"
}
- KHÔNG viết bài văn hoàn chỉnh thay cho học sinh.
- Chỉ chọn 1 đến 2 câu trong bài của học sinh để gợi ý trau chuốt (từ ngữ, liên kết, tu từ).`;

    const userPrompt = `Đề bài: "${promptTitle}" - ${promptText}
Bài viết của học sinh (Lớp ${grade}):
"""
${studentEssay}
"""
Hãy đưa ra nhận xét chi tiết dạng JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Danh sách các điểm tốt của bài viết',
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Danh sách các điều học sinh cần cải thiện',
            },
            sentenceEdits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  suggested: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['original', 'suggested', 'reason'],
              },
              description: 'Gợi ý chỉnh sửa 1-2 câu cụ thể',
            },
            encouragement: {
              type: Type.STRING,
              description: 'Lời động viên sư phạm ấm áp',
            },
          },
          required: ['strengths', 'improvements', 'sentenceEdits', 'encouragement'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, isAiGenerated: true });
  } catch (err: any) {
    console.error('Writing critique error:', err);
    return res.status(500).json({ error: 'Không thể phân tích đoạn văn lúc này', details: err?.message });
  }
});

// E. Sơ đồ tư duy: Tạo khung ý tưởng nhánh
app.post('/api/mindmap-generate', async (req: Request, res: Response) => {
  try {
    const { topic, grade = 7 } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập tên chủ đề hoặc tác phẩm' });
    }

    if (!ai) {
      // Demo mindmap structure
      return res.json({
        root: {
          id: 'root-gen',
          label: topic,
          type: 'root',
          children: [
            {
              id: 'branch-1',
              label: '1. Khái quát & Bối cảnh',
              type: 'theme',
              children: [
                { id: 'b1-1', label: 'Thể loại và đặc trưng GDPT 2018', type: 'detail' },
                { id: 'b1-2', label: 'Hoàn cảnh & Cảm hứng sáng tác', type: 'detail' },
              ],
            },
            {
              id: 'branch-2',
              label: '2. Luận điểm & Chi tiết then chốt',
              type: 'theme',
              children: [
                { id: 'b2-1', label: 'Hệ thống hình ảnh / sự việc tiêu biểu', type: 'branch' },
                { id: 'b2-2', label: 'Các biện pháp tu từ đặc sắc', type: 'quote' },
              ],
            },
            {
              id: 'branch-3',
              label: '3. Cảm xúc & Thông điệp tư tưởng',
              type: 'theme',
              children: [
                { id: 'b3-1', label: 'Tình cảm, thái độ của tác giả/người viết', type: 'emotion' },
                { id: 'b3-2', label: 'Bài học nhân văn rút ra cho bản thân', type: 'emotion' },
              ],
            },
          ],
        },
        isAiGenerated: false,
      });
    }

    const systemInstruction = `Bạn là chuyên gia phương pháp dạy học Ngữ văn THCS (GDPT 2018).
Nhiệm vụ: Tạo cây sơ đồ tư duy logic cho chủ đề/tác phẩm môn Ngữ văn Lớp ${grade}.
QUY TẮC QUAN TRỌNG:
- Trả về JSON theo cấu trúc cây:
{
  "root": {
    "id": "root",
    "label": "Tên chủ đề ngắn gọn",
    "type": "root",
    "children": [
      {
        "id": "string",
        "label": "Tên nhánh chính (Luận điểm / Khía cạnh)",
        "type": "theme",
        "children": [
          { "id": "string", "label": "Ý phụ / Chi tiết / Biện pháp tu từ", "type": "branch" | "quote" | "emotion" | "detail" }
        ]
      }
    ]
  }
}
- Đây là KHUNG DÀN Ý gợi mở để học sinh tự điền thêm dẫn chứng từ bài học SGK của mình.
- Tối đa 3-4 nhánh chính, mỗi nhánh chính có 2-3 nhánh phụ súc tích.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Tạo sơ đồ tư duy phân nhánh cho chủ đề: "${topic}" dành cho học sinh Lớp ${grade}.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, isAiGenerated: true });
  } catch (err: any) {
    console.error('Mindmap generate error:', err);
    return res.status(500).json({ error: 'Không thể tạo sơ đồ tư duy', details: err?.message });
  }
});

// Giọng nói TTS: Chuyển văn bản thành tiếng nói tự nhiên
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Thiếu nội dung văn bản cần đọc' });
    }

    // Limit length for TTS to prevent excessive token usage
    const cleanText = text.slice(0, 400).trim();

    if (!ai) {
      // In offline/demo mode, let frontend use window.speechSynthesis
      return res.json({ useWebSpeechFallback: true, message: 'Dùng Web Speech API vi-VN trên trình duyệt' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style: 'Friendly, encouraging, clear academic Vietnamese teacher',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
          useWebSpeechFallback: false,
        });
      }
    } catch (ttsError) {
      console.warn('Gemini TTS warning, falling back to Web Speech:', ttsError);
    }

    // Fallback indicator
    return res.json({ useWebSpeechFallback: true });
  } catch (err: any) {
    return res.json({ useWebSpeechFallback: true });
  }
});

// Production static assets or Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = http.createServer(app);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[VĂN AI Server] Đang chạy tại http://0.0.0.0:${PORT} (${isProd ? 'Production' : 'Development'})`);
    console.log(`[VĂN AI Server] Trạng thái Gemini API Key: ${apiKey ? 'ĐÃ KẾT NỐI' : 'CHẾ ĐỘ MINH HỌA GIÁO TRÌNH'}`);
  });
}

startServer().catch((err) => {
  console.error('Không thể khởi động server:', err);
  process.exit(1);
});
