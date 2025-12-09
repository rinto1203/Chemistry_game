// Achievement Module - COSMIC CHEMISTRY: DECK
// Handles achievement tracking, display, and reward claiming

import { ACHIEVEMENTS, getNewAchievements, getAchievementProgress } from './data/achievements.js';

let app = null;
let db = null;
let docFunc = null;
let updateDoc = null;
let increment = null;

export function initAchievements(appRef, dbRef, docRef, updateDocRef, incrementRef) {
    app = appRef;
    db = dbRef;
    docFunc = docRef;
    updateDoc = updateDocRef;
    increment = incrementRef;
}

export const achievements = {
    init: () => {
        achievements.render();
    },

    render: () => {
        const container = document.getElementById('achievement-list');
        if (!container || !app.userData) return;
        container.innerHTML = '';

        const progress = getAchievementProgress(app.userData);

        progress.forEach(achievement => {
            const el = document.createElement('div');
            el.className = 'achievement-item';
            if (achievement.claimed) el.classList.add('claimed');
            else if (achievement.completed) el.classList.add('completed');

            el.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                </div>
                <div class="achievement-reward">
                    ${achievement.claimed ? 'CLAIMED' :
                      achievement.completed ? `<button class="btn-claim" data-id="${achievement.id}">+${achievement.reward.energy}</button>` :
                      `+${achievement.reward.energy}`}
                </div>
            `;

            // Add click handler for claim button
            const claimBtn = el.querySelector('.btn-claim');
            if (claimBtn) {
                claimBtn.onclick = () => achievements.claim(achievement.id);
            }

            container.appendChild(el);
        });
    },

    claim: async (achievementId) => {
        if (!app.user || !app.userData) return;

        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        // Check if already claimed
        const claimed = app.userData.claimedAchievements || [];
        if (claimed.includes(achievementId)) return;

        // Check if condition is met
        if (!achievement.condition(app.userData)) return;

        // Add reward
        app.userData.energy += achievement.reward.energy;
        app.userData.claimedAchievements = [...claimed, achievementId];

        // Save to Firebase
        try {
            await updateDoc(docFunc(db, "users", app.user.uid), {
                energy: increment(achievement.reward.energy),
                claimedAchievements: app.userData.claimedAchievements
            });

            app.msg('ACHIEVEMENT', `${achievement.name}: +${achievement.reward.energy} Energy!`);
            achievements.render();
            app.updateUI();
        } catch (e) {
            console.error('Failed to claim achievement:', e);
            app.msg('ERROR', 'Failed to claim reward');
        }
    },

    // Check for new achievements (call after battle, gacha, etc.)
    checkNew: () => {
        if (!app.userData) return;

        const newAchievements = getNewAchievements(app.userData);
        if (newAchievements.length > 0) {
            // Show notification for first new achievement
            const first = newAchievements[0];
            setTimeout(() => {
                app.msg('NEW ACHIEVEMENT!', `${first.icon} ${first.name}\n${first.description}`);
            }, 1000);
        }
    }
};
