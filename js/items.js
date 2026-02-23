// ============================================
// Item Definitions
// ============================================

const ITEM_TYPES = {
    KEY: 'key',
    EQUIPMENT: 'equipment',
    CONSUMABLE: 'consumable'
};

const Items = {
    key: {
        id: 'key',
        name: '鑰匙',
        description: '開啟會卿大樓4F通往屋頂的門。這把關鍵的鑰匙被藏在聖心大樓廁所的置物櫃裡。',
        type: ITEM_TYPES.KEY,
        icon: '🔑',
        canDrop: false,
        canEquip: false,
        canUse: false
    },

    burning_broom: {
        id: 'burning_broom',
        name: '燃燒掃把',
        description: '一把燃燒著火焰的掃把。裝備時攻擊力+5，但每次攻擊有20%機率燃燒反噬自己（受到攻擊力×0.5的傷害）。',
        type: ITEM_TYPES.EQUIPMENT,
        icon: '🧹',
        canDrop: true,
        canEquip: true,
        canUse: false,
        effects: {
            atk: 5,
            selfDamageChance: 0.2,
            selfDamageMultiplier: 0.5
        }
    },

    spoiled_breakfast: {
        id: 'spoiled_breakfast',
        name: '壞掉的早餐',
        description: '看起來有點可疑的早餐。使用後有60%機率回復10HP，40%機率扣除5HP。',
        type: ITEM_TYPES.CONSUMABLE,
        icon: '🍱',
        canDrop: true,
        canEquip: false,
        canUse: true,
        effects: {
            healChance: 0.6,
            healAmount: 10,
            damageChance: 0.4,
            damageAmount: 5
        }
    },

    mysterious_pill: {
        id: 'mysterious_pill',
        name: '藥石',
        description: '神秘的藥丸，效果未知。可能回復HP、增加攻擊力、無效果，或是中毒...',
        type: ITEM_TYPES.CONSUMABLE,
        icon: '💊',
        canDrop: true,
        canEquip: false,
        canUse: true,
        effects: {
            random: true,
            outcomes: [
                { chance: 0.4, type: 'heal', amount: 20, message: '感覺精神好多了！回復20HP！' },
                { chance: 0.3, type: 'none', message: '好像什麼事都沒發生...' },
                { chance: 0.2, type: 'buff', stat: 'tempAtk', amount: 3, duration: 3, message: '力量湧現！攻擊力暫時+3！' },
                { chance: 0.1, type: 'poison', damage: 5, duration: 3, message: '糟糕！中毒了！每回合-5HP...' }
            ]
        }
    },

    healing_herb: {
        id: 'healing_herb',
        name: '繃帶',
        description: '簡單但有效的繃帶。使用後穩定回復15HP。',
        type: ITEM_TYPES.CONSUMABLE,
        icon: '🩹',
        canDrop: true,
        canEquip: false,
        canUse: true,
        effects: {
            heal: 15
        }
    },

    fragment: {
        id: 'fragment',
        name: '魔法石碎片',
        description: '神秘的魔法石碎片。收集5個可以解鎖隱藏內容...',
        type: ITEM_TYPES.KEY,
        icon: '📜',
        canDrop: false,
        canEquip: false,
        canUse: false,
        stackable: true
    },

    mysterious_stone: {
        id: 'mysterious_stone',
        name: '神秘的魔法石',
        description: '由五片魔法石碎片聚合而成的強大寶石。散發著奇異的光芒，似乎能開啟通往深處的大門。攜帶在身上，有概率使攻擊觸發魔力暴走。',
        type: ITEM_TYPES.KEY,
        icon: '💎',
        canDrop: false,
        canEquip: false,
        canUse: false
    },

    telescope: {
        id: 'telescope',
        name: '望遠鏡',
        description: '一個精緻的望遠鏡。裝備後也許能看到遠處的東西...',
        type: ITEM_TYPES.EQUIPMENT,
        icon: '🔭',
        canDrop: false,
        canEquip: true,
        canUse: false
    },

    easter_egg: {
        id: 'easter_egg',
        name: '彩蛋',
        description: '隱藏的彩蛋！你發現了！',
        type: ITEM_TYPES.KEY,
        icon: '🥚',
        canDrop: false,
        canEquip: false,
        canUse: false,
        stackable: true
    },

    rope: {
        id: 'rope',
        name: '繩子',
        description: '從學長那裡得到的繩子。也許會有用...',
        type: ITEM_TYPES.KEY,
        icon: '🪢',
        canDrop: false,
        canEquip: false,
        canUse: false
    },

    he_msg_token: {
        id: 'he_msg_token',
        name: '何昇諒的信物',
        description: '何昇諒給予的信物。證明你通過了他的考驗。似乎與季昇瑜有關...',
        type: ITEM_TYPES.KEY,
        icon: '📜',
        canDrop: false,
        canEquip: false,
        canUse: false
    },

    hair: {
        id: 'hair',
        name: 'O民的頭髮',
        description: '極其稀有的紀念品，無法丟棄，沒有任何作用。',
        type: ITEM_TYPES.KEY,
        icon: '⌇',
        canDrop: false,
        canEquip: false,
        canUse: false
    },

    mimic_shell: {
        id: 'mimic_shell',
        name: '寶箱怪的外殼',
        description: '裝備後，若受到致死攻擊，生命值會保留在1點，但外殼會隨之碎裂。',
        type: ITEM_TYPES.EQUIPMENT,
        icon: '🛡️',
        canDrop: true,
        canEquip: true,
        canUse: false,
        effects: {
            saveFromDeath: true
        }
    },

    coward_textbook: {
        id: 'coward_textbook',
        name: '懦夫講義',
        description: '傳說中能使數學輕鬆頂標的講義，命中機率高達80%!',
        type: ITEM_TYPES.KEY,
        icon: '📕',
        canDrop: false,
        canEquip: false,
        canUse: true
    },

    buckyball: {
        id: 'buckyball',
        name: '巴克球',
        description: '由60顆碳原子組成的分子，有時也能兼當教室裡的排球。',
        type: ITEM_TYPES.KEY,
        icon: '⚽',
        canDrop: true,
        canEquip: false,
        canUse: false
    }
};

// Function to use an item
function useItem(itemId, player) {
    const item = Items[itemId];
    if (!item || !item.canUse) return null;

    const result = {
        success: false,
        message: '',
        hpChange: 0,
        consumed: false,
        effects: []
    };

    switch (itemId) {
        case 'spoiled_breakfast':
            if (Utils.random() < item.effects.healChance) {
                result.hpChange = item.effects.healAmount;
                result.message = `吃下早餐...味道還行！回復${item.effects.healAmount}HP！`;
            } else {
                result.hpChange = -item.effects.damageAmount;
                result.message = `吃下早餐...噁！好難吃！損失${item.effects.damageAmount}HP！`;
            }
            result.success = true;
            result.consumed = true;
            break;

        case 'mysterious_pill':
            const roll = Utils.random();
            let cumulative = 0;
            for (const outcome of item.effects.outcomes) {
                cumulative += outcome.chance;
                if (roll < cumulative) {
                    result.message = outcome.message;
                    result.success = true;
                    result.consumed = true;

                    switch (outcome.type) {
                        case 'heal':
                            result.hpChange = outcome.amount;
                            break;
                        case 'buff':
                            result.effects.push({
                                type: 'buff',
                                stat: outcome.stat,
                                amount: outcome.amount,
                                duration: outcome.duration
                            });
                            break;
                        case 'poison':
                            result.effects.push({
                                type: 'poison',
                                damage: outcome.damage,
                                duration: outcome.duration
                            });
                            break;
                        case 'none':
                        default:
                            break;
                    }
                    break;
                }
            }
            break;

        case 'healing_herb':
            result.hpChange = item.effects.heal;
            result.message = `使用繃帶，回復${item.effects.heal}HP！`;
            result.success = true;
            result.consumed = true;
            break;

        case 'coward_textbook':
            Game.state.flags['math_helper_active'] = true;
            AchievementSystem.unlock('fuqiang_pride');
            result.message = '你熟讀了懦夫講義...感覺數學變得簡單了！\n(戰鬥中遇到數學題將刪去一個錯誤選項)';
            result.success = true;
            result.consumed = true;
            break;
    }

    return result;
}

// Get item by ID
function getItem(itemId) {
    return Items[itemId] || null;
}
