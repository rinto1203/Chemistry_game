# Refactor COSMIC CHEMISTRY: DECK to Modular Architecture (MVP Phase 1)

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with PLANS.md located at the repository root.


## Purpose / Big Picture

Currently, the COSMIC CHEMISTRY: DECK game exists as a single monolithic HTML file (index.html, 658 lines) containing all HTML structure, CSS styling, and JavaScript game logic inline. This makes the codebase difficult to maintain, test, and extend as we build toward our goal of 100+ cards, 12 areas, and advanced features like PvP.

After completing this ExecPlan, a developer will have a cleanly separated codebase with distinct HTML, CSS, and JavaScript files organized by responsibility. The game will function identically to the current version—users can still log in with Google, play battles, answer chemistry quizzes to charge mana, play cards, and win battles to earn energy. The difference is that the code will be maintainable and ready for the planned features described in SPEC.md.

To verify success, a user should be able to open the game in a browser, sign in with Google, start a battle, answer a quiz question, play cards from their hand, defeat the enemy, and see the victory message with energy reward—all exactly as the current version works.


## Progress

- [x] (2025-12-09) Read and understand current codebase structure (index.html, script.js, style.css)
- [x] (2025-12-09) Create directory structure for modular architecture
- [x] (2025-12-09) Extract inline CSS from index.html to css/main.css
- [x] (2025-12-09) Extract inline JavaScript from index.html to separate modules
- [x] (2025-12-09) Split JavaScript into logical modules (app.js, game.js, ui.js, firebase-config.js, data/)
- [x] (2025-12-09) Update index.html to reference external CSS and JS files
- [x] (2025-12-09) Create initial card data (30 cards) in data/cards.js
- [x] (2025-12-09) Create initial quiz data (30 questions) in data/quizzes.js
- [x] (2025-12-09) Create initial area data (3 areas) in data/areas.js
- [ ] Test that the refactored application works identically to the original
- [ ] Document the new file structure in README.md
- [ ] Commit the refactored codebase


## Surprises & Discoveries

(This section will be updated as implementation progresses)


## Decision Log

- Decision: Use ES6 modules instead of bundling tools
  Rationale: SPEC.md specifies "シンプルな構成を維持" (maintain simple structure) and explicitly states no build tools. ES6 modules are natively supported by modern browsers and avoid the complexity of Webpack/Vite.
  Date: 2025-12-09

- Decision: Keep Firebase configuration in a separate firebase-config.js file but load it as a module
  Rationale: Separates concerns while maintaining simplicity. The API keys will eventually be moved to environment variables, but for now we keep them in a dedicated file for easy location and future migration.
  Date: 2025-12-09

- Decision: Use script.js and style.css as legacy files to preserve, but create new src/ directory for refactored code
  Rationale: SPEC.md states "基本はそのまま" (basically keep as is) for existing files. The old script.js appears to be an earlier prototype. We'll preserve it but build the new structure separately.
  Date: 2025-12-09


## Outcomes & Retrospective

(This section will be filled upon completion)


## Context and Orientation

The current repository contains a chemistry-themed card battle game. The main implementation exists in `index.html` as a single-file application. There are also two unused files: `script.js` (an earlier prototype with simpler quiz-based gameplay) and `style.css` (styles for that prototype).

The active game in `index.html` includes:
- Firebase integration for Google authentication and Firestore data persistence
- A card battle system with 15 pre-defined cards (ACID, BASE, METAL, NEUTRAL types)
- A quiz system with 3 chemistry questions that charge mana
- An effect handler system supporting damage, heal, draw, manaBoost, and special effects
- A combo system that checks the last 5 played cards for type matching
- A gacha system for acquiring new cards using energy currency
- Visual effects including particle animations, damage flashes, and combo displays

The Firebase configuration contains:
- Project ID: chemistrygame-c35df
- Auth domain: chemistrygame-c35df.firebaseapp.com
- API key: AIzaSyCrT7OGBxhm4o7RWJMrMKhVYzFfbb8jNMw (publicly visible, acceptable for Firebase web apps)

According to SPEC.md, the goal is to build an MVP within one month with 30 cards, 3 areas, 30 quiz questions, and core systems including deck editing, card strengthening, rank system (F-D), and achievements. The current code provides most battle mechanics but lacks deck editing, card strengthening, multiple areas, rank progression, and achievements.

This ExecPlan focuses on Phase 1: refactoring the existing monolithic code into a maintainable modular structure without changing functionality.


## Plan of Work

We will transform the single-file application into a modular structure while preserving all existing functionality. The work proceeds in this order:

First, create a new directory structure:
- `src/` for JavaScript modules
- `src/data/` for game data (cards, quizzes, areas)
- `css/` for stylesheets
- `assets/` for future images and sounds (placeholder for now)

Second, extract all CSS from the `<style>` tag in index.html (lines 8-152) into `css/main.css`. This is straightforward copy-paste since the CSS is well-organized.

Third, extract JavaScript into modules:
- `src/firebase-config.js`: Firebase initialization and configuration
- `src/data/cards.js`: CARDS array (lines 268-304) expanded to 30 cards
- `src/data/quizzes.js`: QUIZZES array (lines 305-307) expanded to 30 questions
- `src/data/areas.js`: New file defining the 3 initial areas
- `src/effects.js`: EFFECT_HANDLERS object (lines 310-374) and checkCombo function (lines 377-382)
- `src/app.js`: The app object (lines 392-433) handling auth, navigation, and gacha
- `src/game.js`: The game object (lines 436-597) managing battle logic
- `src/ui.js`: The ui object (lines 599-644) for visual effects
- `src/main.js`: Initialization code (lines 647-656) that ties everything together

Fourth, update `index.html` to:
- Remove the inline `<style>` block and add `<link rel="stylesheet" href="css/main.css">`
- Remove the inline `<script>` block and add `<script type="module" src="src/main.js"></script>`
- Keep all HTML structure (lines 154-251) unchanged

Fifth, ensure proper ES6 module imports/exports:
- Each module exports its objects/functions
- main.js imports and initializes everything
- Use Firebase SDK from CDN as before (ES6 module imports)

Sixth, extend data files to meet MVP requirements:
- Expand cards.js from 15 to 30 cards following the same schema
- Expand quizzes.js from 3 to 30 questions with difficulty levels
- Create areas.js with 3 area definitions (物質の構成, 化学結合, 物質の状態)


## Concrete Steps

All commands should be run from the repository root directory `C:\Users\rikur\OneDrive\画像\ドキュメント\Chemistry_game`.

**Step 1: Create directory structure**

Run these commands in a terminal:

    mkdir src
    mkdir src\data
    mkdir css
    mkdir assets

Expected result: Three new directories appear in the project root. Running `dir` should show:

    Directory of C:\Users\rikur\OneDrive\画像\ドキュメント\Chemistry_game

    <DIR>  assets
    <DIR>  css
    <DIR>  src
    index.html
    script.js
    style.css
    SPEC.md
    PLANS.md
    EXECPLAN.md

**Step 2: Extract CSS to css/main.css**

Create `css/main.css` containing the entire `<style>` block content from index.html (lines 8-152). The file should begin with:

    :root {
        --c-cyan: #00f3ff;
        --c-blue: #0066ff;
        ...
    }

And end with the loading spinner style:

    #loading { position: fixed; inset: 0; background: #000; z-index: 9999; display: flex; justify-content: center; align-items: center; color: var(--c-cyan); font-weight: bold; font-size: 1.5rem; }

Total lines: approximately 145 lines of CSS.

**Step 3: Create Firebase configuration module**

Create `src/firebase-config.js`:

    export const firebaseConfig = {
        apiKey: "AIzaSyCrT7OGBxhm4o7RWJMrMKhVYzFfbb8jNMw",
        authDomain: "chemistrygame-c35df.firebaseapp.com",
        projectId: "chemistrygame-c35df",
        storageBucket: "chemistrygame-c35df.firebasestorage.app",
        messagingSenderId: "431679203776",
        appId: "1:431679203776:web:05adc13652a53fcb6f4025",
        measurementId: "G-VE03BDSTML"
    };

This file exports only the configuration object for use by main.js.

**Step 4: Create card data module**

Create `src/data/cards.js`. Start with the existing 15 cards from index.html lines 268-304, then add 15 more cards following the same schema to reach 30 total. Each card must have:

    {
        id: Number,
        name: String,
        type: "ACID" | "BASE" | "METAL" | "NEUTRAL",
        val: Number,
        cost: Number,
        img: String,
        rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY",
        effectType: "damage" | "heal" | "draw" | "manaBoost" | "special",
        target: "enemy" | "self",
        combo: { type: String, count: Number } (optional),
        comboBonus: { val: Number, effect: String, value: Number } (optional),
        description: String
    }

Export as:

    export const CARDS = [ /* array of 30 card objects */ ];

New cards should include variety across all types and rarities. Examples of cards to add:
- More ACID cards: phosphoric acid, acetic acid, carbonic acid
- More BASE cards: potassium hydroxide, calcium oxide, magnesium hydroxide
- More METAL cards: silver, gold, aluminum, magnesium
- More NEUTRAL cards: hydrogen peroxide upgrades, various salts, buffer solutions

**Step 5: Create quiz data module**

Create `src/data/quizzes.js` with 30 chemistry questions. Start with the existing 3 questions from index.html lines 305-307:

    { q: "pH<7?", a: 0, o: ["酸性","中性","塩基性"] }
    { q: "炎色反応:黄?", a: 1, o: ["Cu","Na","K"] }
    { q: "原子番号1?", a: 0, o: ["H","He","Li"] }

Then add 27 more questions covering topics from SPEC.md categories:
- 元素 (elements): atomic numbers, symbols, groups
- 化学結合 (chemical bonds): ionic, covalent, metallic
- 化学反応 (reactions): balancing equations, reaction types
- 酸塩基 (acids and bases): pH calculations, neutralization
- 酸化還元 (redox): oxidation states, electrochemistry
- 無機化学 (inorganic): halogens, metals, non-metals
- 工業化学 (industrial): Haber process, contact process

Each question should have the schema:

    {
        q: String,        // question text
        a: Number,        // correct answer index (0-3)
        o: [String],      // array of 4 options
        category: String, // category name
        difficulty: String // "normal" or "hard"
    }

Export as:

    export const QUIZZES = [ /* array of 30 quiz objects */ ];

Approximately 20 questions should be "normal" difficulty and 10 should be "hard" as per SPEC.md.

**Step 6: Create area data module**

Create `src/data/areas.js` with definitions for the first 3 areas according to SPEC.md table:

    export const AREAS = [
        {
            id: 1,
            name: "物質の構成",
            theme: "原子、イオン、同位体",
            bossName: "イオン王",
            bossHp: 150,
            unlockRank: "F",
            description: "物質を構成する基本的な粒子について学ぼう"
        },
        {
            id: 2,
            name: "化学結合",
            theme: "イオン結合、共有結合、金属結合",
            bossName: "結合の守護者",
            bossHp: 180,
            unlockRank: "E",
            description: "原子同士がどのように結びつくかを理解しよう"
        },
        {
            id: 3,
            name: "物質の状態",
            theme: "気体、液体、固体、状態変化",
            bossName: "相変化の魔術師",
            bossHp: 200,
            unlockRank: "E",
            description: "物質の三態とその変化について探求しよう"
        }
    ];

**Step 7: Create effects module**

Create `src/effects.js` containing the EFFECT_HANDLERS object (index.html lines 310-374) and checkCombo function (lines 377-382). This file should export:

    export const EFFECT_HANDLERS = { /* effect handler functions */ };
    export function checkCombo(comboCondition, fieldHistory) { /* implementation */ }

The code is copied directly from index.html with no modifications.

**Step 8: Create app module**

Create `src/app.js` containing the app object logic (index.html lines 392-433). This module needs to import Firebase modules and export the app object.

At the top of the file, import Firebase:

    import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

The module should receive auth, db, and provider as parameters through an initialization function:

    let auth, db, provider;

    export function initApp(firebaseAuth, firebaseDb, googleProvider) {
        auth = firebaseAuth;
        db = firebaseDb;
        provider = googleProvider;
    }

    export const app = { /* app object from index.html */ };

The app object's methods remain unchanged except they reference the module-scoped auth, db, provider variables.

**Step 9: Create game module**

Create `src/game.js` containing the game object (index.html lines 436-597). This module needs to import the app object and EFFECT_HANDLERS.

At the top:

    import { app } from './app.js';
    import { EFFECT_HANDLERS, checkCombo } from './effects.js';
    import { CARDS } from './data/cards.js';

Export the game object:

    export const game = { /* game object from index.html */ };

The game logic remains unchanged. The reference to `app.userData` works because we import the app object.

**Step 10: Create UI module**

Create `src/ui.js` containing the ui object (index.html lines 599-644):

    export const ui = {
        damageFX: () => { /* damage flash and shake */ },
        showComboEffect: () => { /* combo animation */ },
        showEffectResult: (result, card) => { /* floating damage numbers */ }
    };

This code is copied directly with no modifications.

**Step 11: Create main initialization module**

Create `src/main.js` that:
1. Imports Firebase app initialization
2. Imports the firebaseConfig
3. Imports and initializes all modules
4. Sets up the particle animation canvas
5. Initializes Firebase auth listener

The structure:

    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
    import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

    import { firebaseConfig } from './firebase-config.js';
    import { initApp, app } from './app.js';
    import { game } from './game.js';
    import { ui } from './ui.js';

    // Initialize Firebase
    let auth, db, provider;
    try {
        const fireApp = initializeApp(firebaseConfig);
        auth = getAuth(fireApp);
        db = getFirestore(fireApp);
        provider = new GoogleAuthProvider();
        initApp(auth, db, provider);
    } catch(e) {
        console.error(e);
    }

    // Expose to window for onclick handlers in HTML
    window.app = app;
    window.game = game;
    window.ui = ui;

    // Set up auth listener (lines 647-648 from index.html)
    if(auth) {
        onAuthStateChanged(auth, u => u ? app.initUser(u) : (app.nav('login'), document.getElementById('loading').style.display='none'));
    } else {
        document.getElementById('loading').style.display='none';
    }

    // Particle animation (lines 650-655 from index.html)
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let p = [];
    for(let i=0; i<50; i++) {
        p.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            s: Math.random()*2,
            v: Math.random()*0.5
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,243,255,0.3)";
        p.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.s, 0, Math.PI*2);
            ctx.fill();
            d.y -= d.v;
            if(d.y < 0) d.y = canvas.height;
        });
        requestAnimationFrame(draw);
    }
    draw();

Note that we expose app, game, and ui to window because the HTML uses inline onclick handlers like `onclick="app.loginGoogle()"`. A future refactoring could move these to event listeners, but for this phase we preserve the existing HTML structure.

**Step 12: Update index.html**

Edit index.html to:

1. Replace the `<style>` block (lines 8-152) with:

    <link rel="stylesheet" href="css/main.css">

2. Replace the entire `<script type="module">` block (lines 252-656) with:

    <script type="module" src="src/main.js"></script>

The HTML structure (lines 154-251) remains completely unchanged. The final index.html will be approximately 110 lines instead of 658.

**Step 13: Test the refactored application**

Open index.html in a web browser (Chrome, Firefox, or Edge). You can do this by:
- Double-clicking index.html in Windows Explorer, or
- Running `start index.html` from the command line, or
- Using a local development server like `python -m http.server 8000` and navigating to http://localhost:8000

Expected behavior:
1. The login screen appears with "COSMIC CHEMISTRY" title and "Sign in with Google" button
2. After clicking sign in and authenticating, the home screen appears showing your name, energy, and card count
3. Clicking "START MISSION" takes you to the battle screen
4. A quiz modal appears asking a chemistry question
5. Answering the question (correctly or incorrectly) charges mana and allows you to play cards
6. Playing a card costs mana and damages the enemy
7. The enemy attacks back after your turn
8. Defeating the enemy shows a victory message and rewards energy
9. The game functions identically to the original single-file version

If any errors occur, open the browser's Developer Console (F12) to see error messages. Common issues:
- CORS errors: You may need to serve the files via HTTP server instead of file:// protocol
- Module import errors: Check that file paths are correct and case-sensitive
- Firebase errors: Verify that Firebase configuration is correct

**Step 14: Create README.md documenting the new structure**

Create `README.md` at the repository root:

    # COSMIC CHEMISTRY: DECK

    A chemistry-themed card battle game combining education and entertainment.

    ## Project Structure

    ```
    Chemistry_game/
    ├── index.html              # Main HTML file
    ├── css/
    │   └── main.css           # All styles
    ├── src/
    │   ├── main.js            # Entry point, Firebase init, particle animation
    │   ├── firebase-config.js # Firebase configuration
    │   ├── app.js             # App state, auth, navigation, gacha
    │   ├── game.js            # Battle logic
    │   ├── ui.js              # Visual effects
    │   ├── effects.js         # Card effect handlers and combo logic
    │   └── data/
    │       ├── cards.js       # Card definitions (30 cards)
    │       ├── quizzes.js     # Quiz questions (30 questions)
    │       └── areas.js       # Area definitions (3 areas)
    ├── assets/                # Future: images, sounds
    ├── SPEC.md                # Complete specification
    ├── PLANS.md               # ExecPlan format requirements
    ├── EXECPLAN.md            # This implementation plan
    ├── script.js              # Legacy prototype (unused)
    └── style.css              # Legacy prototype styles (unused)
    ```

    ## Running the Game

    ### Option 1: Local File
    Open `index.html` directly in a modern web browser.

    ### Option 2: Local Server (Recommended)
    ```
    python -m http.server 8000
    ```
    Then navigate to http://localhost:8000

    ## Development

    - All game logic is in ES6 modules under `src/`
    - Card data can be extended in `src/data/cards.js`
    - Quiz questions can be added in `src/data/quizzes.js`
    - New areas are defined in `src/data/areas.js`

    ## Firebase

    The game uses Firebase for:
    - Authentication (Google Sign-in)
    - Firestore (user data persistence)

    Configuration is in `src/firebase-config.js`.

    ## Next Steps

    See SPEC.md for the full roadmap. MVP includes:
    - 30 cards across 4 types (ACID, BASE, METAL, NEUTRAL)
    - 3 areas (物質の構成, 化学結合, 物質の状態)
    - 30 quiz questions (normal and hard difficulty)
    - Deck editing system
    - Card strengthening system
    - Rank system (F-D)
    - 10 achievements

This README provides orientation for any developer who encounters the codebase.


## Validation and Acceptance

After completing all steps, validation proceeds as follows:

**Functional Testing:**

1. Open the game in a browser and verify the login screen appears correctly styled
2. Sign in with Google and verify that authentication succeeds
3. Verify that the home screen shows player name, energy (500 for new users), and card count
4. Click "START MISSION" and verify the battle screen loads
5. Verify that a quiz modal appears with a chemistry question and 4 answer choices
6. Answer a question correctly and verify that mana increases by 3
7. Verify that a card is drawn and appears in your hand
8. Click on a card and verify it plays to the field zone if you have sufficient mana
9. Verify that the enemy takes damage and the HP bar decreases
10. Verify that the enemy attacks back and your HP decreases
11. Continue playing cards until the enemy HP reaches 0
12. Verify that the victory message appears: "VICTORY +200 Energy"
13. Verify that energy increases by 200
14. Click "MATERIALIZE" on the home screen
15. Click the diamond symbol to perform gacha (costs 100 energy)
16. Verify that a random card is acquired and added to your collection
17. Verify that all visual effects work: particle background, damage flash, combo effects

**Code Quality Checks:**

1. Open browser Developer Console (F12) and verify there are no errors
2. Verify that all ES6 module imports resolve successfully
3. Check that Firebase authentication and Firestore operations complete without errors
4. Verify that the Network tab shows CSS and JS files loading successfully (not 404 errors)

**Data Validation:**

1. Open `src/data/cards.js` and verify it contains exactly 30 card definitions
2. Open `src/data/quizzes.js` and verify it contains exactly 30 quiz questions
3. Open `src/data/areas.js` and verify it contains exactly 3 area definitions
4. Verify that each card has all required fields (id, name, type, val, cost, etc.)
5. Verify that each quiz has question text, 4 options, correct answer index, category, and difficulty

**Structure Validation:**

1. Run `dir` (Windows) or `ls -la` (Unix) and verify the directory structure matches the README
2. Verify that index.html is approximately 110 lines (down from 658)
3. Verify that css/main.css contains all the extracted CSS (approximately 145 lines)
4. Verify that no duplicate code exists between files
5. Verify that all inline event handlers in HTML (onclick attributes) still function

The acceptance criterion is: The refactored application behaves identically to the original monolithic version, with no regressions in functionality, and the code is now organized into maintainable modules ready for MVP feature development.


## Idempotence and Recovery

This refactoring is idempotent by design. If you need to restart at any point:

1. If you created directories but not files, simply delete the empty directories and start over
2. If you created some files but encounter errors, delete the files you created and restart from that step
3. The original index.html, script.js, and style.css are never modified until Step 12, so you can always revert

To safely test the refactoring before committing to it:
1. Create a backup of index.html: `copy index.html index.html.backup`
2. Complete all steps through Step 11
3. In Step 12, test the refactored version by temporarily renaming index.html and creating the new version
4. If testing fails, restore the backup: `copy index.html.backup index.html`

Git recovery:
- Before starting, commit the current state: `git add -A && git commit -m "Snapshot before refactoring"`
- If you need to revert completely: `git reset --hard HEAD`
- To see what changed: `git diff`

The refactoring is designed to be completed in one sitting (approximately 2-4 hours) to minimize interruption risk.


## Artifacts and Notes

**Expected file sizes after refactoring:**

    index.html        ~110 lines (down from 658)
    css/main.css      ~145 lines
    src/main.js       ~80 lines
    src/app.js        ~50 lines
    src/game.js       ~180 lines
    src/ui.js         ~50 lines
    src/effects.js    ~70 lines
    src/firebase-config.js  ~10 lines
    src/data/cards.js      ~200 lines (30 cards × ~6-7 lines each)
    src/data/quizzes.js    ~150 lines (30 quizzes × ~5 lines each)
    src/data/areas.js      ~30 lines (3 areas × ~10 lines each)

**Total line count:** Approximately 1,065 lines across 11 files, compared to 658 lines in the original monolithic index.html. The increase is due to:
- Adding 15 more cards (15 → 30)
- Adding 27 more quiz questions (3 → 30)
- Adding 3 area definitions (0 → 3)
- Module boilerplate (imports/exports)

**Example card definition (for reference):**

    {
        id: 16,
        name: "リン酸",
        type: "ACID",
        val: 25,
        cost: 2,
        img: "H₃PO₄",
        rarity: "COMMON",
        effectType: "damage",
        target: "enemy",
        description: "弱酸性の三価の酸"
    }

**Example quiz question (for reference):**

    {
        q: "希ガスで原子番号が最も小さいのは？",
        a: 0,
        o: ["He", "Ne", "Ar", "Kr"],
        category: "元素",
        difficulty: "normal"
    }


## Interfaces and Dependencies

This section defines the exact interfaces that must exist between modules after refactoring.

**src/firebase-config.js exports:**

    export const firebaseConfig: {
        apiKey: string,
        authDomain: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string,
        appId: string,
        measurementId: string
    }

**src/data/cards.js exports:**

    export const CARDS: Array<{
        id: number,
        name: string,
        type: "ACID" | "BASE" | "METAL" | "NEUTRAL",
        val: number,
        cost: number,
        img: string,
        rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY",
        effectType: "damage" | "heal" | "draw" | "manaBoost" | "special",
        target: "enemy" | "self",
        combo?: { type: string, count: number },
        comboBonus?: { val?: number, effect?: string, value?: number },
        description: string
    }>

**src/data/quizzes.js exports:**

    export const QUIZZES: Array<{
        q: string,
        a: number,
        o: [string, string, string, string],
        category: string,
        difficulty: "normal" | "hard"
    }>

**src/data/areas.js exports:**

    export const AREAS: Array<{
        id: number,
        name: string,
        theme: string,
        bossName: string,
        bossHp: number,
        unlockRank: string,
        description: string
    }>

**src/effects.js exports:**

    export const EFFECT_HANDLERS: {
        damage: (card, attacker, defender, context) => { damage: number, combo: boolean },
        heal: (card, attacker, defender, context) => { healed: number },
        draw: (card, attacker, defender, context) => { drew: number },
        manaBoost: (card, attacker, defender, context) => { manaGained: number },
        special: (card, attacker, defender, context) => object
    }

    export function checkCombo(
        comboCondition: { type: string, count: number },
        fieldHistory: Array<Card>
    ): boolean

**src/app.js exports:**

    export function initApp(auth, db, provider): void

    export const app: {
        user: FirebaseUser | null,
        userData: object | null,
        loginGoogle: () => Promise<void>,
        logout: () => void,
        initUser: (user: FirebaseUser) => Promise<void>,
        updateUI: () => void,
        nav: (screenId: string) => void,
        msg: (title: string, text: string) => void,
        gacha: () => Promise<void>,
        startBattle: () => void
    }

**src/game.js exports:**

    export const game: {
        state: object,
        init: () => void,
        drawPlayer: () => void,
        startTurn: () => void,
        quiz: () => void,
        play: (index: number) => void,
        cpuAction: () => void,
        resolve: (card, attacker, defender) => void,
        endTurn: () => void,
        render: () => void
    }

**src/ui.js exports:**

    export const ui: {
        damageFX: () => void,
        showComboEffect: () => void,
        showEffectResult: (result: object, card: object) => void
    }

**src/main.js exports:**

Nothing. This is the entry point that orchestrates initialization.

**Dependencies:**

All modules depend on:
- Modern browser with ES6 module support (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+)
- Internet connection for Firebase SDK CDN
- Firebase project credentials (already configured)

No build tools, no package.json, no node_modules. This is intentional per SPEC.md requirements.


---

**Revision History:**

- 2025-12-09: Initial ExecPlan created. Defines refactoring of monolithic index.html into modular architecture with 30 cards, 30 quizzes, and 3 areas as per SPEC.md MVP requirements. No implementation yet.
