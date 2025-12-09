// Quiz Database - COSMIC CHEMISTRY: DECK
// Total: 30 questions focused on high school inorganic chemistry
// Difficulty: 20 normal (基礎), 10 hard (発展)
// Categories: 元素, 化学結合, 化学反応, 酸塩基, 酸化還元, 無機化学, 工業化学

export const QUIZZES = [
    // === NORMAL DIFFICULTY (基礎レベル) 20問 === //
    {
        q: "pH < 7 を示す溶液は？",
        a: 0,
        o: ["酸性", "中性", "塩基性", "両性"],
        category: "酸塩基",
        difficulty: "normal"
    },
    {
        q: "炎色反応で黄色を示す元素は？",
        a: 1,
        o: ["Cu", "Na", "K", "Li"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "原子番号1番の元素は？",
        a: 0,
        o: ["H", "He", "Li", "Be"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "常温で液体の非金属元素は？",
        a: 2,
        o: ["塩素", "ヨウ素", "臭素", "フッ素"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "希ガスで原子番号が最も小さいのは？",
        a: 0,
        o: ["He", "Ne", "Ar", "Kr"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "水素の同位体でないものは？",
        a: 3,
        o: ["軽水素", "重水素", "三重水素", "四重水素"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "イオン結合でできている物質は？",
        a: 1,
        o: ["H₂O", "NaCl", "CO₂", "CH₄"],
        category: "化学結合",
        difficulty: "normal"
    },
    {
        q: "金属結合の特徴は？",
        a: 0,
        o: ["電気を通す", "水に溶ける", "融点が低い", "脆い"],
        category: "化学結合",
        difficulty: "normal"
    },
    {
        q: "酸化されると酸素と結びつくか、何を失う？",
        a: 2,
        o: ["陽子", "中性子", "電子", "原子核"],
        category: "酸化還元",
        difficulty: "normal"
    },
    {
        q: "酸と塩基が反応する反応の名称は？",
        a: 0,
        o: ["中和", "酸化", "還元", "加水分解"],
        category: "酸塩基",
        difficulty: "normal"
    },
    {
        q: "アンモニアの製法は？",
        a: 1,
        o: ["接触法", "Haber-Bosch法", "Ostwald法", "Solvay法"],
        category: "工業化学",
        difficulty: "normal"
    },
    {
        q: "水の電気分解で陽極に発生する気体は？",
        a: 1,
        o: ["H₂", "O₂", "N₂", "CO₂"],
        category: "化学反応",
        difficulty: "normal"
    },
    {
        q: "赤褐色の金属は？",
        a: 0,
        o: ["Cu", "Fe", "Al", "Ag"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "両性元素はどれ？",
        a: 2,
        o: ["Fe", "Cu", "Al", "Ag"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "石灰水を白濁させる気体は？",
        a: 1,
        o: ["O₂", "CO₂", "H₂", "N₂"],
        category: "無機化学",
        difficulty: "normal"
    },
    {
        q: "炎色反応で赤色を示す元素は？",
        a: 2,
        o: ["Na", "Cu", "Li", "K"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "最も軽い金属元素は？",
        a: 0,
        o: ["Li", "Na", "K", "Mg"],
        category: "元素",
        difficulty: "normal"
    },
    {
        q: "塩化ナトリウムの結晶は何型？",
        a: 1,
        o: ["体心立方格子", "面心立方格子", "六方最密構造", "ダイヤモンド型"],
        category: "化学結合",
        difficulty: "normal"
    },
    {
        q: "アボガドロ数に最も近い値は？",
        a: 1,
        o: ["6.0×10²²", "6.0×10²³", "6.0×10²⁴", "6.0×10²⁵"],
        category: "化学反応",
        difficulty: "normal"
    },
    {
        q: "標準状態で1 molの気体の体積は？",
        a: 2,
        o: ["11.2 L", "18.4 L", "22.4 L", "44.8 L"],
        category: "化学反応",
        difficulty: "normal"
    },

    // === HARD DIFFICULTY (発展レベル) 10問 === //
    {
        q: "接触法で硫酸を製造する際の触媒は？",
        a: 0,
        o: ["酸化バナジウム(V)", "白金", "鉄", "銅"],
        category: "工業化学",
        difficulty: "hard"
    },
    {
        q: "フッ化水素酸が溶かすことができるものは？",
        a: 1,
        o: ["金", "ガラス", "白金", "ダイヤモンド"],
        category: "無機化学",
        difficulty: "hard"
    },
    {
        q: "ハロゲンで酸化力が最も強いのは？",
        a: 0,
        o: ["F₂", "Cl₂", "Br₂", "I₂"],
        category: "酸化還元",
        difficulty: "hard"
    },
    {
        q: "腐卵臭を持つ気体は？",
        a: 1,
        o: ["SO₂", "H₂S", "NH₃", "HCl"],
        category: "無機化学",
        difficulty: "hard"
    },
    {
        q: "王水に溶けない金属は？",
        a: 3,
        o: ["Au", "Pt", "Cu", "Ag"],
        category: "酸化還元",
        difficulty: "hard"
    },
    {
        q: "濃硫酸と銅を加熱すると発生する気体は？",
        a: 1,
        o: ["H₂", "SO₂", "H₂S", "SO₃"],
        category: "化学反応",
        difficulty: "hard"
    },
    {
        q: "オストワルト法で製造される物質は？",
        a: 2,
        o: ["H₂SO₄", "NH₃", "HNO₃", "HCl"],
        category: "工業化学",
        difficulty: "hard"
    },
    {
        q: "イオン化傾向が最も大きい金属は？",
        a: 1,
        o: ["Na", "K", "Ca", "Mg"],
        category: "酸化還元",
        difficulty: "hard"
    },
    {
        q: "ダニエル電池の正極で使用される金属は？",
        a: 0,
        o: ["Cu", "Zn", "Fe", "Ag"],
        category: "酸化還元",
        difficulty: "hard"
    },
    {
        q: "ソルベー法(アンモニアソーダ法)で製造される物質は？",
        a: 2,
        o: ["NaOH", "NaCl", "Na₂CO₃", "NaHCO₃"],
        category: "工業化学",
        difficulty: "hard"
    }
];

// Quiz statistics
// Total: 30 questions
// Normal difficulty: 20 questions (67%)
// Hard difficulty: 10 questions (33%)

// Category distribution
// 元素: 9 questions
// 化学結合: 3 questions
// 化学反応: 4 questions
// 酸塩基: 2 questions
// 酸化還元: 5 questions
// 無機化学: 3 questions
// 工業化学: 4 questions
