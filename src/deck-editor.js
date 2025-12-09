// Deck Editor Module - COSMIC CHEMISTRY: DECK
// Handles deck editing functionality with 5 slots, 20 cards per deck

import { CARDS } from './data/cards.js';
import { AREAS, getUnlockedAreas } from './data/areas.js';

// Module state
let currentSlot = 0;
let currentFilter = 'ALL';
let app = null;
let db = null;
let docFunc = null;
let updateDoc = null;

// Initialize the module with app reference
export function initDeckEditor(appRef, dbRef, docRef, updateDocRef) {
    app = appRef;
    db = dbRef;
    docFunc = docRef;
    updateDoc = updateDocRef;
}

export const deckEditor = {
    // Initialize deck editor UI
    init: () => {
        deckEditor.renderSlots();
        deckEditor.renderFilters();
        deckEditor.render();
    },

    // Render deck slot buttons
    renderSlots: () => {
        const container = document.getElementById('deck-slots');
        if (!container) return;
        container.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const btn = document.createElement('div');
            btn.className = 'deck-slot-btn' + (i === currentSlot ? ' active' : '');
            btn.innerText = `SLOT ${i + 1}`;
            btn.onclick = () => {
                currentSlot = i;
                deckEditor.renderSlots();
                deckEditor.render();
            };
            container.appendChild(btn);
        }
    },

    // Render filter buttons
    renderFilters: () => {
        const container = document.getElementById('filter-bar');
        if (!container) return;
        container.innerHTML = '';

        const filters = ['ALL', 'ACID', 'BASE', 'METAL', 'NEUTRAL'];
        filters.forEach(filter => {
            const btn = document.createElement('div');
            btn.className = 'filter-btn' + (filter === currentFilter ? ' active' : '');
            btn.innerText = filter;
            btn.onclick = () => {
                currentFilter = filter;
                deckEditor.renderFilters();
                deckEditor.renderCollection();
            };
            container.appendChild(btn);
        });
    },

    // Get current deck
    getCurrentDeck: () => {
        if (!app.userData) return [];
        if (!app.userData.decks) {
            app.userData.decks = [];
        }
        if (!app.userData.decks[currentSlot]) {
            app.userData.decks[currentSlot] = {
                name: `Deck ${currentSlot + 1}`,
                cards: []
            };
        }
        return app.userData.decks[currentSlot].cards;
    },

    // Render the deck editor
    render: () => {
        deckEditor.renderDeck();
        deckEditor.renderCollection();
    },

    // Render deck cards
    renderDeck: () => {
        const container = document.getElementById('deck-cards');
        const countDisplay = document.getElementById('deck-count-display');
        if (!container) return;
        container.innerHTML = '';

        const deck = deckEditor.getCurrentDeck();

        // Count display
        if (countDisplay) {
            countDisplay.innerText = `${deck.length}/20`;
            countDisplay.className = 'deck-count';
            if (deck.length === 20) countDisplay.classList.add('full');
            else if (deck.length > 20) countDisplay.classList.add('over');
        }

        // Render each card in deck
        deck.forEach((cardId, index) => {
            const card = CARDS.find(c => c.id === cardId);
            if (!card) return;

            const el = deckEditor.createMiniCard(card, () => {
                // Remove from deck
                deck.splice(index, 1);
                deckEditor.saveDeck();
                deckEditor.render();
            }, true);
            container.appendChild(el);
        });

        // Empty slots
        for (let i = deck.length; i < 20; i++) {
            const empty = document.createElement('div');
            empty.className = 'mini-card';
            empty.style.opacity = '0.2';
            empty.innerHTML = '<div style="color:#444;">+</div>';
            container.appendChild(empty);
        }
    },

    // Render collection cards
    renderCollection: () => {
        const container = document.getElementById('collection-cards');
        if (!container || !app.userData) return;
        container.innerHTML = '';

        const deck = deckEditor.getCurrentDeck();

        // Count cards in collection
        const cardCounts = {};
        app.userData.collection.forEach(id => {
            cardCounts[id] = (cardCounts[id] || 0) + 1;
        });

        // Count cards in current deck
        const deckCounts = {};
        deck.forEach(id => {
            deckCounts[id] = (deckCounts[id] || 0) + 1;
        });

        // Get unique cards
        const uniqueCards = [...new Set(app.userData.collection)];

        // Filter and sort
        let filteredCards = uniqueCards.map(id => CARDS.find(c => c.id === id)).filter(c => c);
        if (currentFilter !== 'ALL') {
            filteredCards = filteredCards.filter(c => c.type === currentFilter);
        }

        // Sort by cost, then by type
        filteredCards.sort((a, b) => a.cost - b.cost || a.type.localeCompare(b.type));

        // Render each card
        filteredCards.forEach(card => {
            const owned = cardCounts[card.id] || 0;
            const inDeck = deckCounts[card.id] || 0;
            const available = owned - inDeck;

            const el = deckEditor.createMiniCard(card, () => {
                // Add to deck (max 2 of same card, max 20 total)
                if (deck.length >= 20) {
                    app.msg('ERROR', 'Deck is full (20 cards)');
                    return;
                }
                if (inDeck >= 2) {
                    app.msg('ERROR', 'Max 2 copies per card');
                    return;
                }
                if (available <= 0) {
                    app.msg('ERROR', 'No more copies available');
                    return;
                }
                deck.push(card.id);
                deckEditor.saveDeck();
                deckEditor.render();
            }, false, owned, inDeck);

            // Long press for detail
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                deckEditor.showCardDetail(card);
            });

            container.appendChild(el);
        });
    },

    // Create a mini card element
    createMiniCard: (card, onClick, isInDeck = false, owned = 0, inDeck = 0) => {
        const el = document.createElement('div');
        el.className = `mini-card type-${card.type.toLowerCase()}`;
        if (isInDeck) el.classList.add('in-deck');

        let countHtml = '';
        if (!isInDeck && owned > 0) {
            countHtml = `<div class="card-count">${inDeck}/${owned}</div>`;
        }

        el.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-img">${card.img}</div>
            <div class="card-name">${card.name}</div>
            ${countHtml}
        `;
        el.onclick = onClick;

        return el;
    },

    // Save deck to Firebase
    saveDeck: async () => {
        if (!app.user || !app.userData) return;

        try {
            await updateDoc(docFunc(db, "users", app.user.uid), {
                decks: app.userData.decks
            });
        } catch (e) {
            console.error('Failed to save deck:', e);
        }
    },

    // Show card detail modal
    showCardDetail: (card) => {
        document.getElementById('card-detail-rarity').innerText = card.rarity;
        document.getElementById('card-detail-rarity').style.color =
            card.rarity === 'LEGENDARY' ? '#ffd700' :
            card.rarity === 'EPIC' ? '#9900ff' :
            card.rarity === 'RARE' ? '#0088ff' : '#888';
        document.getElementById('card-detail-img').innerText = card.img;
        document.getElementById('card-detail-name').innerText = card.name;
        document.getElementById('card-detail-type').innerText = card.type;
        document.getElementById('card-detail-cost').innerText = card.cost;
        document.getElementById('card-detail-val').innerText = card.val;
        document.getElementById('card-detail-desc').innerText = card.description || '';
        document.getElementById('card-detail-chem').innerText = card.chemInfo || '';

        document.getElementById('modal-card-detail').classList.add('active');
    },

    // Close card detail modal
    closeCardDetail: () => {
        document.getElementById('modal-card-detail').classList.remove('active');
    }
};

// Area selector module
export const areaSelector = {
    init: () => {
        areaSelector.render();
    },

    render: () => {
        const container = document.getElementById('area-grid');
        if (!container || !app.userData) return;
        container.innerHTML = '';

        const playerRank = app.userData.rank || 'F';
        const unlockedAreas = getUnlockedAreas(playerRank);

        AREAS.forEach(area => {
            const isUnlocked = unlockedAreas.some(a => a.id === area.id);

            const el = document.createElement('div');
            el.className = 'area-card' + (isUnlocked ? '' : ' locked');

            el.innerHTML = `
                <div class="area-name">${area.name}</div>
                <div class="area-theme">${area.theme}</div>
                <div class="area-boss">BOSS: ${area.bossName}</div>
                <div class="area-unlock">Required: Rank ${area.unlockRank}</div>
            `;

            if (isUnlocked) {
                el.onclick = () => areaSelector.selectArea(area);
            }

            container.appendChild(el);
        });
    },

    selectArea: (area) => {
        // Store selected area and start battle
        app.selectedArea = area;
        app.startBattle(area);
    }
};
