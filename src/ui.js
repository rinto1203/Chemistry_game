// UI Effects - COSMIC CHEMISTRY: DECK
// Handles all visual effects including damage flash, combo animations, and floating text

export const ui = {
    // Damage flash and shake effect
    damageFX: () => {
        const f = document.getElementById('red-flash');
        f.style.opacity = 0.5;
        setTimeout(() => f.style.opacity = 0, 100);

        document.getElementById('battle-stage-div').classList.add('shake');
        setTimeout(() => document.getElementById('battle-stage-div').classList.remove('shake'), 500);
    },

    // Combo effect animation
    showComboEffect: () => {
        const effect = document.createElement('div');
        effect.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); font-size:3rem; font-weight:900; color:var(--c-gold); text-shadow:0 0 20px var(--c-gold); z-index:9999; animation:comboAnim 1.5s forwards;';
        effect.innerText = '⚡ COMBO!';
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1500);
    },

    // Show floating effect result text
    showEffectResult: (result, card) => {
        const zone = document.getElementById('field-card');
        if (!zone) return;

        const effect = document.createElement('div');
        effect.style.cssText = 'position:absolute; top:-30px; left:50%; transform:translateX(-50%); font-size:1.5rem; font-weight:bold; z-index:100; animation:floatUp 1s forwards;';

        if (result.damage) {
            effect.innerText = `-${result.damage}`;
            effect.style.color = 'var(--c-pink)';
        } else if (result.healed) {
            effect.innerText = `+${result.healed}`;
            effect.style.color = '#00ff00';
        } else if (result.drew) {
            effect.innerText = `+${result.drew} CARDS`;
            effect.style.color = 'var(--c-cyan)';
        } else if (result.manaGained) {
            effect.innerText = `+${result.manaGained} MANA`;
            effect.style.color = 'var(--c-cyan)';
        } else if (result.shieldApplied) {
            effect.innerText = `SHIELD +${result.shieldApplied}`;
            effect.style.color = 'var(--c-gold)';
        } else if (result.damageBoostApplied) {
            effect.innerText = `ATK +${result.damageBoostApplied}`;
            effect.style.color = 'var(--c-pink)';
        }

        zone.style.position = 'relative';
        zone.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }
};
