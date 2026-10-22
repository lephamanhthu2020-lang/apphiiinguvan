import { Grade, QuizQuestion, ReadingPassage, WritingPrompt, MindMapNode } from '../types';

export const TOPIC_LABELS: Record<string, string> = {
  'doc-hieu': 'Đọc hiểu văn bản',
  'tieng-viet': 'Tiếng Việt & Tu từ',
  'viet': 'Thực hành Viết',
  'van-hoc': 'Tri thức Ngữ văn',
  'tong-hop': 'Ôn tập Tổng hợp',
};

export const GRADE_THEMES: Record<Grade, { title: string; focus: string; coreSkills: string[] }> = {
  6: {
    title: 'Khám phá thế giới tuổi thơ & Gia đình',
    focus: 'Trải nghiệm cá nhân, ngôi kể thứ nhất/thứ ba, so sánh, nhân hoá, từ láy, thơ lục bát.',
    coreSkills: ['Nhận biết chi tiết tiêu biểu', 'Xác định biện pháp tu từ so sánh & nhân hoá', 'Kể lại một trải nghiệm sâu sắc', 'Phân biệt ngôi kể'],
  },
  7: {
    title: 'Cảm xúc cuộc sống & Thiên nhiên đất nước',
    focus: 'Văn biểu cảm, hình ảnh thơ, chủ đề, dẫn chứng văn bản, từ ngữ gợi cảm, trạng ngữ.',
    coreSkills: ['Bộc lộ tình cảm, cảm xúc chân thực', 'Phân tích tác dụng của trạng ngữ', 'Tìm bằng chứng trực tiếp trong văn bản', 'Thơ 4 chữ, 5 chữ'],
  },
  8: {
    title: 'Trải nghiệm cuộc đời & Lập luận sắc bén',
    focus: 'Phân tích truyện/thơ, văn bản nghị luận, luận điểm, lí lẽ, dẫn chứng, câu hỏi tu từ, điệp từ.',
    coreSkills: ['Xác định hệ thống luận điểm - lí lẽ - bằng chứng', 'Hiểu tác dụng câu hỏi tu từ, điệp ngữ', 'Viết bài văn nghị luận xã hội hoặc thuyết minh', 'Đọc hiểu truyện ngắn hiện đại'],
  },
  9: {
    title: 'Khát vọng tương lai & Chiều sâu tư tưởng',
    focus: 'Nghị luận xã hội & văn học, luận đề, tư duy phản biện, thông điệp tác giả, liên kết văn bản, hàm ý.',
    coreSkills: ['Xây dựng luận đề & phản biện đa chiều', 'Giải mã hàm ý trong đối thoại/văn cảnh', 'Liên kết câu và đoạn văn chặt chẽ', 'Phân tích chiều sâu nhân vật & tư tưởng'],
  },
};

export const SAMPLE_QA_SUGGESTIONS: Record<Grade, string[]> = {
  6: [
    'Thế nào là biện pháp nhân hoá và cho ví dụ?',
    'Làm sao để chọn ngôi kể phù hợp cho bài văn tự sự?',
    'Phân biệt từ láy và từ ghép như thế nào dễ nhớ nhất?',
    'Đặc điểm nhịp điệu của thể thơ lục bát là gì?',
  ],
  7: [
    'Trạng ngữ có những tác dụng gì trong câu?',
    'Làm thế nào để đưa cảm xúc chân thực vào bài văn biểu cảm?',
    'Cách tìm và trích dẫn bằng chứng từ văn bản thơ 4-5 chữ?',
    'Từ tượng hình và từ tượng thanh khác nhau ra sao?',
  ],
  8: [
    'Phân biệt "lí lẽ" và "bằng chứng" trong văn nghị luận?',
    'Tác dụng của câu hỏi tu từ trong đoạn văn phân tích?',
    'Cách lập dàn ý cho bài văn thuyết minh giải thích một hiện tượng?',
    'Làm thế nào để liên kết các luận điểm không bị rời rạc?',
  ],
  9: [
    'Cách nhận diện và phân tích "hàm ý" trong lời nói?',
    'Làm sao để đưa góc nhìn phản biện vào bài nghị luận xã hội?',
    'Phép thế và phép nối giúp ích gì cho tính mạch lạc của bài văn?',
    'Quy trình phân tích một tác phẩm truyện ngắn theo chuẩn GDPT 2018?',
  ],
};

export const QUIZ_DATABASE: QuizQuestion[] = [
  // LỚP 6
  {
    id: 'q6-1',
    grade: 6,
    topic: 'tieng-viet',
    question: 'Trong câu: "Mặt trời như một quả cầu lửa khổng lồ đang từ từ nhô lên từ mặt biển.", tác giả đã sử dụng biện pháp tu từ nào?',
    options: {
      A: 'Nhân hoá',
      B: 'So sánh',
      C: 'Ẩn dụ',
      D: 'Hoán dụ',
    },
    correctOption: 'B',
    explanation: 'Câu văn có từ so sánh "như", đặt hình ảnh "mặt trời" (vế A) đối chiếu với "quả cầu lửa khổng lồ" (vế B) dựa trên nét tương đồng về màu sắc và hình dáng.',
    pedagogicalNote: 'Lớp 6 chú trọng nhận diện cấu trúc mô hình so sánh: Vế A + Từ so sánh + Vế B.',
  },
  {
    id: 'q6-2',
    grade: 6,
    topic: 'tieng-viet',
    question: 'Từ nào dưới đây là TỪ LÁY tượng thanh?',
    options: {
      A: 'Lấp lánh',
      B: 'Mênh mông',
      C: 'Róc rách',
      D: 'Xanh xao',
    },
    correctOption: 'C',
    explanation: '"Róc rách" mô phỏng âm thanh của dòng suối hoặc nước chảy, nên là từ láy tượng thanh. "Lấp lánh", "mênh mông", "xanh xao" là từ láy tượng hình.',
    pedagogicalNote: 'Học sinh lớp 6 cần phân biệt từ láy mô phỏng âm thanh (tượng thanh) và gợi tả dáng vẻ (tượng hình).',
  },
  {
    id: 'q6-3',
    grade: 6,
    topic: 'viet',
    question: 'Khi viết bài văn kể lại một trải nghiệm sâu sắc của bản thân, em nên chọn ngôi kể nào phù hợp và tự nhiên nhất?',
    options: {
      A: 'Ngôi thứ nhất (xưng "tôi" hoặc "em")',
      B: 'Ngôi thứ hai (gọi "bạn")',
      C: 'Ngôi thứ ba (gọi tên nhân vật)',
      D: 'Kết hợp tuỳ tiện cả ba ngôi',
    },
    correctOption: 'A',
    explanation: 'Ngôi thứ nhất (xưng "tôi", "em") giúp người viết trực tiếp bày tỏ cảm xúc, suy nghĩ và những chi tiết chân thực về trải nghiệm cá nhân của chính mình.',
    pedagogicalNote: 'Kỹ năng định hình ngôi kể và điểm nhìn trong văn tự sự lớp 6.',
  },
  {
    id: 'q6-4',
    grade: 6,
    topic: 'van-hoc',
    question: 'Quy tắc gieo vần truyền thống của một cặp câu thơ lục bát là gì?',
    options: {
      A: 'Tiếng thứ 6 câu lục vần với tiếng thứ 6 câu bát',
      B: 'Tiếng thứ 4 câu lục vần với tiếng thứ 8 câu bát',
      C: 'Tiếng thứ 6 câu lục vần với tiếng thứ 8 câu bát',
      D: 'Tiếng cuối câu lục không cần vần với câu bát',
    },
    correctOption: 'A',
    explanation: 'Trong thể thơ lục bát: tiếng thứ 6 của câu lục hiệp vần với tiếng thứ 6 của câu bát, và tiếng thứ 8 của câu bát lại hiệp vần với tiếng thứ 6 của câu lục tiếp theo.',
    pedagogicalNote: 'Tri thức thể loại thơ lục bát trong chương trình GDPT 2018.',
  },

  // LỚP 7
  {
    id: 'q7-1',
    grade: 7,
    topic: 'tieng-viet',
    question: 'Xác định thành phần trạng ngữ trong câu sau: "Sáng sớm mùa thu, khắp các nẻo đường làng, sương mai đọng trắng từng ngọn cỏ."',
    options: {
      A: '"Sáng sớm mùa thu"',
      B: '"Khắp các nẻo đường làng"',
      C: '"Sáng sớm mùa thu" và "khắp các nẻo đường làng"',
      D: '"Sương mai đọng trắng"',
    },
    correctOption: 'C',
    explanation: 'Câu có 2 trạng ngữ nối tiếp: "Sáng sớm mùa thu" (chỉ thời gian) và "khắp các nẻo đường làng" (chỉ nơi chốn/không gian).',
    pedagogicalNote: 'Lớp 7 học chuyên sâu về trạng ngữ chỉ thời gian, nơi chốn, nguyên nhân, mục đích, phương tiện.',
  },
  {
    id: 'q7-2',
    grade: 7,
    topic: 'doc-hieu',
    question: 'Khi đọc một bài thơ bốn chữ hoặc năm chữ viết về quê hương, yếu tố nào quan trọng nhất để tìm ra cảm xúc chủ đạo của tác giả?',
    options: {
      A: 'Đếm tổng số dòng thơ trong toàn bài',
      B: 'Các hình ảnh thơ, từ ngữ biểu cảm và nhịp điệu',
      C: 'Tên nhà xuất bản in tập thơ',
      D: 'Số lượng dấu chấm than trong bài',
    },
    correctOption: 'B',
    explanation: 'Hình ảnh thơ (thi ảnh), từ ngữ giàu sắc thái biểu cảm và sự ngắt nhịp là con đường trực tiếp để nhà thơ gửi gắm tâm trạng, nỗi niềm và cảm xúc chủ đạo.',
    pedagogicalNote: 'Kỹ năng đọc hiểu đặc trưng thể loại thơ trữ tình lớp 7.',
  },
  {
    id: 'q7-3',
    grade: 7,
    topic: 'viet',
    question: 'Điểm khác biệt cốt lõi giữa "văn biểu cảm" và "văn tự sự đơn thuần" là gì?',
    options: {
      A: 'Văn biểu cảm không bao giờ có nhân vật',
      B: 'Văn biểu cảm lấy việc bộc lộ tình cảm, cảm xúc, rung động của người viết làm mục đích chính',
      C: 'Văn biểu cảm chỉ được viết bằng thơ',
      D: 'Văn biểu cảm phải dài hơn văn tự sự',
    },
    correctOption: 'B',
    explanation: 'Văn biểu cảm có thể mượn sự việc, phong cảnh để "tức cảnh sinh tình", nhưng đích đến cuối cùng là giãi bày thế giới nội tâm và sự rung động sâu sắc của con người.',
    pedagogicalNote: 'Phân hóa thể loại tập làm văn Lớp 7.',
  },

  // LỚP 8
  {
    id: 'q8-1',
    grade: 8,
    topic: 'tieng-viet',
    question: 'Trong câu: "Chẳng lẽ chúng ta lại đứng nhìn dòng sông quê hương ngày một ô nhiễm?", người viết sử dụng câu hỏi tu từ nhằm mục đích gì?',
    options: {
      A: 'Hỏi để tìm kiếm thông tin chưa biết từ người nghe',
      B: 'Khẳng định mạnh mẽ trách nhiệm bảo vệ dòng sông và thôi thúc hành động',
      C: 'Yêu cầu người nghe trả lời bằng số liệu thống kê',
      D: 'Nghi ngờ việc dòng sông có thực sự ô nhiễm hay không',
    },
    correctOption: 'B',
    explanation: 'Câu hỏi tu từ không nhằm mục đích lấy câu trả lời thông tin mà để bộc lộ cảm xúc, nhấn mạnh tư tưởng và lay động nhận thức, trách nhiệm của người đọc.',
    pedagogicalNote: 'Lớp 8: Nhận diện và phân tích tác dụng ngữ dụng của các kiểu câu theo mục đích nói.',
  },
  {
    id: 'q8-2',
    grade: 8,
    topic: 'doc-hieu',
    question: 'Trong một văn bản nghị luận xã hội, mối quan hệ giữa "luận điểm", "lí lẽ" và "bằng chứng" được xác định như thế nào?',
    options: {
      A: 'Bằng chứng nêu trước, không cần lí lẽ giải thích',
      B: 'Luận điểm là ý kiến khái quát; lí lẽ giải thích vì sao; bằng chứng là sự việc/số liệu thực tế để minh chứng',
      C: 'Lí lẽ và bằng chứng là hai khái niệm hoàn toàn đồng nghĩa',
      D: 'Luận điểm chỉ là phần kết luận của bài văn',
    },
    correctOption: 'B',
    explanation: 'Luận điểm là quan điểm lớn cần làm sáng tỏ; lí lẽ là lập luận giải thích logic; dẫn chứng (bằng chứng) là người thật, việc thật, số liệu xác thực làm chỗ dựa vững chắc.',
    pedagogicalNote: 'Kỹ năng trọng tâm của văn nghị luận theo chương trình GDPT 2018 lớp 8.',
  },
  {
    id: 'q8-3',
    grade: 8,
    topic: 'viet',
    question: 'Khi viết bài văn thuyết minh giải thích một hiện tượng tự nhiên, yêu cầu nào sau đây là BẮT BUỘC?',
    options: {
      A: 'Dùng nhiều biện pháp tu từ cường điệu hoá để gây cười',
      B: 'Trình bày chính xác nguyên nhân, cơ chế hình thành và ảnh hưởng dựa trên cơ sở khoa học',
      C: 'Sáng tác một câu chuyện thần thoại huyền bí về hiện tượng đó',
      D: 'Tuyệt đối không sử dụng bất kỳ số liệu hay hình ảnh minh hoạ nào',
    },
    correctOption: 'B',
    explanation: 'Văn bản thông tin/thuyết minh khoa học đòi hỏi tính khách quan, tin cậy, rõ ràng về nguyên nhân, tiến trình và hệ quả của hiện tượng.',
    pedagogicalNote: 'Thực hành viết văn bản thông tin lớp 8.',
  },

  // LỚP 9
  {
    id: 'q9-1',
    grade: 9,
    topic: 'tieng-viet',
    question: 'Trong đoạn đối thoại sau: \n- Lan: "Mai ơi, ngày mai cậu đi xem triển lãm sách với mình nhé?"\n- Mai: "Ngày mai mình phải về quê thăm ông ngoại rồi."\nCâu trả lời của Mai chứa hàm ý gì?',
    options: {
      A: 'Mai rất thích đọc sách về ông ngoại',
      B: 'Mai lịch sự từ chối lời mời của Lan vì bận việc gia đình',
      C: 'Mai muốn rủ Lan cùng về quê với mình',
      D: 'Mai không nghe rõ câu hỏi của Lan',
    },
    correctOption: 'B',
    explanation: 'Mai không dùng từ "không đi", nhưng thông báo lý do về quê để người nghe tự suy ra hàm ý từ chối một cách khéo léo, tế nhị.',
    pedagogicalNote: 'Ngữ dụng học lớp 9: Hàm ý và phương châm hội thoại.',
  },
  {
    id: 'q9-2',
    grade: 9,
    topic: 'tieng-viet',
    question: 'Xác định phép liên kết câu được sử dụng giữa hai câu sau: "Lòng biết ơn là suối nguồn nuôi dưỡng tâm hồn con người. PHẨM CHẤT ẤY giúp ta sống nhân ái và vị tha hơn."',
    options: {
      A: 'Phép lặp từ ngữ',
      B: 'Phép thế',
      C: 'Phép nối',
      D: 'Phép đối lập',
    },
    correctOption: 'B',
    explanation: 'Cụm từ "Phẩm chất ấy" ở câu thứ hai được dùng để thay thế cho "Lòng biết ơn" ở câu trước nhằm liên kết nghĩa và tránh lặp từ thô cứng.',
    pedagogicalNote: 'Phép liên kết câu và đoạn văn lớp 9 GDPT 2018.',
  },
  {
    id: 'q9-3',
    grade: 9,
    topic: 'viet',
    question: 'Trong bài văn nghị luận xã hội về một tư tưởng, đạo lí, thao tác "bình luận phản đề" (phản biện) mang lại giá trị gì cho bài viết?',
    options: {
      A: 'Phủ nhận toàn bộ luận điểm đã nêu từ trước',
      B: 'Giúp bài viết toàn diện, sâu sắc, nhìn nhận vấn đề từ nhiều góc độ và tránh suy nghĩ một chiều',
      C: 'Làm tăng số lượng từ ngữ của bài thi cho đủ trang giấy',
      D: 'Chỉ trích đích danh những người có ý kiến khác',
    },
    correctOption: 'B',
    explanation: 'Thao tác phản đề (lật lại vấn đề, mở rộng góc nhìn phản biện) chứng minh năng lực tư duy sắc sảo, tính khách quan và chiều sâu nhận thức của học sinh lớp 9.',
    pedagogicalNote: 'Năng lực viết nghị luận nâng cao định hướng thi vào 10 THPT.',
  },
];

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'rd-6-gio-dong',
    grade: 6,
    title: 'Hơi ấm giữa ngày đông',
    genre: 'Truyện đồng thoại / Trải nghiệm (Văn bản minh họa chuẩn GDPT 2018)',
    isSelfComposedDemo: true,
    sourceAnnotation: 'Đoạn trích minh họa rèn luyện kỹ năng phân tích chi tiết nghệ thuật và bài học nhân ái Lớp 6',
    lineCount: 14,
    excerpt: `1. Gió bấc ùa về, rít qua từng khe liếp cửa sổ nghe như tiếng huýt sáo của mùa đông.
2. An co ro trong chiếc áo len mỏng đã sờn mối chỉ ở khuỷu tay, đôi bàn tay đỏ ửng vì buốt.
3. Ngoài ngõ, bé Na - đứa em gái nhỏ của gia đình thợ hồ cạnh nhà - đang co ro quét lá rụng.
4. Con bé chỉ mặc chiếc áo cánh nâu bạc thếch, hai hàm răng đánh vào nhau lập cập.
5. An nhìn lại chiếc áo bông ấm màu tím than mẹ vừa mua treo ngay ngắn trên móc áo.
6. Chiếc áo êm ái như một đám mây ấm áp, thơm tho mùi vải mới tinh khôi.
7. Thoáng một chút ngập ngừng, An nghĩ đến việc mình sẽ bớt đi một tấm áo diện Tết.
8. Nhưng nhìn dáng vẻ gầy guộc của Na, một luồng hơi ấm lạ kỳ bỗng tràn ngập trong lồng ngực An.
9. Cậu bước nhanh ra cửa, nhẹ nhàng khoác chiếc áo bông lên đôi vai đang run rẩy của em.
10. Bé Na ngỡ ngàng, đôi mắt to tròn ánh lên vẻ kinh ngạc rồi nở một nụ cười rạng rỡ như nắng mai.
11. Giữa cái rét cắt da cắt thịt của buổi sáng cuối năm, An chợt nhận ra:
12. Hơi ấm thật sự không chỉ đến từ lớp bông dày của manh áo,
13. mà bắt đầu từ khoảnh khắc ta biết mở rộng bàn tay sẻ chia cùng bè bạn.`,
    vocabularyNotes: [
      { word: 'Gió bấc', meaning: 'Gió mùa đông bắc từ phía bắc tràn về mang theo không khí lạnh buốt giá.' },
      { word: 'Bạc thếch', meaning: 'Bị bạc màu đến mức nhạt nhòa, chỉ còn màu xơ xác cũ kĩ.' },
      { word: 'Khắc cốt ghi tâm', meaning: 'Ghi nhớ sâu sắc trong lòng không bao giờ quên.' },
    ],
    questions: [
      {
        id: 'rq6-1',
        level: 'nhan_biet',
        levelLabel: 'Nhận biết',
        text: 'Tìm chi tiết trong đoạn trích miêu tả hoàn cảnh và trang phục của bé Na giữa trời đông giá rét.',
        guidePrompt: 'Quan sát các dòng 3 và 4: bé Na làm gì, mặc áo như thế nào và cơ thể biểu hiện ra sao?',
        textualEvidenceHint: 'Dòng 3-4: "chỉ mặc chiếc áo cánh nâu bạc thếch, hai hàm răng đánh vào nhau lập cập".',
      },
      {
        id: 'rq6-2',
        level: 'thong_hieu',
        levelLabel: 'Thông hiểu',
        text: 'Tác giả sử dụng biện pháp so sánh nào để miêu tả nụ cười của bé Na ở dòng 10? Tác dụng của hình ảnh đó là gì?',
        guidePrompt: 'Tìm từ ngữ so sánh "như nắng mai" và giải thích cảm xúc nó mang lại đối lập với cái rét.',
        textualEvidenceHint: 'Dòng 10: "nụ cười rạng rỡ như nắng mai" xua tan cái lạnh giá, làm bừng sáng khung cảnh.',
      },
      {
        id: 'rq6-3',
        level: 'van_dung',
        levelLabel: 'Vận dụng',
        text: 'Từ hành động nhường áo của nhân vật An, em rút ra được bài học gì về tình yêu thương và sự sẻ chia trong cuộc sống hàng ngày?',
        guidePrompt: 'Liên hệ bản thân: Trong lớp hoặc ngoài xã hội, em có thể sẻ chia bằng những hành động cụ thể nào?',
        textualEvidenceHint: 'Dòng 12-13: "Hơi ấm thật sự... bắt đầu từ khoảnh khắc ta biết mở rộng bàn tay sẻ chia".',
      },
    ],
  },

  {
    id: 'rd-7-loi-ru-dong-song',
    grade: 7,
    title: 'Dòng sông chở hạt phù sa',
    genre: 'Thơ năm chữ / Biểu cảm (Văn bản minh họa chuẩn GDPT 2018)',
    isSelfComposedDemo: true,
    sourceAnnotation: 'Đoạn thơ minh họa rèn luyện kỹ năng phân tích thi ảnh và tình cảm gắn bó với quê hương Lớp 7',
    lineCount: 16,
    excerpt: `1. Sông chảy qua mùa hạ,
2. Nước đỏ ngầu phù sa.
3. Bãi mía bờ dâu biếc,
4. Xanh mướt một dải xa.

5. Đò ai khua nhịp mái,
6. Gợn sóng vỗ mạn thuyền.
7. Lời ru của mẹ hiền,
8. Hoà vào dòng nước bạc.

9. Năm tháng dẫu đổi thay,
10. Sông vẫn hoài cần mẫn.
11. Nuôi đồng lúa trĩu bông,
12. Chở nặng tình quê mẹ.

13. Mai này dù đi xa,
14. Giữa muôn trùng phố thị,
15. Vẫn nhớ tiếng phù sa,
16. Thì thầm trong tim mình.`,
    vocabularyNotes: [
      { word: 'Phù sa', meaning: 'Đất cát mịn màu mỡ do nước sông cuốn theo và bồi đắp đôi bờ.' },
      { word: 'Cần mẫn', meaning: 'Chăm chỉ, siêng năng, làm việc đều đặn không mệt mỏi.' },
    ],
    questions: [
      {
        id: 'rq7-1',
        level: 'nhan_biet',
        levelLabel: 'Nhận biết',
        text: 'Xác định thể thơ của văn bản trên và những từ ngữ chỉ màu sắc xuất hiện trong khổ 1.',
        guidePrompt: 'Đếm số lượng tiếng trong mỗi dòng thơ và liệt kê các từ chỉ màu sắc ở 4 dòng đầu.',
        textualEvidenceHint: 'Thể thơ 5 chữ; các từ màu sắc: "đỏ ngầu", "biếc", "xanh mướt".',
      },
      {
        id: 'rq7-2',
        level: 'thong_hieu',
        levelLabel: 'Thông hiểu',
        text: 'Biện pháp nhân hoá trong câu "Sông vẫn hoài cần mẫn / Nuôi đồng lúa trĩu bông" giúp em cảm nhận gì về hình tượng dòng sông?',
        guidePrompt: 'Từ "cần mẫn" vốn chỉ phẩm chất của ai? Khi gán cho dòng sông gợi liên tưởng đến người mẹ quê hương thế nào?',
        textualEvidenceHint: 'Khổ 3: Dòng sông như người mẹ lao động bền bỉ, chở che bồi đắp nguồn sống cho ruộng đồng quê hương.',
      },
      {
        id: 'rq7-3',
        level: 'van_dung',
        levelLabel: 'Vận dụng',
        text: 'Hai câu thơ cuối: "Vẫn nhớ tiếng phù sa / Thì thầm trong tim mình" gợi cho em suy nghĩ gì về trách nhiệm giữ gìn cội nguồn quê hương của thế hệ trẻ?',
        guidePrompt: 'Dù đi đâu, bài học về lòng biết ơn quê hương nguồn cội nhắc nhở ta điều gì?',
        textualEvidenceHint: 'Khổ cuối: Sự gắn kết tâm hồn sâu sắc không bao giờ phai nhạt dù ở nơi phố thị xa xôi.',
      },
    ],
  },

  {
    id: 'rd-8-nghi-luan-doc-sach',
    grade: 8,
    title: 'Sách - Ngọn hải đăng của tri thức',
    genre: 'Nghị luận xã hội (Văn bản minh họa chuẩn GDPT 2018)',
    isSelfComposedDemo: true,
    sourceAnnotation: 'Đoạn trích minh họa rèn luyện kỹ năng phân tích hệ thống Luận điểm - Lí lẽ - Bằng chứng Lớp 8',
    lineCount: 15,
    excerpt: `1. Trong kỉ nguyên công nghệ số bùng nổ với hàng ngàn video ngắn lướt qua mỗi phút, việc đọc sách giấy dường như đang bị nhiều bạn trẻ xem nhẹ.
2. Tuy nhiên, đọc sách không đơn thuần là một thói quen giải trí mà là con đường vững chắc nhất để xây dựng chiều sâu tư duy của mỗi con người.
3. Trước hết, sách cung cấp một hệ thống tri thức đã được chắt lọc, kiểm chứng và tổ chức mạch lạc qua năm tháng.
4. Không giống như các thông tin rời rạc, giật gân trên mạng xã hội, một cuốn sách khoa học hay văn học đòi hỏi người đọc phải kiên nhẫn bám theo dòng lập luận, từ đó rèn luyện khả năng tập trung sâu sắc.
5. Hơn thế nữa, những trang sách văn học chân chính còn là chiếc cầu nối đưa ta vào thế giới nội tâm của muôn vạn cảnh đời.
6. Khi đồng cảm với nỗi bất hạnh của một số phận trong trang viết, trái tim ta biết rung động trước nỗi đau đồng loại, biết căm ghét cái xấu và biết trân trọng sự lương thiện.
7. Danh họa Leonardo da Vinci từng tự học qua hàng ngàn trang sách ghi chép; nhà bác học vĩ đại Thomas Edison coi căn phòng sách là phòng thí nghiệm đầu tiên của đời mình.
8. Liệu chúng ta có thể trưởng thành thực thụ nếu tâm hồn mãi nghèo nàn những giá trị tinh thần tích tụ từ kho tàng văn hóa nhân loại?`,
    vocabularyNotes: [
      { word: 'Kỉ nguyên', meaning: 'Thời kì lịch sử dài có những đặc điểm lớn khác biệt.' },
      { word: 'Phản biện', meaning: 'Phân tích, đánh giá vấn đề một cách độc lập và khách quan.' },
    ],
    questions: [
      {
        id: 'rq8-1',
        level: 'nhan_biet',
        levelLabel: 'Nhận biết',
        text: 'Chỉ ra luận điểm chính của đoạn trích và hai nhân chứng thực tế (bằng chứng) được tác giả dẫn ra ở dòng 7.',
        guidePrompt: 'Luận điểm nằm ở câu 2; dẫn chứng thực tế là hai nhân vật nổi tiếng nào?',
        textualEvidenceHint: 'Luận điểm: Dòng 2; Dẫn chứng: Leonardo da Vinci và Thomas Edison.',
      },
      {
        id: 'rq8-2',
        level: 'thong_hieu',
        levelLabel: 'Thông hiểu',
        text: 'Tác giả đã dùng những lí lẽ nào để chứng minh rằng đọc sách giúp người đọc rèn luyện khả năng tập trung và bồi đắp tâm hồn?',
        guidePrompt: 'Đọc dòng 4 (tập trung bám theo dòng lập luận) và dòng 5-6 (đồng cảm với số phận, biết rung động và hướng thiện).',
        textualEvidenceHint: 'Dòng 4 & dòng 6 trình bày 2 luận cứ lí lẽ sắc bén về trí tuệ và cảm xúc đạo đức.',
      },
      {
        id: 'rq8-3',
        level: 'van_dung',
        levelLabel: 'Vận dụng',
        text: 'Câu kết đoạn: "Liệu chúng ta có thể trưởng thành thực thụ nếu tâm hồn mãi nghèo nàn những giá trị tinh thần...?" sử dụng biện pháp tu từ gì? Thông điệp ấy thôi thúc em xây dựng văn hoá đọc cho bản thân ra sao?',
        guidePrompt: 'Nhận diện câu hỏi tu từ và nêu kế hoạch đọc sách cụ thể của em (ví dụ 20 phút mỗi ngày).',
        textualEvidenceHint: 'Câu hỏi tu từ nhằm cảnh tỉnh và truyền cảm hứng hành động kiên trì đọc sách.',
      },
    ],
  },

  {
    id: 'rd-9-nghi-luan-ban-linh',
    grade: 9,
    title: 'Bản lĩnh trước sóng gió cuộc đời',
    genre: 'Nghị luận xã hội - Tư tưởng đạo lí (Văn bản minh họa chuẩn GDPT 2018)',
    isSelfComposedDemo: true,
    sourceAnnotation: 'Đoạn trích minh họa rèn luyện kỹ năng phân tích Luận đề, Luận điểm và Luận cứ phản biện Lớp 9',
    lineCount: 16,
    excerpt: `1. Người xưa từng đúc kết: "Lửa thử vàng, gian nan thử sức."
2. Trong hành trình bước vào ngưỡng cửa thanh xuân, không có con đường nào chỉ trải đầy cánh hoa hồng mềm mại.
3. Thất bại, áp lực học tập và những biến cố bất ngờ chính là những bài kiểm tra tất yếu giúp mài sắc bản lĩnh của mỗi cá nhân.
4. Bản lĩnh không phải là sự liều lĩnh mù quáng, càng không phải là thái độ ngông cuồng coi thường mọi quy chuẩn.
5. Bản lĩnh đích thực bắt đầu từ sự kiên định với mục tiêu lương thiện, khả năng đứng dậy sau vấp ngã và dũng cảm chịu trách nhiệm về lựa chọn của mình.
6. Khi đối mặt với một bài toán khó hay một kì thi mang tính bước ngoặt, người thiếu bản lĩnh sẽ vội vàng thoái lui hoặc đổ lỗi cho hoàn cảnh.
7. Ngược lại, người có nghị lực kiên cường sẽ xem đó là cơ hội rèn luyện ý chí, biến áp lực thành động lực tự hoàn thiện.
8. Tuy nhiên, rèn luyện bản lĩnh không đồng nghĩa với việc cô lập bản thân hay từ chối sự giúp đỡ của thầy cô, gia đình.
9. Một cánh buồm khôn ngoan không tìm cách chống lại toàn bộ cơn bão mà biết khéo léo nương theo sức gió để đưa con tàu cập bến bình an.`,
    vocabularyNotes: [
      { word: 'Bản lĩnh', meaning: 'Ý chí, nghị lực vững vàng, dám nghĩ dám làm và dám chịu trách nhiệm.' },
      { word: 'Thoái lui', meaning: 'Lùi bước, từ bỏ trước khó khăn trở ngại.' },
    ],
    questions: [
      {
        id: 'rq9-1',
        level: 'nhan_biet',
        levelLabel: 'Nhận biết',
        text: 'Xác định luận đề bao trùm của toàn bộ đoạn văn và câu tục ngữ được dẫn ở dòng 1.',
        guidePrompt: 'Luận đề nói về điều gì trong cuộc sống? Câu tục ngữ nào làm tiền đề mở đầu?',
        textualEvidenceHint: 'Luận đề: Ý nghĩa của bản lĩnh và nghị lực vượt khó; Câu tục ngữ: "Lửa thử vàng, gian nan thử sức".',
      },
      {
        id: 'rq9-2',
        level: 'thong_hieu',
        levelLabel: 'Thông hiểu',
        text: 'Phân tích thao tác bác bỏ / phản biện của tác giả ở dòng 4: "Bản lĩnh không phải là sự liều lĩnh mù quáng...". Ý nghĩa của việc giới hạn định nghĩa này là gì?',
        guidePrompt: 'Tác giả ngăn chặn hiểu lầm nào về chữ "bản lĩnh" ở lứa tuổi thanh thiếu niên?',
        textualEvidenceHint: 'Dòng 4 vạch rõ ranh giới giữa bản lĩnh chân chính với sự ngông cuồng, liều lĩnh nông nổi.',
      },
      {
        id: 'rq9-3',
        level: 'van_dung',
        levelLabel: 'Vận dụng',
        text: 'Hình ảnh ẩn dụ "cánh buồm khôn ngoan" ở câu cuối gợi mở cho em bài học gì khi đối diện với những áp lực của kì thi tuyển sinh vào lớp 10 sắp tới?',
        guidePrompt: 'Liên hệ việc đón nhận áp lực một cách thông minh, biết cân bằng tâm lý và tìm kiếm sự hỗ trợ tích cực.',
        textualEvidenceHint: 'Dòng 9: Ẩn dụ cánh buồm khôn ngoan nhắc nhở sự linh hoạt, bền bỉ và biết đón nhận thử thách một cách tích cực.',
      },
    ],
  },
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  // Lớp 6
  {
    id: 'wp-6-1',
    grade: 6,
    genre: 'tu_su',
    genreLabel: 'Văn Tự sự - Kể lại trải nghiệm',
    title: 'Kể lại một trải nghiệm đáng nhớ giúp em trưởng thành',
    prompt: 'Viết một đoạn văn (khoảng 150 - 200 chữ) kể lại một trải nghiệm thực tế của em (một lần mắc lỗi, một chuyến đi hoặc một việc làm tốt) đã mang lại cho em bài học sâu sắc.',
    guidelines: [
      'Chọn ngôi kể thứ nhất (xưng "tôi" hoặc "em").',
      'Xác định rõ thời gian, không gian và diễn biến chính của sự việc.',
      'Kết hợp yếu tố miêu tả cảnh vật hoặc nét mặt nhân vật để tăng sức gợi.',
      'Khẳng định bài học nhận thức hoặc cảm xúc đọng lại ở phần kết.',
    ],
    suggestedOutlines: [
      'Mở đoạn: Giới thiệu ngắn gọn trải nghiệm và thời điểm diễn ra.',
      'Thân đoạn: Kể diễn biến sự việc theo trình tự hợp lí (nguyên nhân, đỉnh điểm, cách giải quyết).',
      'Kết đoạn: Bài học rút ra cho bản thân và cảm xúc hiện tại.',
    ],
  },
  // Lớp 7
  {
    id: 'wp-7-1',
    grade: 7,
    genre: 'bieu_cam',
    genreLabel: 'Văn Biểu cảm',
    title: 'Bộc lộ cảm xúc về một hình ảnh thân thương của quê hương',
    prompt: 'Viết một đoạn văn biểu cảm (khoảng 150 - 200 chữ) ghi lại tình cảm chân thành của em đối với một hình ảnh thân thuộc của quê hương (dòng sông, cánh đồng lúa, cây đa sân đình, hay góc vườn của bà).',
    guidelines: [
      'Sử dụng các từ ngữ giàu sức gợi cảm, từ tượng hình, tượng thanh.',
      'Kết hợp miêu tả đặc điểm với giãi bày cảm xúc nội tâm trực tiếp.',
      'Vận dụng biện pháp so sánh hoặc nhân hoá để hình ảnh thêm sinh động.',
      'Thể hiện tình yêu tha thiết và niềm tự hào về nguồn cội.',
    ],
    suggestedOutlines: [
      'Mở đoạn: Gọi tên cảnh vật/hình ảnh quê hương khơi nguồn cảm xúc.',
      'Thân đoạn: Miêu tả những nét nổi bật gắn liền với kí ức và rung động tâm hồn.',
      'Kết đoạn: Khẳng định vị trí của hình ảnh ấy trong trái tim em theo năm tháng.',
    ],
  },
  // Lớp 8
  {
    id: 'wp-8-1',
    grade: 8,
    genre: 'nghi_luan_xh',
    genreLabel: 'Văn Nghị luận xã hội',
    title: 'Bàn về ý nghĩa của lời cảm ơn trong cuộc sống',
    prompt: 'Viết một đoạn văn nghị luận (khoảng 200 chữ) làm sáng tỏ ý nghĩa to lớn của việc biết nói lời cảm ơn chân thành trong các mối quan hệ hàng ngày.',
    guidelines: [
      'Nêu rõ luận điểm: Lời cảm ơn là biểu hiện của lối sống văn minh, biết ơn.',
      'Sử dụng ít nhất 2 lí lẽ chặt chẽ giải thích vì sao cảm ơn lại quan trọng.',
      'Đưa ra 1 bằng chứng xác thực trong đời sống học đường hoặc gia đình.',
      'Liên hệ bản thân và rút ra bài học ứng xử.',
    ],
    suggestedOutlines: [
      'Câu chủ đề (Mở): Khẳng định giá trị của lời cảm ơn trong văn hoá ứng xử.',
      'Các câu phát triển (Thân): Giải thích bản chất -> Nêu lí lẽ tác động tích cực -> Dẫn chứng thực tế.',
      'Câu kết: Khuyên nhủ, hành động cụ thể của bản thân mỗi ngày.',
    ],
  },
  // Lớp 9
  {
    id: 'wp-9-1',
    grade: 9,
    genre: 'nghi_luan_xh',
    genreLabel: 'Văn Nghị luận xã hội & Phản biện',
    title: 'Bàn về tinh thần tự lập của học sinh THCS thời đại số',
    prompt: 'Viết một đoạn văn nghị luận (khoảng 200 - 250 chữ) trình bày suy nghĩ của em về tầm quan trọng của tinh thần tự lập đối với học sinh cuối cấp THCS khi chuẩn bị bước sang THPT.',
    guidelines: [
      'Xác định rõ luận đề và luận điểm trọng tâm.',
      'Phân biệt rõ: Tự lập không phải là tự cô lập, mà là chủ động tư duy và hành động.',
      'Thao tác phản đề: Phê phán lối sống ỷ lại, âu lo dựa dẫm vào cha mẹ.',
      'Sử dụng phép thế hoặc phép nối để các câu liên kết chặt chẽ.',
    ],
    suggestedOutlines: [
      'Mở đoạn: Nêu luận đề về tính tự lập trong thời đại mới.',
      'Thân đoạn: Lí lẽ giải thích tự lập mang lại sự chủ động ra sao -> Bằng chứng học sinh vượt khó -> Thao tác phản biện lật ngược vấn đề.',
      'Kết đoạn: Thông điệp hành động rèn luyện tính tự lập ngay từ những việc nhỏ.',
    ],
  },
];

export const MINDMAP_TEMPLATES: Record<Grade, MindMapNode> = {
  6: {
    id: 'root-6',
    label: 'Bài văn Tự sự (Kể chuyện trải nghiệm)',
    type: 'root',
    children: [
      {
        id: 'm6-open',
        label: '1. Mở bài (Khơi gợi)',
        type: 'theme',
        children: [
          { id: 'm6-1-1', label: 'Xác định thời gian & không gian xảy ra sự việc', type: 'detail' },
          { id: 'm6-1-2', label: 'Ngôi kể thứ nhất: Xưng "tôi" hoặc "em"', type: 'detail' },
          { id: 'm6-1-3', label: 'Ấn tượng ban đầu sâu đậm', type: 'emotion' },
        ],
      },
      {
        id: 'm6-body',
        label: '2. Thân bài (Diễn biến)',
        type: 'theme',
        children: [
          { id: 'm6-2-1', label: 'Nguyên nhân dẫn đến tình huống / sự việc', type: 'branch' },
          { id: 'm6-2-2', label: 'Đỉnh điểm thử thách / mâu thuẫn cần giải quyết', type: 'branch' },
          { id: 'm6-2-3', label: 'Kết hợp biện pháp so sánh & nhân hoá miêu tả cảnh', type: 'quote' },
        ],
      },
      {
        id: 'm6-end',
        label: '3. Kết bài (Đọng lại)',
        type: 'theme',
        children: [
          { id: 'm6-3-1', label: 'Kết quả của sự việc', type: 'detail' },
          { id: 'm6-3-2', label: 'Bài học trưởng thành nhận thức sâu sắc', type: 'emotion' },
          { id: 'm6-3-3', label: 'Lời nhắn gửi đến bạn bè', type: 'detail' },
        ],
      },
    ],
  },
  7: {
    id: 'root-7',
    label: 'Khung phân tích Thơ 4 chữ & 5 chữ',
    type: 'root',
    children: [
      {
        id: 'm7-the-loai',
        label: '1. Đặc trưng Thể loại',
        type: 'theme',
        children: [
          { id: 'm7-1-1', label: 'Số tiếng: 4 hoặc 5 tiếng/dòng', type: 'detail' },
          { id: 'm7-1-2', label: 'Cách ngắt nhịp: 2/2, 2/3 hoặc 3/2 linh hoạt', type: 'detail' },
          { id: 'm7-1-3', label: 'Gieo vần: Vần chân, vần lưng liền mạch', type: 'detail' },
        ],
      },
      {
        id: 'm7-nghe-thuat',
        label: '2. Nghệ thuật thi ảnh & Từ ngữ',
        type: 'theme',
        children: [
          { id: 'm7-2-1', label: 'Từ ngữ giàu sức gợi (tượng hình, tượng thanh)', type: 'branch' },
          { id: 'm7-2-2', label: 'Các biện pháp tu từ: So sánh, ẩn dụ, nhân hoá', type: 'quote' },
          { id: 'm7-2-3', label: 'Tác dụng của các trạng ngữ nhấn mạnh bối cảnh', type: 'branch' },
        ],
      },
      {
        id: 'm7-cam-xuc',
        label: '3. Tình cảm & Thông điệp',
        type: 'theme',
        children: [
          { id: 'm7-3-1', label: 'Tình yêu quê hương, đất nước, gia đình', type: 'emotion' },
          { id: 'm7-3-2', label: 'Tâm trạng xúc động, lòng biết ơn người đi trước', type: 'emotion' },
          { id: 'm7-3-3', label: 'Thông điệp nhân văn tác giả gửi gắm', type: 'detail' },
        ],
      },
    ],
  },
  8: {
    id: 'root-8',
    label: 'Cấu trúc Văn Nghị luận Xã hội chuẩn',
    type: 'root',
    children: [
      {
        id: 'm8-luan-diem',
        label: '1. Luận điểm (Ý kiến lớn)',
        type: 'theme',
        children: [
          { id: 'm8-1-1', label: 'Khái niệm vấn đề nghị luận (Định nghĩa ngắn gọn)', type: 'detail' },
          { id: 'm8-1-2', label: 'Tầm quan trọng đối với cá nhân & cộng đồng', type: 'branch' },
        ],
      },
      {
        id: 'm8-li-le',
        label: '2. Lí lẽ & Bằng chứng',
        type: 'theme',
        children: [
          { id: 'm8-2-1', label: 'Lí lẽ 1: Phân tích cơ chế tác động vì sao', type: 'branch' },
          { id: 'm8-2-2', label: 'Lí lẽ 2: Ý nghĩa đạo đức và văn hoá ứng xử', type: 'branch' },
          { id: 'm8-2-3', label: 'Bằng chứng thực tế: Người thật, việc thật, số liệu', type: 'quote' },
          { id: 'm8-2-4', label: 'Sử dụng câu hỏi tu từ để tăng sức thuyết phục', type: 'detail' },
        ],
      },
      {
        id: 'm8-phan-bien',
        label: '3. Phản biện & Bài học',
        type: 'theme',
        children: [
          { id: 'm8-3-1', label: 'Lật lại vấn đề: Phê phán lối sống ngược lại', type: 'branch' },
          { id: 'm8-3-2', label: 'Bài học nhận thức và hành động của bản thân', type: 'emotion' },
        ],
      },
    ],
  },
  9: {
    id: 'root-9',
    label: 'Sơ đồ Phân tích Nhân vật Văn học Lớp 9',
    type: 'root',
    children: [
      {
        id: 'm9-khai-quat',
        label: '1. Giới thiệu khái quát',
        type: 'theme',
        children: [
          { id: 'm9-1-1', label: 'Tác giả, tác phẩm & hoàn cảnh sáng tác', type: 'detail' },
          { id: 'm9-1-2', label: 'Vị trí nhân vật trong việc thể hiện chủ đề', type: 'detail' },
          { id: 'm9-1-3', label: 'Luận đề định hướng toàn bài viết', type: 'branch' },
        ],
      },
      {
        id: 'm9-ve-dep',
        label: '2. Hệ thống Luận điểm phẩm chất',
        type: 'theme',
        children: [
          { id: 'm9-2-1', label: 'Luận điểm 1: Hoàn cảnh sống & ngoại hình/lời nói', type: 'branch' },
          { id: 'm9-2-2', label: 'Luận điểm 2: Vẻ đẹp tâm hồn, lý tưởng sống cao đẹp', type: 'emotion' },
          { id: 'm9-2-3', label: 'Luận điểm 3: Hành động kiên cường trước thử thách', type: 'branch' },
          { id: 'm9-2-4', label: 'Dẫn chứng cụ thể, phân tích chi tiết then chốt', type: 'quote' },
        ],
      },
      {
        id: 'm9-nghe-thuat',
        label: '3. Đặc sắc Nghệ thuật & Chiều sâu',
        type: 'theme',
        children: [
          { id: 'm9-3-1', label: 'Nghệ thuật xây dựng nhân vật (tâm lý, ngôn ngữ)', type: 'detail' },
          { id: 'm9-3-2', label: 'Ngôi kể và điểm nhìn nghệ thuật', type: 'detail' },
          { id: 'm9-3-3', label: 'Thông điệp nhân sinh & giá trị hiện thực/nhân đạo', type: 'emotion' },
        ],
      },
    ],
  },
};
