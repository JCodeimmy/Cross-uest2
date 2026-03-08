// ============================================
// Question Bank（學測風格題庫）
// ============================================

// Category display names in Traditional Chinese
const CategoryNames = {
    math: '📐 數學',
    english: '🔤 英文',
    science: '🔬 自然',
    chinese: '📖 國文',
    history: '📜 歷史',
    geography: '🌏 地理',
    civics: '⚖️ 公民',
    school: '🏫 校園常識',
    literature: '📚 文學'
};

const Questions = {
    // ── Difficulty 1：Easy（新手） ─────────────────────────────────────────
    easy: [
        {
            question: "下列哪一句成語描述「誇大其詞，說謊造假」的意思？",
            options: ["A. 言過其實", "B. 言簡意賅", "C. 一言九鼎", "D. 金口玉言"],
            answer: "A",
            category: "chinese"
        },
        {
            question: "「春蠶到死絲方盡，蠟炬成灰淚始乾」是哪位詩人的名句？",
            options: ["A. 杜甫", "B. 李白", "C. 李商隱", "D. 白居易"],
            answer: "C",
            category: "chinese"
        },
        {
            question: "「To get a taste of one's own medicine」最貼近的中文意思是？",
            options: ["A. 以牙還牙，自食其果", "B. 對症下藥", "C. 良藥苦口", "D. 同甘共苦"],
            answer: "A",
            category: "english"
        },
        {
            question: "下列何者是台灣面積最大的縣市？",
            options: ["A. 花蓮縣", "B. 南投縣", "C. 屏東縣", "D. 嘉義縣"],
            answer: "A",
            category: "geography"
        },
        {
            question: "台灣「五都」升格直轄市是在哪一年？",
            options: ["A. 2008年", "B. 2010年", "C. 2012年", "D. 2014年"],
            answer: "B",
            category: "civics"
        },
        {
            question: "細胞進行有氧呼吸時，主要在哪個胞器中進行？",
            options: ["A. 細胞核", "B. 核糖體", "C. 粒線體", "D. 葉綠體"],
            answer: "C",
            category: "science"
        },
        {
            question: "「Meticulous」的意思最接近下列哪個選項？",
            options: ["A. 粗心的", "B. 一絲不苟的", "C. 慷慨的", "D. 輕浮的"],
            answer: "B",
            category: "english"
        },
        {
            question: "下列哪位是「史記」的作者？",
            options: ["A. 班固", "B. 司馬遷", "C. 司馬光", "D. 歐陽修"],
            answer: "B",
            category: "history"
        },
        {
            question: "正心中學位於台灣哪個縣市？",
            options: ["A. 台北市", "B. 新北市", "C. 雲林縣", "D. 高雄市"],
            answer: "C",
            category: "school"
        },
        {
            question: "下列何者是植物進行光合作用的主要原料（取自空氣）？",
            options: ["A. 氧氣", "B. 氮氣", "C. 二氧化碳", "D. 氬氣"],
            answer: "C",
            category: "science"
        },
        {
            question: "物質三態（固態、液態、氣態）之間，從液態直接變為氣態的過程稱為？",
            options: ["A. 凝固", "B. 昇華", "C. 蒸發", "D. 凝華"],
            answer: "C",
            category: "science"
        }
    ],

    // ── Difficulty 2：Medium（普通） ──────────────────────────────────────
    medium: [
        {
            question: "下列哪個英文句子的文法正確？",
            options: [
                "A. She has went to school already.",
                "B. She have gone to school already.",
                "C. She has gone to school already.",
                "D. She had went to school already."
            ],
            answer: "C",
            category: "english"
        },
        {
            question: "「禍兮福之所倚，福兮禍之所伏」出自下列哪部典籍？",
            options: ["A. 論語", "B. 老子", "C. 孟子", "D. 荀子"],
            answer: "B",
            category: "chinese"
        },
        {
            question: "下列哪一選項正確描述「供給法則」？",
            options: [
                "A. 價格上升，供給量減少",
                "B. 價格下降，供給量增加",
                "C. 價格上升，供給量增加",
                "D. 價格與供給量無關"
            ],
            answer: "C",
            category: "civics"
        },
        {
            question: "地球板塊移動的主要驅動力是？",
            options: ["A. 地球自轉的離心力", "B. 地函的對流運動", "C. 月球引力", "D. 太陽風"],
            answer: "B",
            category: "science"
        },
        {
            question: "下列哪個詞語的「不」字用法與其他三者不同？",
            options: ["A. 不亦樂乎", "B. 不恥下問", "C. 不屈不撓", "D. 不得不從"],
            answer: "A",
            category: "chinese"
        },
        {
            question: "台灣原住民族中，人口最多的族群是？",
            options: ["A. 泰雅族", "B. 排灣族", "C. 阿美族", "D. 布農族"],
            answer: "C",
            category: "geography"
        },
        {
            question: "「Renaissance」（文藝復興）最早起源於哪個國家？",
            options: ["A. 法國", "B. 德國", "C. 義大利", "D. 英國"],
            answer: "C",
            category: "history"
        },
        {
            question: "下列哪個選項對「基因」的描述最正確？",
            options: [
                "A. 基因是蛋白質的一種",
                "B. 基因是DNA上具有遺傳信息的片段",
                "C. 基因只存在於細胞核核膜上",
                "D. 每個細胞的基因數量不同"
            ],
            answer: "B",
            category: "science"
        },
        {
            question: "「Ambiguous」的中文意思是？",
            options: ["A. 壯志凌雲的", "B. 模糊不清的、有歧義的", "C. 專制獨裁的", "D. 謙遜有禮的"],
            answer: "B",
            category: "english"
        },
        {
            question: "中國清朝末年的「洋務運動」的核心主張是？",
            options: [
                "A. 全盤西化，廢除漢字",
                "B. 師夷長技以制夷，保留中學精神",
                "C. 推翻帝制，建立共和",
                "D. 閉關鎖國，抵制外來文化"
            ],
            answer: "B",
            category: "history"
        },
        {
            question: "人體的神經系統中，負責傳遞感覺訊號「進入」脊髓的神經是？",
            options: ["A. 運動神經", "B. 感覺神經", "C. 自律神經", "D. 運動與感覺神經皆可"],
            answer: "B",
            category: "science"
        },
        {
            question: "下列關於「滲透作用」的敘述，何者正確？",
            options: [
                "A. 水分子由低濃度溶液往高濃度溶液移動",
                "B. 溶質分子穿過半透膜移動",
                "C. 水分子由高濃度溶液往低濃度溶液移動",
                "D. 滲透作用需要消耗ATP能量"
            ],
            answer: "A",
            category: "science"
        }
    ],

    // ── Difficulty 3：Hard（困難） ────────────────────────────────────────
    hard: [
        {
            question: "下列關於「物競天擇，適者生存」的敘述，何者正確？",
            options: [
                "A. 個體為了適應環境會主動改變基因",
                "B. 環境淘汰表現型不適應的個體，留下較適應者繁殖",
                "C. 所有物種最終都會演化成相同的形態",
                "D. 天擇主要發生在基因庫而非個體層面"
            ],
            answer: "B",
            category: "science"
        },
        {
            question: "閱讀下列語句：「蓋將自其變者而觀之，則天地曾不能以一瞬」，此句出自哪篇文章？",
            options: ["A. 師說", "B. 赤壁賦", "C. 岳陽樓記", "D. 醉翁亭記"],
            answer: "B",
            category: "chinese"
        },
        {
            question: "下列關於「生態系」的敘述，何者錯誤？",
            options: [
                "A. 生態系包含生物與非生物環境",
                "B. 能量在食物鏈中流動時會逐漸減少",
                "C. 生產者是食物鏈的起點，能自行製造有機物",
                "D. 分解者屬於消費者，在食物鏈中排最末位"
            ],
            answer: "D",
            category: "science"
        },
        {
            question: "光合作用的「光反應」主要發生在葉綠體的哪個部位？",
            options: ["A. 基質（stroma）", "B. 類囊體薄膜（thylakoid membrane）", "C. 外膜", "D. 核糖體"],
            answer: "B",
            category: "science"
        },
        {
            question: "下列關於「酵素（酶）」的敘述，何者正確？",
            options: [
                "A. 酵素在反應後會被消耗掉",
                "B. 一種酵素可以催化所有化學反應",
                "C. 酵素具有專一性，每種酵素只與特定受質結合",
                "D. 溫度越高，酵素活性越強"
            ],
            answer: "C",
            category: "science"
        }
    ],

    // ── Difficulty 4：Boss（極難） ────────────────────────────────────────
    boss: [
        {
            question: "「辛丑條約」（1901）中，清朝被要求賠款給多少個國家組成的聯軍？",
            options: ["A. 六國", "B. 八國", "C. 十一國", "D. 十四國"],
            answer: "C",
            category: "history"
        },
        {
            question: "下列哪段文字使用了「排比」與「對偶」兩種修辭？",
            options: [
                "A. 採菊東籬下，悠然見南山",
                "B. 業精於勤，荒於嬉；行成於思，毀於隨",
                "C. 問君能有幾多愁，恰似一江春水向東流",
                "D. 大漠孤煙直，長河落日圓"
            ],
            answer: "B",
            category: "chinese"
        },
        {
            question: "「熱帶雨林」生態系主要分布在地球的哪個氣候區？",
            options: [
                "A. 南北緯30°至60°之間的溫帶地區",
                "B. 南北緯10°以內的赤道低壓帶",
                "C. 回歸線附近的副熱帶高壓帶",
                "D. 極圈附近的苔原氣候帶"
            ],
            answer: "B",
            category: "geography"
        },
        {
            question: "下列關於「DNA複製」的敘述，何者最正確？",
            options: [
                "A. 複製完成後兩條新鏈均為全新合成",
                "B. 採半保留複製，各保留一條原有股鏈",
                "C. DNA複製僅發生在有絲分裂的後期",
                "D. 複製過程不需要酵素參與"
            ],
            answer: "B",
            category: "science"
        },
        {
            question: "下列關於「星球演化」的敘述，何者正確？",
            options: [
                "A. 質量越小的恆星，燃燒越快，壽命越短",
                "B. 太陽最終會演化成黑洞",
                "C. 大質量恆星死亡時可能形成超新星爆炸，留下中子星或黑洞",
                "D. 所有恆星死亡後都會形成白矮星"
            ],
            answer: "C",
            category: "science"
        }
    ]
};

// ── Helper Functions ───────────────────────────────────────────────────────

// Get a random question by difficulty level (1=easy, 2=medium, 3=hard, 4=boss)
function getRandomQuestion(difficulty) {
    let pool;
    switch (difficulty) {
        case 1: pool = Questions.easy; break;
        case 2: pool = Questions.medium; break;
        case 3: pool = Questions.hard; break;
        case 4: pool = Questions.boss; break;
        default: pool = Questions.easy;
    }
    return pool[Utils.randomInt(0, pool.length - 1)];
}

// Get questions by category (optionally filtered by difficulty)
function getQuestionsByCategory(category, difficulty) {
    const allQuestions = [
        ...Questions.easy,
        ...Questions.medium,
        ...Questions.hard,
        ...Questions.boss
    ];
    return allQuestions.filter(q =>
        q.category === category &&
        (difficulty ? getDifficultyForQuestion(q) === difficulty : true)
    );
}

// Helper: determine which difficulty tier a question belongs to
function getDifficultyForQuestion(question) {
    if (Questions.easy.includes(question)) return 1;
    if (Questions.medium.includes(question)) return 2;
    if (Questions.hard.includes(question)) return 3;
    if (Questions.boss.includes(question)) return 4;
    return 1;
}

// Get the display name for a category key
function getCategoryName(categoryKey) {
    return CategoryNames[categoryKey] || categoryKey;
}
