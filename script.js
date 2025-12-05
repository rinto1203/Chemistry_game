// --- クイズデータ ---
const quizData = {
    halogen: [
        { q: "常温で液体のハロゲンは？", options: ["フッ素", "塩素", "臭素", "ヨウ素"], ans: 2 },
        { q: "フッ化水素酸が溶かすものは？", options: ["金", "ガラス", "ゴム", "プラスチック"], ans: 1 },
        { q: "酸化力が最も強いのは？", options: ["F₂", "Cl₂", "Br₂", "I₂"], ans: 0 }
    ],
    sulfur: [
        { q: "接触法の触媒は？", options: ["酸化バナジウム(V)", "白金", "鉄", "銅"], ans: 0 },
        { q: "腐卵臭を持つ気体は？", options: ["SO₂", "H₂S", "O₃", "SO₃"], ans: 1 }
    ],
    default: [
        { q: "原子番号1番の元素は？", options: ["He", "H", "Li", "Be"], ans: 1 },
        { q: "炎色反応で赤色を示すのは？", options: ["Na", "Cu", "Li", "K"], ans: 2 }
    ]
};

// --- 変数 ---
let playerEnergy = 0;
let isOnlineMode = false;
let currentAreaId = 'default';

// --- 画面管理 ---
const screens = {
    title: document.getElementById('title-screen'),
    lobby: document.getElementById('lobby-screen'),
    areaSelect: document.getElementById('area-select-screen'),
    battle: document.getElementById('battle-screen')
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.style.display = 'none');
    screens[name].style.display = 'flex';
}

// --- モード選択など ---
function selectMode(mode) {
    if (mode === 'cpu') {
        isOnlineMode = false;
        showScreen('areaSelect');
    } else {
        isOnlineMode = true;
        showScreen('lobby');
    }
}

function goTitle() {
    showScreen('title');
}

function enterRoom(action) {
    const roomId = document.getElementById('room-id-input').value;
    if (!roomId) { alert("IDを入力してください"); return; }
    alert(`ルーム ${roomId} に入室しました（通信は未実装）`);
    startGame('online');
}

// --- バトル開始 ---
function startGame(areaId) {
    showScreen('battle');
    currentAreaId = areaId;
    playerEnergy = 0;
    updateEnergyUI();
    checkSkillsAvailability();

    // 敵名の設定
    const enemyName = document.querySelector('.enemy-card .card-name');
    if (areaId === 'halogen') enemyName.innerText = "塩素 (Cl₂)";
    else if (areaId === 'sulfur') enemyName.innerText = "濃硫酸";
    else enemyName.innerText = "謎の物質";

    document.getElementById('turn-message').innerText = "クイズに答えてチャージせよ！";

    // 1秒後にクイズ開始（プレイヤーのターン）
    if(!isOnlineMode) {
        setTimeout(startPlayerTurn, 1000);
    }
}

// --- ターン処理（クイズ） ---
function startPlayerTurn() {
    const questions = quizData[currentAreaId] || quizData['default'];
    const question = questions[Math.floor(Math.random() * questions.length)];
    showQuizModal(question);
}

function showQuizModal(qObj) {
    const modal = document.getElementById('quiz-modal');
    document.getElementById('quiz-question').innerText = qObj.q;
    const optsDiv = document.getElementById('quiz-options');
    optsDiv.innerHTML = '';
    document.getElementById('quiz-feedback').innerText = '';
    modal.style.display = 'flex';

    qObj.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(idx, qObj.ans, btn);
        optsDiv.appendChild(btn);
    });
}

function checkAnswer(idx, ans, btn) {
    const fb = document.getElementById('quiz-feedback');
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (idx === ans) {
        btn.classList.add('correct');
        fb.innerText = "正解！チャージ完了！";
        fb.style.color = "#00d2ff";
        playerEnergy++;
        if(playerEnergy > 3) playerEnergy = 3;
    } else {
        btn.classList.add('wrong');
        fb.innerText = "不正解...";
        fb.style.color = "#ff4b2b";
    }

    updateEnergyUI();
    
    setTimeout(() => {
        document.getElementById('quiz-modal').style.display = 'none';
        checkSkillsAvailability();
        document.getElementById('turn-message').innerText = "技を選択して攻撃だ！";
    }, 1500);
}

// --- エネルギー・技 ---
function updateEnergyUI() {
    const dots = document.querySelectorAll('.energy-dot');
    dots.forEach((dot, i) => {
        if (i < playerEnergy) {
            dot.classList.add('filled');
            dot.classList.remove('empty');
        } else {
            dot.classList.remove('filled');
            dot.classList.add('empty');
        }
    });
}

function checkSkillsAvailability() {
    const btns = document.querySelectorAll('.skill-btn');
    if(btns[0]) btns[0].disabled = (playerEnergy < 1);
    if(btns[1]) btns[1].disabled = (playerEnergy < 2);
}

function useSkill(cost, damage) {
    if (playerEnergy < cost) return;
    
    playerEnergy -= cost;
    updateEnergyUI();
    checkSkillsAvailability();

    // ダメージ処理
    const enemyHpSpan = document.querySelector('.enemy-card .hp-value');
    let hp = parseInt(enemyHpSpan.innerText);
    hp -= damage;
    if (hp < 0) hp = 0;
    enemyHpSpan.innerText = hp;

    // 演出
    const enemyCard = document.querySelector('.enemy-card');
    enemyCard.classList.add('shake');
    setTimeout(() => enemyCard.classList.remove('shake'), 400);

    // 敵のターンへ
    if (hp > 0) {
        document.getElementById('turn-message').innerText = "敵のターン...";
        setTimeout(cpuAttack, 1500);
    } else {
        alert("勝利！結合を破壊しました！");
        goTitle();
    }
}

function cpuAttack() {
    const myHpSpan = document.querySelector('.player-card .hp-value');
    let hp = parseInt(myHpSpan.innerText);
    hp -= 15;
    if (hp < 0) hp = 0;
    myHpSpan.innerText = hp;

    const myCard = document.querySelector('.player-card');
    myCard.classList.add('shake');
    setTimeout(() => myCard.classList.remove('shake'), 400);

    if (hp > 0) {
        document.getElementById('turn-message').innerText = "あなたのターン！";
        setTimeout(startPlayerTurn, 1000);
    } else {
        alert("敗北...実験失敗...");
        goTitle();
    }
}