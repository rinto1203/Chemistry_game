// Card Upgrade Module - COSMIC CHEMISTRY: DECK
// Handles card strengthening: consume 2 same cards to upgrade +5 val

import { CARDS } from './data/cards.js';

let app = null;
let db = null;
let docFunc = null;
let updateDoc = null;

export function initCardUpgrade(appRef, dbRef, docRef, updateDocRef) {
    app = appRef;
    db = dbRef;
    docFunc = docRef;
    updateDoc = updateDocRef;
}

export const cardUpgrade = {
    selectedCard: null,

    init: () => {
        cardUpgrade.render();
    },

    render: () => {
        const container = document.getElementById('upgrade-cards');
        if (!container || !app.userData) return;
        container.innerHTML = '';

        // Count cards in collection
        const cardCounts = {};
        app.userData.collection.forEach(id => {
            cardCounts[id] = (cardCounts[id] || 0) + 1;
        });

        // Get upgradeable cards (need at least 3 copies: 2 to consume + 1 to keep)
        const upgradeableIds = Object.entries(cardCounts)
            .filter(([id, count]) => count >= 3)
            .map(([id]) => parseInt(id));

        if (upgradeableIds.length === 0) {
            container.innerHTML = '<div style="color:#888; text-align:center; padding:20px;">No cards can be upgraded. Need 3+ copies of the same card.</div>';
            return;
        }

        upgradeableIds.forEach(cardId => {
            const card = CARDS.find(c => c.id === cardId);
            if (!card) return;

            const count = cardCounts[cardId];
            const cardLevel = cardUpgrade.getCardLevel(cardId);

            const el = document.createElement('div');
            el.className = `upgrade-card type-${card.type.toLowerCase()}`;
            el.innerHTML = `
                <div class="upgrade-card-img">${card.img}</div>
                <div class="upgrade-card-name">${card.name}</div>
                <div class="upgrade-card-level">Lv.${cardLevel}</div>
                <div class="upgrade-card-count">${count} owned</div>
                <div class="upgrade-card-val">ATK: ${cardUpgrade.getUpgradedVal(card, cardLevel)}</div>
            `;
            el.onclick = () => cardUpgrade.selectCard(card, count, cardLevel);
            container.appendChild(el);
        });
    },

    getCardLevel: (cardId) => {
        if (!app.userData || !app.userData.cardLevels) return 1;
        return app.userData.cardLevels[cardId] || 1;
    },

    getUpgradedVal: (card, level) => {
        return card.val + (level - 1) * 5;
    },

    selectCard: (card, count, level) => {
        cardUpgrade.selectedCard = { card, count, level };

        const modal = document.getElementById('modal-upgrade');
        const newVal = cardUpgrade.getUpgradedVal(card, level + 1);

        document.getElementById('upgrade-card-name').innerText = card.name;
        document.getElementById('upgrade-card-img').innerText = card.img;
        document.getElementById('upgrade-current-level').innerText = `Lv.${level}`;
        document.getElementById('upgrade-new-level').innerText = `Lv.${level + 1}`;
        document.getElementById('upgrade-current-val').innerText = cardUpgrade.getUpgradedVal(card, level);
        document.getElementById('upgrade-new-val').innerText = newVal;
        document.getElementById('upgrade-cost').innerText = '2 copies';

        modal.classList.add('active');
    },

    closeUpgradeModal: () => {
        document.getElementById('modal-upgrade').classList.remove('active');
        cardUpgrade.selectedCard = null;
    },

    confirmUpgrade: async () => {
        if (!cardUpgrade.selectedCard || !app.user || !app.userData) return;

        const { card, count, level } = cardUpgrade.selectedCard;

        // Remove 2 copies from collection
        let removed = 0;
        const newCollection = [];
        for (const id of app.userData.collection) {
            if (id === card.id && removed < 2) {
                removed++;
            } else {
                newCollection.push(id);
            }
        }

        if (removed < 2) {
            app.msg('ERROR', 'Not enough copies');
            return;
        }

        // Update card level
        if (!app.userData.cardLevels) app.userData.cardLevels = {};
        app.userData.cardLevels[card.id] = level + 1;
        app.userData.collection = newCollection;

        // Save to Firebase
        try {
            await updateDoc(docFunc(db, "users", app.user.uid), {
                collection: newCollection,
                cardLevels: app.userData.cardLevels
            });

            app.msg('SUCCESS', `${card.name} upgraded to Lv.${level + 1}!`);
            cardUpgrade.closeUpgradeModal();
            cardUpgrade.render();
            app.updateUI();
        } catch (e) {
            console.error('Failed to upgrade card:', e);
            app.msg('ERROR', 'Failed to save upgrade');
        }
    }
};
