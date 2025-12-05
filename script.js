// --- データ：クイズリスト（本来は別ファイルやサーバーから取得） ---
const quizData = {
    halogen: [
        { q: "次の中で常温で液体のハロゲンは？", options: ["フッ素", "塩素", "臭素", "ヨウ素"], ans: 2 }, // 0始まりなので2は臭素
        { q: "フッ化水素酸が溶かすものは？", options: ["金", "ガラス", "ゴム", "プラスチック"], ans: 1 },
        { q: "次の中で最も酸化力が強いのは？", options: ["F₂", "Cl₂", "Br₂", "I₂"], ans: 0 }
    ],
    sulfur: [
        { q: "接触法で触媒として用いられるのは？", options: ["酸化バナジウム(V)", "白金", "鉄", "酸化マンガン(IV)"], ans: 0 },
        { q: "腐卵臭を持つ有毒な気体は？", options: ["SO₂", "H₂S", "O₃", "SO₃"], ans: 1 }
    ],
    // 他の分野も同様に...
    default: [
        { q: "原子番号1番の元素は？", options: ["He", "H", "Li", "Be"], ans: 1 }
    ]
};

// --- 変数 ---
let playerEnergy = 0; // 現在のエネルギー
let currentAreaId = 'default';

// --- バトル開始処理（更新） ---
function startGame(areaId) {
    showScreen('battle');
    currentAreaId = areaId;
    
    // 初期化
    playerEnergy = 0;
    updateEnergyUI();
    
    // 敵の名前などを設定（前回のコード参照）...

    // ★ターン開始：いきなりクイズ！★
    setTimeout(startPlayerTurn, 1000);
}

// --- プレイヤーのターン開始（クイズ出題） ---
function startPlayerTurn() {
    // 1. クイズデータを取得
    const questions = quizData[currentAreaId] || quizData['default'];
    // ランダムに1問選ぶ
    const question = questions[Math.floor(Math.random() * questions.length)];
    
    // 2. モーダルを表示
    showQuizModal(question);
}

// クイズ表示
function showQuizModal(questionObj) {
    const modal = document.getElementById('quiz-modal');
    const qText = document.getElementById('quiz-question');
    const optionsDiv = document.getElementById('quiz-options');
    const feedback = document.getElementById('quiz-feedback');
    
    modal.style.display = 'flex';
    qText.innerText = questionObj.q;
    optionsDiv.innerHTML = ''; // ボタンをクリア
    feedback.innerText = '';

    // 選択肢ボタンを作成
    questionObj.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, questionObj.ans, btn);
        optionsDiv.appendChild(btn);
    });
}

// 正解判定
function checkAnswer(selectedIndex, correctIndex, btnElement) {
    const feedback = document.getElementById('quiz-feedback');
    
    if (selectedIndex === correctIndex) {
        // 正解！
        btnElement.classList.add('correct');
        feedback.innerText = "正解！エネルギー充填！";
        feedback.style.color = "#00d2ff";
        
        // エネルギー増加
        playerEnergy++;
        if(playerEnergy > 3) playerEnergy = 3; // 最大3つまで
        updateEnergyUI();

    } else {
        // 不正解...
        btnElement.classList.add('wrong');
        feedback.innerText = "不正解... チャージ失敗";
        feedback.style.color = "#ff4b2b";
    }

    // すべてのボタンを押せなくする
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    // 1.5秒後に閉じてメインフェーズへ
    setTimeout(() => {
        document.getElementById('quiz-modal').style.display = 'none';
        checkSkillsAvailability(); // 技が使えるかチェック
    }, 1500);
}

// エネルギー表示の更新
function updateEnergyUI() {
    const dots = document.querySelectorAll('.energy-dot');
    dots.forEach((dot, index) => {
        if (index < playerEnergy) {
            dot.classList.add('filled');
            dot.classList.remove('empty');
        } else {
            dot.classList.remove('filled');
            dot.classList.add('empty');
        }
    });
}

// 技ボタンの有効化/無効化チェック
function checkSkillsAvailability() {
    // ※index.htmlのボタンで onclick="useSkill(1, 20)" のように設定してください
    const buttons = document.querySelectorAll('.skill-btn');
    
    // ボタンの並び順とコストが一致している前提（あるいはdata属性で管理）
    // 今回は簡易的に 1つ目がコスト1、2つ目がコスト2とします
    if (buttons[0]) buttons[0].disabled = (playerEnergy < 1);
    if (buttons[1]) buttons[1].disabled = (playerEnergy < 2);
}

// --- 技発動 ---
function useSkill(cost, damage) {
    if (playerEnergy < cost) return; // 念のため

    // コスト消費
    playerEnergy -= cost;
    updateEnergyUI();
    checkSkillsAvailability(); // ボタン状態更新

    // ダメージ処理
    const enemyHpSpan = document.querySelector('.enemy-card .hp-value');
    let hp = parseInt(enemyHpSpan.innerText);
    hp -= damage;
    if (hp < 0) hp = 0;
    enemyHpSpan.innerText = hp;
    
    // 演出
    document.querySelector('.enemy-card').classList.add('shake');
    setTimeout(() => document.querySelector('.enemy-card').classList.remove('shake'), 400);

    // ターン終了 → 相手のターンへ
    document.getElementById('turn-message').innerText = "敵のターン...";
    setTimeout(cpuAttack, 1000);
}

// ...cpuAttackなどは前回のまま...