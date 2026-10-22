import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

function getPedagogicalFallback(prompt: string, grade: number, topic: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('nhân hoá') || p.includes('nhan hoa')) {
    return `Chào em! Biện pháp nhân hoá là cách gọi hoặc tả con vật, đồ vật, cây cối... bằng những từ ngữ vốn dùng để gọi hoặc tả con người.\n\nCó 3 hình thức nhân hoá thường gặp:\n1. Dùng từ ngữ gọi người để gọi vật (ví dụ: Bác gà trống, chị ong nâu).\n2. Dùng từ ngữ chỉ hoạt động, tính chất của người cho vật (ví dụ: Dòng sông uốn mình, mây dạo chơi).\n3. Trò chuyện, xưng hô với vật như với người.\n\nTác dụng: Làm cho thế giới đồ vật, thiên nhiên trở nên gần gũi, sống động và giàu cảm xúc hơn. Em hãy thử tìm một câu văn có hình ảnh nhân hoá trong bài em đang học nhé!`;
  }
  if (p.includes('so sánh') || p.includes('so sanh')) {
    return `Chào em! Biện pháp so sánh là cách đối chiếu sự vật, hiện tượng này với sự vật, hiện tượng khác có nét tương đồng nhằm tăng sức gợi hình, gợi cảm.\n\nCấu trúc so sánh thông thường gồm 4 yếu tố:\n- Vế A (sự vật được so sánh)\n- Phương diện so sánh\n- Từ so sánh (như, là, tựa như, giống như...)\n- Vế B (sự vật dùng để so sánh)\n\nVí dụ: "Mặt trời đỏ rực như một quả cầu lửa".\nEm hãy thử xác định vế A và vế B trong câu: "Trẻ em như búp trên cành" nhé!`;
  }
  if (p.includes('ngôi kể') || p.includes('ngoi ke')) {
    return `Chào em! Trong văn tự sự THCS, hai ngôi kể quan trọng nhất là:\n- Ngôi thứ nhất (người kể xưng "tôi" hoặc "em"): Người kể trực tiếp tham gia vào câu chuyện, dễ dàng bộc lộ trực tiếp cảm xúc, suy nghĩ và trải nghiệm chân thực của bản thân.\n- Ngôi thứ ba (người kể giấu mình, gọi tên nhân vật): Điểm nhìn linh hoạt, khách quan, có thể bao quát hành động của nhiều nhân vật ở nhiều không gian khác nhau.\n\nKhi viết bài kể lại một trải nghiệm sâu sắc của bản thân ở Lớp ${grade}, ngôi thứ nhất là lựa chọn tự nhiên nhất em nhé!`;
  }
  if (p.includes('từ láy') || p.includes('tu lay')) {
    return `Chào em! Từ láy là từ phức có sự hòa phối âm thanh giữa các tiếng:\n- Láy toàn bộ: xanh xanh, thoang thoảng.\n- Láy bộ phận: gồm láy âm đầu (long lanh, mênh mông) hoặc láy vần (liêu xiêu, róc rách).\n\nVề công dụng:\n- Từ láy tượng hình gợi tả hình dáng, đường nét (gập ghềnh, thoăn thoắt).\n- Từ láy tượng thanh mô phỏng âm thanh sống động (róc rách, ào ào).\n\nEm hãy thử phân biệt: "lấp lánh" và "róc rách" từ nào là tượng hình, từ nào là tượng thanh nhé!`;
  }
  if (p.includes('luận điểm') || p.includes('luan diem') || p.includes('lí lẽ') || p.includes('li le')) {
    return `Chào em! Trong văn nghị luận THCS:\n- Luận điểm: Ý kiến lớn thể hiện quan điểm của người viết về vấn đề.\n- Lí lẽ: Lời giải thích, lập luận vì sao lại khẳng định như vậy.\n- Bằng chứng (dẫn chứng): Sự việc, nhân vật, số liệu thực tế được đưa ra để chứng minh cho lí lẽ.\n\nMột đoạn văn nghị luận chặt chẽ luôn cần sự kết hợp hài hòa giữa luận điểm rõ ràng, lí lẽ sắc bén và dẫn chứng thuyết phục em nhé!`;
  }
  return `Chào em! Thầy/cô Văn AI đã ghi nhận câu hỏi của em về chủ đề ${topic} môn Ngữ văn Lớp ${grade}.\n\nĐể phân tích và nắm vững kiến thức này theo chuẩn GDPT 2018:\n1. Hãy bám sát đặc trưng thể loại và mạch cảm xúc của văn bản.\n2. Quan sát các chi tiết hình ảnh, từ ngữ đặc sắc và biện pháp tu từ được tác giả sử dụng.\n3. Rút ra bài học và thông điệp nhân văn đọng lại sau bài học.\n\nEm hãy chia sẻ cụ thể đoạn văn hoặc câu thơ em đang tìm hiểu để cùng Văn AI trao đổi sâu hơn nhé!`;
}

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

    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const timeoutPromise = new Promise<{ text?: string }>((_, reject) =>
      setTimeout(() => reject(new Error('AI_TIMEOUT')), 8500)
    );

    const response = (await Promise.race([geminiPromise, timeoutPromise])) as any;
    const reply = response?.text || getPedagogicalFallback(prompt, grade, topic);
    return res.json({ reply, isAiGenerated: true });
  } catch (err: any) {
    console.warn('Gemini chat handled with pedagogical fallback:', err?.message);
    const fallback = getPedagogicalFallback(
      req.body?.prompt || '',
      Number(req.body?.grade) || 7,
      req.body?.topic || 'tieng-viet'
    );
    return res.json({ reply: fallback, isAiGenerated: false });
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
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
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
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
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
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, isAiGenerated: true });
  } catch (err: any) {
    console.error('Mindmap generate error:', err);
    return res.status(500).json({ error: 'Không thể tạo sơ đồ tư duy', details: err?.message });
  }
});

function splitTextIntoAudioChunks(text: string, maxLen = 170): string[] {
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/[`_~>]/g, '')
    .replace(/[✨🌟⭐💫💖💡🎉]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  // Limit to first ~800 chars for smooth classroom speech
  const boundedText = clean.slice(0, 900);
  const sentences = boundedText.split(/(?<=[.!?;\n])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length <= maxLen) {
      current = (current ? current + ' ' + sentence : sentence).trim();
    } else {
      if (current) chunks.push(current);
      if (sentence.length > maxLen) {
        const parts = sentence.split(/(?<=[,])\s+/);
        let sub = '';
        for (const p of parts) {
          if ((sub + ' ' + p).trim().length <= maxLen) {
            sub = (sub ? sub + ' ' + p : p).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = p;
          }
        }
        if (sub) chunks.push(sub);
        current = '';
      } else {
        current = sentence;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// Giọng nói TTS Tiếng Việt chuẩn mực, âm sắc tự nhiên 100%
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Thiếu nội dung văn bản cần đọc' });
    }

    const chunks = splitTextIntoAudioChunks(text);
    if (chunks.length === 0) {
      return res.status(400).json({ error: 'Nội dung rỗng' });
    }

    // Fetch Vietnamese speech audio chunks
    const chunkPromises = chunks.map(async (chunk) => {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        chunk
      )}&tl=vi&client=tw-ob`;
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      });
      if (!response.ok) {
        throw new Error(`TTS fetch failed with status ${response.status}`);
      }
      const arrayBuf = await response.arrayBuffer();
      return Buffer.from(arrayBuf);
    });

    const audioBuffers = await Promise.all(chunkPromises);
    const combinedBuffer = Buffer.concat(audioBuffers);

    return res.json({
      audioBase64: combinedBuffer.toString('base64'),
      mimeType: 'audio/mpeg',
      useWebSpeechFallback: false,
    });
  } catch (err: any) {
    console.warn('Backend Vietnamese TTS warning, falling back to Web Speech:', err?.message);
    return res.json({ useWebSpeechFallback: true });
  }
});

// Direct streaming audio endpoint for HTML5 audio tags
app.get('/api/audio', async (req: Request, res: Response) => {
  try {
    const text = String(req.query.text || '');
    if (!text.trim()) {
      return res.status(400).send('Missing text');
    }

    const chunks = splitTextIntoAudioChunks(text);
    if (chunks.length === 0) {
      return res.status(400).send('Empty text');
    }

    const chunkPromises = chunks.map(async (chunk) => {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        chunk
      )}&tl=vi&client=tw-ob`;
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
        },
      });
      if (!response.ok) throw new Error('TTS fetch error');
      const ab = await response.arrayBuffer();
      return Buffer.from(ab);
    });

    const buffers = await Promise.all(chunkPromises);
    const combined = Buffer.concat(buffers);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', combined.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.end(combined);
  } catch (err) {
    return res.status(500).send('TTS error');
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
