// App Module - COSMIC CHEMISTRY: DECK
// Handles authentication, user data, navigation, and gacha system

import { CARDS } from './data/cards.js';
import { AREAS } from './data/areas.js';

// Firebase references will be set by main.js
let auth = null;
let db = null;
let provider = null;
let signInWithPopup = null;
let signOut = null;
let docFunc = null;
let setDoc = null;
let getDoc = null;
let updateDoc = null;
let arrayUnion = null;
let increment = null;

// Game reference will be set by main.js
let gameRef = null;
let deckEditorRef = null;
let areaSelectorRef = null;
let cardUpgradeRef = null;
let achievementsRef = null;

export function initApp(firebaseAuth, firebaseDb, googleProvider, firebaseFuncs, gameModule, deckEditorModule, areaSelectorModule, cardUpgradeModule, achievementsModule) {
    auth = firebaseAuth;
    db = firebaseDb;
    provider = googleProvider;
    signInWithPopup = firebaseFuncs.signInWithPopup;
    signOut = firebaseFuncs.signOut;
    docFunc = firebaseFuncs.doc;
    setDoc = firebaseFuncs.setDoc;
    getDoc = firebaseFuncs.getDoc;
    updateDoc = firebaseFuncs.updateDoc;
    arrayUnion = firebaseFuncs.arrayUnion;
    increment = firebaseFuncs.increment;
    gameRef = gameModule;
    deckEditorRef = deckEditorModule;
    areaSelectorRef = areaSelectorModule;
    cardUpgradeRef = cardUpgradeModule;
    achievementsRef = achievementsModule;
}

export const app = {
    user: null,
    userData: null,
    selectedArea: null,

    loginGoogle: async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (e) {
            alert(e.message);
        }
    },

    logout: () => {
        signOut(auth).then(() => location.reload());
    },

    initUser: async (u) => {
        app.user = u;
        const ref = docFunc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            app.userData = snap.data();
        } else {
            app.userData = {
                name: u.displayName,
                energy: 500,
                collection: [1, 3, 4, 5],
                rank: "F",
                totalWins: 0,
                totalLosses: 0,
                coins: 0
            };
            await setDoc(ref, app.userData);
        }
        app.updateUI();
        app.nav('home');
        document.getElementById('loading').style.display = 'none';
    },

    updateUI: () => {
        if (!app.userData) return;
        document.getElementById('home-name').innerText = app.userData.name;
        document.getElementById('home-energy').innerText = app.userData.energy;
        document.getElementById('home-cards').innerText = app.userData.collection.length;

        // Update rank display
        const rankDisplay = document.querySelector('.profile-panel div:nth-child(2)');
        if (rankDisplay) {
            rankDisplay.innerHTML = `<span style="font-size:2rem; color:var(--c-gold);">RANK ${app.userData.rank}</span>`;
        }
    },

    nav: (id) => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screen-' + id).classList.add('active');

        // Initialize screens when navigating
        if (id === 'deck' && deckEditorRef) {
            deckEditorRef.init();
        }
        if (id === 'area' && areaSelectorRef) {
            areaSelectorRef.init();
        }
        if (id === 'upgrade' && cardUpgradeRef) {
            cardUpgradeRef.init();
        }
        if (id === 'achievements' && achievementsRef) {
            achievementsRef.init();
        }
    },

    msg: (t, txt) => {
        document.getElementById('msg-title').innerText = t;
        document.getElementById('msg-text').innerText = txt;
        document.getElementById('modal-msg').classList.add('active');
    },

    gacha: async () => {
        if (app.userData.energy < 100) return app.msg("ERROR", "Need 100 Energy");
        app.userData.energy -= 100;

        // Weighted random based on rarity
        const rarityWeights = {
            'COMMON': 60,
            'RARE': 25,
            'EPIC': 12,
            'LEGENDARY': 3
        };

        const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
        let roll = Math.random() * totalWeight;
        let selectedRarity = 'COMMON';

        for (const [rarity, weight] of Object.entries(rarityWeights)) {
            roll -= weight;
            if (roll <= 0) {
                selectedRarity = rarity;
                break;
            }
        }

        // Filter cards by rarity and pick one
        const cardsOfRarity = CARDS.filter(c => c.rarity === selectedRarity);
        const hit = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];

        app.userData.collection.push(hit.id);
        app.userData.gachaCount = (app.userData.gachaCount || 0) + 1;
        app.updateUI();
        await updateDoc(docFunc(db, "users", app.user.uid), {
            energy: increment(-100),
            collection: arrayUnion(hit.id),
            gachaCount: increment(1)
        });

        // Check achievements after gacha
        if (achievementsRef) {
            achievementsRef.checkNew();
        }

        // Show different messages based on rarity
        let title = "ACQUIRED";
        if (hit.rarity === 'LEGENDARY') title = "LEGENDARY!";
        else if (hit.rarity === 'EPIC') title = "EPIC!";
        else if (hit.rarity === 'RARE') title = "RARE!";

        app.msg(title, `${hit.name} (${hit.rarity})`);
    },

    startBattle: (area = null) => {
        // Use selected area or default to first area
        const battleArea = area || app.selectedArea || AREAS[0];
        app.selectedArea = battleArea;

        if (gameRef) {
            gameRef.init(battleArea);
        }
        app.nav('battle');
    },

    // Helper functions for game integration
    getDb: () => db,
    getDoc: () => docFunc,
    getUpdateDoc: () => updateDoc,
    getIncrement: () => increment
};
