// Area Database - COSMIC CHEMISTRY: DECK
// MVP Phase 1: 3 areas
// Each area corresponds to a topic in high school chemistry curriculum

export const AREAS = [
    {
        id: 1,
        name: "物質の構成",
        theme: "原子、イオン、同位体",
        bossName: "イオン王",
        bossHp: 150,
        unlockRank: "F",
        description: "物質を構成する基本的な粒子について学ぼう。原子の構造とイオンの形成を理解する最初の関門だ。",
        bossImage: "https://placehold.co/100x150/300/f05?text=ION",
        difficulty: 1,
        rewards: {
            energy: 200,
            minCards: 1,
            maxCards: 2
        }
    },
    {
        id: 2,
        name: "化学結合",
        theme: "イオン結合、共有結合、金属結合",
        bossName: "結合の守護者",
        bossHp: 180,
        unlockRank: "E",
        description: "原子同士がどのように結びつくかを理解しよう。化学結合の種類と性質を見極める力が試される。",
        bossImage: "https://placehold.co/100x150/036/0ff?text=BOND",
        difficulty: 2,
        rewards: {
            energy: 250,
            minCards: 1,
            maxCards: 3
        }
    },
    {
        id: 3,
        name: "物質の状態",
        theme: "気体、液体、固体、状態変化",
        bossName: "相変化の魔術師",
        bossHp: 200,
        unlockRank: "E",
        description: "物質の三態とその変化について探求しよう。温度と圧力が物質の状態をどう変えるか、その神秘に挑め。",
        bossImage: "https://placehold.co/100x150/606/f0f?text=STATE",
        difficulty: 2,
        rewards: {
            energy: 250,
            minCards: 2,
            maxCards: 3
        }
    }
];

// Future areas (planned for Phase 2+)
// 4. 化学反応 (化学反応式、量的関係)
// 5. 酸と塩基 (pH、中和反応、塩)
// 6. 酸化還元 (酸化数、酸化剤、還元剤)
// 7. 電池・電気分解 (ボルタ電池、電気分解)
// 8. 無機化学(非金属) (ハロゲン、硫黄、窒素)
// 9. 無機化学(金属) (アルカリ金属、遷移元素)
// 10. 有機化学(脂肪族) (アルカン、アルコール、カルボン酸)
// 11. 有機化学(芳香族) (ベンゼン、フェノール、アニリン)
// 12. 高分子化合物 (合成高分子、天然高分子)

export function getAreaById(id) {
    return AREAS.find(area => area.id === id);
}

export function getUnlockedAreas(playerRank) {
    const rankOrder = ["F", "E", "D", "C", "B", "A", "S"];
    const playerRankIndex = rankOrder.indexOf(playerRank);

    return AREAS.filter(area => {
        const areaRankIndex = rankOrder.indexOf(area.unlockRank);
        return areaRankIndex <= playerRankIndex;
    });
}
