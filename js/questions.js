// ============================================
// Question Bank
// ============================================

const Questions = {
    // Difficulty 1 - Easy
    easy: [
        {
            question: "下列何者為正心中學的校訓之一？",
            options: ["A. 誠實", "B. 勇敢", "C. 仁愛", "D. 智慧"],
            answer: "C",
            category: "school"
        },
        {
            question: "1 + 1 = ?",
            options: ["A. 1", "B. 2", "C. 3", "D. 11"],
            answer: "B",
            category: "math"
        },
        {
            question: "水的化學式是什麼？",
            options: ["A. H2O", "B. CO2", "C. O2", "D. NaCl"],
            answer: "A",
            category: "science"
        },
        {
            question: "「Apple」的中文意思是？",
            options: ["A. 香蕉", "B. 橘子", "C. 蘋果", "D. 葡萄"],
            answer: "C",
            category: "english"
        },
        {
            question: "台灣的首都是？",
            options: ["A. 高雄", "B. 台中", "C. 台北", "D. 台南"],
            answer: "C",
            category: "geography"
        },
        {
            question: "下列何者不是哺乳動物？",
            options: ["A. 狗", "B. 貓", "C. 鯨魚", "D. 蛇"],
            answer: "D",
            category: "science"
        },
        {
            question: "「三角形」有幾個邊？",
            options: ["A. 2", "B. 3", "C. 4", "D. 5"],
            answer: "B",
            category: "math"
        },
        {
            question: "太陽從哪個方向升起？",
            options: ["A. 東方", "B. 西方", "C. 南方", "D. 北方"],
            answer: "A",
            category: "science"
        }
    ],

    // Difficulty 2 - Medium
    medium: [
        {
            question: "下列哪個單字意思為「重要的」？(學測考古)",
            options: ["A. important", "B. impossible", "C. impatient", "D. immediate"],
            answer: "A",
            category: "english"
        },
        {
            question: "若 x + 5 = 12，則 x = ?",
            options: ["A. 5", "B. 6", "C. 7", "D. 8"],
            answer: "C",
            category: "math"
        },
        {
            question: "光合作用主要發生在植物的哪個部位？",
            options: ["A. 根", "B. 莖", "C. 葉", "D. 花"],
            answer: "C",
            category: "science"
        },
        {
            question: "「論語」的作者是誰？",
            options: ["A. 孔子", "B. 孟子", "C. 老子", "D. 莊子"],
            answer: "A",
            category: "chinese"
        },
        {
            question: "下列何者是質數？",
            options: ["A. 4", "B. 6", "C. 9", "D. 7"],
            answer: "D",
            category: "math"
        },
        {
            question: "「Approximately」的意思最接近？",
            options: ["A. 確切地", "B. 大約", "C. 完全地", "D. 特別地"],
            answer: "B",
            category: "english"
        },
        {
            question: "地球繞太陽公轉一周約需多久？",
            options: ["A. 一天", "B. 一個月", "C. 一年", "D. 一百年"],
            answer: "C",
            category: "science"
        },
        {
            question: "下列何者不是台灣的官方語言？",
            options: ["A. 中文", "B. 英文", "C. 台語", "D. 日文"],
            answer: "D",
            category: "geography"
        }
    ],

    // Difficulty 3 - Hard
    hard: [
        {
            question: "若 log₁₀(x) = 2，則 x = ?",
            options: ["A. 2", "B. 20", "C. 100", "D. 1000"],
            answer: "C",
            category: "math"
        },
        {
            question: "「Ubiquitous」的意思是？",
            options: ["A. 罕見的", "B. 無處不在的", "C. 獨特的", "D. 古老的"],
            answer: "B",
            category: "english"
        },
        {
            question: "DNA的全名是？",
            options: ["A. Deoxyribonucleic Acid", "B. Diribonucleic Acid", "C. Deoxyribose Acid", "D. Digital Nuclear Acid"],
            answer: "A",
            category: "science"
        },
        {
            question: "下列何者是牛頓第二運動定律？",
            options: ["A. F = ma", "B. E = mc²", "C. PV = nRT", "D. V = IR"],
            answer: "A",
            category: "science"
        },
        {
            question: "「醉翁之意不在酒」出自哪位作家？",
            options: ["A. 蘇軾", "B. 歐陽修", "C. 王安石", "D. 范仲淹"],
            answer: "B",
            category: "chinese"
        },
        {
            question: "下列何者不是莎士比亞的作品？",
            options: ["A. 乘利特", "B. 乲羅密歐與朱麗葉", "C. 乲乏乲仲夏乲夜乲之乲夢", "D. 乲乏乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乲乏乏乏乏乏乏堂乲吉乲訶乲德"],
            answer: "D",
            category: "literature"
        },
        {
            question: "sin²θ + cos²θ = ?",
            options: ["A. 0", "B. 1", "C. 2", "D. θ"],
            answer: "B",
            category: "math"
        },
        {
            question: "「Serendipity」最接近的意思是？",
            options: ["A. 悲傷", "B. 意外的好運", "C. 寧靜", "D. 混亂"],
            answer: "B",
            category: "english"
        }
    ],

    // Boss questions - Very Hard
    boss: [
        {
            question: "若正心中學創立於1964年，到2024年已經創校幾周年？",
            options: ["A. 50周年", "B. 55周年", "C. 60周年", "D. 65周年"],
            answer: "C",
            category: "school"
        },
        {
            question: "下列何者正確？",
            options: ["A. π = 3.14", "B. e ≈ 2.718", "C. √2 = 1.5", "D. ln(1) = 1"],
            answer: "B",
            category: "math"
        },
        {
            question: "「Ephemeral」的反義詞是？",
            options: ["A. Temporary", "B. Fleeting", "C. Permanent", "D. Brief"],
            answer: "C",
            category: "english"
        },
        {
            question: "量子力學中的「測不準原理」是由誰提出的？",
            options: ["A. 愛因斯坦", "B. 海森堡", "C. 薛丁格", "D. 波耳"],
            answer: "B",
            category: "science"
        },
        {
            question: "「老師最喜歡的活動是？」",
            options: ["A. 教書", "B. 掃地", "C. 午休", "D. 以上皆是"],
            answer: "B",
            category: "school"
        }
    ]
};

// Get a random question by difficulty
function getRandomQuestion(difficulty) {
    let pool;
    switch (difficulty) {
        case 1:
            pool = Questions.easy;
            break;
        case 2:
            pool = Questions.medium;
            break;
        case 3:
            pool = Questions.hard;
            break;
        case 4:
            pool = Questions.boss;
            break;
        default:
            pool = Questions.easy;
    }

    return pool[Utils.randomInt(0, pool.length - 1)];
}

// Get questions by category
function getQuestionsByCategory(category, difficulty) {
    const allQuestions = [...Questions.easy, ...Questions.medium, ...Questions.hard, ...Questions.boss];
    return allQuestions.filter(q =>
        q.category === category &&
        (difficulty ? getDifficultyForQuestion(q) === difficulty : true)
    );
}

// Helper to determine difficulty of a question
function getDifficultyForQuestion(question) {
    if (Questions.easy.includes(question)) return 1;
    if (Questions.medium.includes(question)) return 2;
    if (Questions.hard.includes(question)) return 3;
    if (Questions.boss.includes(question)) return 4;
    return 1;
}
