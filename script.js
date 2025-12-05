// 全部のカード要素を取得
const cards = document.querySelectorAll('.chem-card');

// すべてのカードに対して「クリックイベント」を設定
cards.forEach(card => {
    card.addEventListener('click', () => {
        
        // --- 1. HPの情報を取得 ---
        const hpSpan = card.querySelector('.hp-value');
        let currentHp = parseInt(hpSpan.innerText); // 現在のHPを数値化
        
        // 攻撃ダメージ（今回は固定で20）
        const damage = 20;

        // --- 2. HPがまだある場合のみ処理 ---
        if (currentHp > 0) {
            
            // 計算：HPを減らす
            currentHp = currentHp - damage;
            
            // HPがマイナスにならないように0で止める
            if (currentHp < 0) currentHp = 0;

            // 画面の数字を更新
            hpSpan.innerText = currentHp;

            // --- 3. ダメージ演出 ---
            // 'shake'クラスをつけて揺らす
            card.classList.add('shake');

            // 0.4秒後に'shake'クラスを外す（これがないと1回しか揺れない）
            setTimeout(() => {
                card.classList.remove('shake');
            }, 400);

            // --- 4. HPが0になったら「倒れた」演出 ---
            if (currentHp === 0) {
                // 少し待ってから倒れた状態にする
                setTimeout(() => {
                    card.classList.add('defeated');
                    alert(card.querySelector('.card-name').innerText + ' は結合が破壊されました！');
                }, 400);
            }

        }
    });
});