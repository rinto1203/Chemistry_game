// Effect Handlers - COSMIC CHEMISTRY: DECK
// Handles all card effect logic including damage, healing, drawing, mana boost, and special effects

// Combo check function
export function checkCombo(comboCondition, fieldHistory) {
    if (!fieldHistory || fieldHistory.length === 0) return false;
    const recentCards = fieldHistory.slice(-5);
    const matchingCards = recentCards.filter(c => c.type === comboCondition.type);
    return matchingCards.length >= comboCondition.count;
}

// Effect Handlers System
export const EFFECT_HANDLERS = {
    damage: (card, attacker, defender, context) => {
        let dmg = card.val;
        let comboTriggered = false;

        // コンボチェック
        if (card.combo && checkCombo(card.combo, context.fieldHistory)) {
            if (card.comboBonus && card.comboBonus.val) dmg += card.comboBonus.val;
            comboTriggered = true;
        }

        // バフ適用
        if (attacker.buffs && attacker.buffs.damageBoost) {
            dmg += attacker.buffs.damageBoost;
            delete attacker.buffs.damageBoost;
        }

        // シールド適用
        if (defender.buffs && defender.buffs.shield) {
            dmg = Math.max(0, dmg - defender.buffs.shield);
            delete defender.buffs.shield;
        }

        defender.hp = Math.max(0, defender.hp - dmg);
        return { damage: dmg, combo: comboTriggered };
    },

    heal: (card, attacker, defender, context) => {
        const healAmount = card.val;
        attacker.hp = Math.min(attacker.max, attacker.hp + healAmount);
        return { healed: healAmount };
    },

    draw: (card, attacker, defender, context) => {
        const drawCount = card.effectValue || 1;
        let drew = 0;
        for (let i = 0; i < drawCount; i++) {
            if (attacker.deck.length > 0 && attacker.hand.length < 10) {
                const drawnCard = attacker.deck.pop();
                attacker.hand.push(drawnCard);
                drew++;
            }
        }
        return { drew: drew };
    },

    manaBoost: (card, attacker, defender, context) => {
        const boost = card.effectValue || 1;
        attacker.mana += boost;
        return { manaGained: boost };
    },

    special: (card, attacker, defender, context) => {
        attacker.buffs = attacker.buffs || {};
        switch (card.effectValue) {
            case "shield":
                attacker.buffs.shield = 10;
                return { shieldApplied: 10 };
            case "damageBoost":
                attacker.buffs.damageBoost = 15;
                return { damageBoostApplied: 15 };
            default:
                return {};
        }
    }
};
