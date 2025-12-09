// Game Logic - COSMIC CHEMISTRY: DECK
// Handles all battle logic including deck initialization, turns, card playing, and rendering

import { CARDS } from './data/cards.js';
import { QUIZZES } from './data/quizzes.js';
import { EFFECT_HANDLERS, checkCombo } from './effects.js';
import { ui } from './ui.js';

// App reference will be set by main.js
let app = null;
let db = null;
let doc = null;
let updateDoc = null;
let increment = null;

export function initGame(appRef, dbRef, docRef, updateDocRef, incrementRef) {
    app = appRef;
    db = dbRef;
    doc = docRef;
    updateDoc = updateDocRef;
    increment = incrementRef;
}

export const game = {
    state: {},
    currentArea: null,

    init: (area = null) => {
        game.currentArea = area;

        // Initialize Deck from user's selected deck slot or random cards
        const deck = [];
        let userCards = [1, 3, 4, 5]; // Default cards

        if (app.userData) {
            // Try to use deck from slot 0, or fall back to collection
            if (app.userData.decks && app.userData.decks[0] && app.userData.decks[0].cards.length >= 20) {
                userCards = app.userData.decks[0].cards;
            } else {
                userCards = app.userData.collection;
            }
        }

        for (let i = 0; i < 20; i++) {
            const id = userCards[i % userCards.length];
            const c = CARDS.find(card => card.id === id);
            if (c) deck.push({ ...c }); // Copy card
        }

        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Get enemy HP from area or default
        const enemyHp = area ? area.bossHp : 200;

        game.state = {
            turn: 0,
            p: { hp: 200, max: 200, mana: 0, hand: [], deck: deck, buffs: {} },
            e: { hp: enemyHp, max: enemyHp, mana: 0, hand: [], buffs: {} },
            field: null,
            fieldHistory: [],
            busy: false
        };

        // Update boss visual if area provided
        if (area) {
            const bossVisual = document.getElementById('enemy-visual');
            if (bossVisual) {
                bossVisual.innerHTML = `<img src="${area.bossImage}" style="width:100%; height:100%; object-fit:cover; opacity:0.8;">`;
            }
        }

        // Draw Initial
        for (let i = 0; i < 3; i++) {
            game.drawPlayer();
            game.state.e.hand.push({});
        }

        game.startTurn();
    },

    drawPlayer: () => {
        if (game.state.p.deck.length > 0) {
            const c = game.state.p.deck.pop();
            if (game.state.p.hand.length < 5) game.state.p.hand.push(c);
        } else {
            app.msg("DECK EMPTY", "You ran out of cards!");
            // Deck out penalty logic here if needed
        }
    },

    startTurn: () => {
        game.render();
        if (game.state.turn === 0) game.quiz();
        else {
            game.state.e.mana += 3;
            setTimeout(game.cpuAction, 1500);
        }
    },

    quiz: () => {
        const q = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
        document.getElementById('q-text').innerText = q.q;
        const area = document.getElementById('q-opts');
        area.innerHTML = "";
        q.o.forEach((txt, i) => {
            const b = document.createElement('div');
            b.className = "btn-primary";
            b.innerText = txt;
            b.onclick = () => {
                document.getElementById('modal-quiz').classList.remove('active');
                game.state.p.mana += (i === q.a) ? 3 : 1;
                game.drawPlayer(); // Draw on turn start
                game.render();
            };
            area.appendChild(b);
        });
        document.getElementById('modal-quiz').classList.add('active');
    },

    play: (idx) => {
        if (game.state.busy) return;
        const c = game.state.p.hand[idx];
        if (c.cost > game.state.p.mana) return app.msg("ERROR", "Not enough mana");
        game.state.busy = true;
        game.state.p.mana -= c.cost;
        game.state.p.hand.splice(idx, 1);
        game.resolve(c, game.state.p, game.state.e);
    },

    cpuAction: () => {
        // Fake AI Logic
        game.state.e.hand.push({}); // Draw fake card
        game.resolve({ ...CARDS[Math.floor(Math.random() * CARDS.length)] }, game.state.e, game.state.p);
    },

    resolve: (c, atk, def) => {
        // フィールド履歴に追加
        game.state.fieldHistory.push(c);
        if (game.state.fieldHistory.length > 5) game.state.fieldHistory.shift();

        // Show on field
        const f = document.getElementById('field-card');
        let color = c.type === "ACID" ? "var(--c-pink)" : c.type === "BASE" ? "var(--c-blue)" : c.type === "METAL" ? "var(--c-gold)" : "var(--c-cyan)";
        f.innerHTML = `<div style="text-align:center;color:${color}"><div style="font-size:2rem;">${c.img}</div><div>${c.name}</div><small style="font-size:0.7rem; display:block; margin-top:5px;">${c.description || ''}</small></div>`;
        f.className = "field-slot active";

        if (atk === game.state.e) {
            const ci = document.getElementById('cut-in');
            ci.innerText = `ENEMY: ${c.name}`;
            ci.classList.add('show');
            setTimeout(() => ci.classList.remove('show'), 1500);
        }

        setTimeout(() => {
            // エフェクト処理
            const context = {
                fieldHistory: game.state.fieldHistory,
                turn: game.state.turn
            };

            const effectType = c.effectType || "damage";
            const handler = EFFECT_HANDLERS[effectType];
            const result = handler(c, atk, def, context);

            // コンボエフェクト表示
            if (result.combo) {
                ui.showComboEffect();
            }

            // コンボボーナス効果の処理
            if (c.combo && checkCombo(c.combo, context.fieldHistory) && c.comboBonus) {
                if (c.comboBonus.effect) {
                    const bonusHandler = EFFECT_HANDLERS[c.comboBonus.effect];
                    bonusHandler({ effectValue: c.comboBonus.value }, atk, def, context);
                }
            }

            // 視覚効果
            if (def === game.state.p && effectType === "damage") ui.damageFX();
            ui.showEffectResult(result, c);

            game.render();

            // 勝敗判定
            if (def.hp <= 0) {
                if (def === game.state.e) {
                    // Calculate rewards based on area
                    const energyReward = game.currentArea ? game.currentArea.rewards.energy : 200;
                    app.msg("VICTORY", `+${energyReward} Energy`);
                    if (app.user && app.userData) {
                        app.userData.energy += energyReward;
                        app.userData.totalWins = (app.userData.totalWins || 0) + 1;

                        // Check for rank up
                        const newRank = game.checkRankUp(app.userData.totalWins);
                        if (newRank && newRank !== app.userData.rank) {
                            app.userData.rank = newRank;
                            setTimeout(() => app.msg("RANK UP!", `You are now Rank ${newRank}!`), 500);
                        }

                        updateDoc(doc(db, "users", app.user.uid), {
                            energy: increment(energyReward),
                            totalWins: increment(1),
                            rank: app.userData.rank
                        });
                    }
                } else {
                    app.msg("DEFEAT", "Try again...");
                    if (app.user && app.userData) {
                        app.userData.totalLosses = (app.userData.totalLosses || 0) + 1;
                        updateDoc(doc(db, "users", app.user.uid), {
                            totalLosses: increment(1)
                        });
                    }
                }
                app.updateUI();
                app.nav('home');
            } else {
                setTimeout(game.endTurn, 1000);
            }
        }, 1000);
    },

    endTurn: () => {
        game.state.busy = false;
        game.state.turn = 1 - game.state.turn;
        game.startTurn();
    },

    // Check for rank up based on total wins
    checkRankUp: (wins) => {
        const rankThresholds = [
            { rank: 'S', wins: 50 },
            { rank: 'A', wins: 30 },
            { rank: 'B', wins: 20 },
            { rank: 'C', wins: 12 },
            { rank: 'D', wins: 6 },
            { rank: 'E', wins: 3 },
            { rank: 'F', wins: 0 }
        ];

        for (const threshold of rankThresholds) {
            if (wins >= threshold.wins) {
                return threshold.rank;
            }
        }
        return 'F';
    },

    render: () => {
        document.getElementById('hp-p').style.width = (game.state.p.hp / game.state.p.max * 100) + "%";
        document.getElementById('hp-e').style.width = (game.state.e.hp / game.state.e.max * 100) + "%";
        document.getElementById('mana-val').innerText = game.state.p.mana;
        document.getElementById('deck-count').innerText = game.state.p.deck.length;

        // Enemy Hand
        const eh = document.getElementById('e-hand');
        eh.innerHTML = "";
        game.state.e.hand.forEach(() => {
            const d = document.createElement('div');
            d.className = 'card-back';
            eh.appendChild(d);
        });

        // Player Hand (id is 'p-hand' in HTML)
        const ph = document.getElementById('p-hand');
        ph.innerHTML = "";
        game.state.p.hand.forEach((c, i) => {
            const div = document.createElement('div');
            div.className = "card-wrap";
            if (c.cost > game.state.p.mana) div.classList.add('disabled');
            div.style.transform = `rotate(${(i - game.state.p.hand.length / 2) * 5}deg) translateY(${Math.abs(i - game.state.p.hand.length / 2) * 10}px)`;
            let color = "#fff";
            if (c.type === "ACID") color = "var(--c-pink)";
            if (c.type === "BASE") color = "var(--c-blue)";
            if (c.type === "METAL") color = "var(--c-gold)";
            div.innerHTML = `<div class="card" style="border-color:${color}"><div class="c-cost">${c.cost}</div><div class="c-img"><img src="https://placehold.co/100x150/000/fff?text=${c.img}&font=roboto"></div><div class="c-info"><div class="c-name" style="color:${color}">${c.name}</div><div class="c-val">${c.val}</div></div></div>`;
            div.onclick = () => game.play(i);
            ph.appendChild(div);
        });
    }
};
