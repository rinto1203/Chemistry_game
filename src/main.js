// Main Entry Point - COSMIC CHEMISTRY: DECK
// Initializes Firebase, modules, and background animations

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.js';
import { initApp, app } from './app.js';
import { initGame, game } from './game.js';
import { ui } from './ui.js';
import { initDeckEditor, deckEditor, areaSelector } from './deck-editor.js';
import { initCardUpgrade, cardUpgrade } from './card-upgrade.js';
import { initAchievements, achievements } from './achievements.js';

// Initialize Firebase
let auth = null;
let db = null;
let provider = null;

try {
    const fireApp = initializeApp(firebaseConfig);
    auth = getAuth(fireApp);
    db = getFirestore(fireApp);
    provider = new GoogleAuthProvider();

    // Initialize app module with Firebase references
    initApp(auth, db, provider, {
        signInWithPopup,
        signOut,
        doc,
        setDoc,
        getDoc,
        updateDoc,
        arrayUnion,
        increment
    }, game, deckEditor, areaSelector, cardUpgrade, achievements);

    // Initialize game module with Firebase references
    initGame(app, db, doc, updateDoc, increment);

    // Initialize deck editor module with Firebase references
    initDeckEditor(app, db, doc, updateDoc);

    // Initialize card upgrade module with Firebase references
    initCardUpgrade(app, db, doc, updateDoc);

    // Initialize achievements module with Firebase references
    initAchievements(app, db, doc, updateDoc, increment);

} catch (e) {
    console.error("Firebase initialization error:", e);
}

// Expose modules to window for onclick handlers in HTML
window.app = app;
window.game = game;
window.ui = ui;
window.deckEditor = deckEditor;
window.areaSelector = areaSelector;
window.cardUpgrade = cardUpgrade;
window.achievements = achievements;

// Set up authentication state listener
if (auth) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            app.initUser(user);
        } else {
            app.nav('login');
            document.getElementById('loading').style.display = 'none';
        }
    });
} else {
    document.getElementById('loading').style.display = 'none';
}

// Background Particle Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle system
const particles = [];
const PARTICLE_COUNT = 50;

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,243,255,0.3)";

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Move particle upward
        p.y -= p.speed;

        // Reset particle when it goes off screen
        if (p.y < 0) {
            p.y = canvas.height;
            p.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(drawParticles);
}

// Start animation
drawParticles();

// Log initialization complete
console.log('COSMIC CHEMISTRY: DECK initialized');
console.log('Cards loaded:', 30);
console.log('Quizzes loaded:', 30);
console.log('Areas loaded:', 3);
