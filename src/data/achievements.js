// Achievement Database - COSMIC CHEMISTRY: DECK
// Total: 10 achievements for MVP

export const ACHIEVEMENTS = [
    {
        id: 'first_win',
        name: '初勝利',
        description: '初めてバトルに勝利する',
        icon: '🏆',
        condition: (userData) => (userData.totalWins || 0) >= 1,
        reward: { energy: 100 }
    },
    {
        id: 'win_10',
        name: '戦士の証',
        description: '10回バトルに勝利する',
        icon: '⚔️',
        condition: (userData) => (userData.totalWins || 0) >= 10,
        reward: { energy: 300 }
    },
    {
        id: 'win_30',
        name: 'ベテラン',
        description: '30回バトルに勝利する',
        icon: '🎖️',
        condition: (userData) => (userData.totalWins || 0) >= 30,
        reward: { energy: 500 }
    },
    {
        id: 'collector_10',
        name: 'コレクター',
        description: 'カードを10枚集める',
        icon: '📚',
        condition: (userData) => (userData.collection || []).length >= 10,
        reward: { energy: 200 }
    },
    {
        id: 'collector_20',
        name: '上級コレクター',
        description: 'カードを20枚集める',
        icon: '📖',
        condition: (userData) => (userData.collection || []).length >= 20,
        reward: { energy: 400 }
    },
    {
        id: 'rank_e',
        name: 'ランクE到達',
        description: 'ランクEに昇格する',
        icon: 'E',
        condition: (userData) => {
            const rankOrder = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
            return rankOrder.indexOf(userData.rank || 'F') >= rankOrder.indexOf('E');
        },
        reward: { energy: 200 }
    },
    {
        id: 'rank_c',
        name: 'ランクC到達',
        description: 'ランクCに昇格する',
        icon: 'C',
        condition: (userData) => {
            const rankOrder = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
            return rankOrder.indexOf(userData.rank || 'F') >= rankOrder.indexOf('C');
        },
        reward: { energy: 500 }
    },
    {
        id: 'gacha_5',
        name: 'ガチャ愛好家',
        description: 'ガチャを5回引く',
        icon: '🎰',
        condition: (userData) => (userData.gachaCount || 0) >= 5,
        reward: { energy: 150 }
    },
    {
        id: 'upgrade_card',
        name: '強化マスター',
        description: 'カードを1回強化する',
        icon: '⬆️',
        condition: (userData) => {
            if (!userData.cardLevels) return false;
            return Object.values(userData.cardLevels).some(level => level > 1);
        },
        reward: { energy: 200 }
    },
    {
        id: 'deck_complete',
        name: 'デッキビルダー',
        description: 'デッキを20枚で完成させる',
        icon: '🃏',
        condition: (userData) => {
            if (!userData.decks || !userData.decks[0]) return false;
            return userData.decks[0].cards && userData.decks[0].cards.length >= 20;
        },
        reward: { energy: 300 }
    }
];

// Get achievement by ID
export function getAchievementById(id) {
    return ACHIEVEMENTS.find(a => a.id === id);
}

// Check which achievements are completed but not yet claimed
export function getNewAchievements(userData) {
    const claimed = userData.claimedAchievements || [];
    return ACHIEVEMENTS.filter(a =>
        a.condition(userData) && !claimed.includes(a.id)
    );
}

// Get all achievement progress
export function getAchievementProgress(userData) {
    return ACHIEVEMENTS.map(a => ({
        ...a,
        completed: a.condition(userData),
        claimed: (userData.claimedAchievements || []).includes(a.id)
    }));
}
