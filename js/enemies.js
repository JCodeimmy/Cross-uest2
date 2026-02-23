// ============================================
// Enemy Definitions
// ============================================

const Enemies = {
    enemy_1: {
        id: 'enemy_1',
        name: '小怪',
        description: '廁所裡的神秘存在',
        icon: '👻',
        stats: {
            hp: 20,
            maxHp: 20,
            atk: 6,
            cr: 0,
            cd: 1.5
        },
        difficulty: 1,
        rewards: {
            items: ['spoiled_breakfast'],
            itemChance: 0.9
        },
        dialogue: {
            intro: '你遇到了一個神秘的存在！',
            attack: '敵人發動攻擊！',
            defeat: '敵人消散了...'
        }
    },

    enemy_2: {
        id: 'enemy_2',
        name: '走廊守衛',
        description: '巡邏在走廊的守衛',
        icon: '🚶',
        stats: {
            hp: 30,
            maxHp: 30,
            atk: 8,
            cr: 3,
            cd: 1.6
        },
        difficulty: 2,
        rewards: {
            items: ['healing_herb'],
            itemChance: 0.4
        },
        dialogue: {
            intro: '守衛攔住了你的去路！',
            attack: '守衛揮舞著教鞭！',
            defeat: '守衛讓開了道路...'
        }
    },

    enemy_3: {
        id: 'enemy_3',
        name: '會卿守門人',
        description: '守護會卿大樓的強大敵人',
        icon: '💂',
        stats: {
            hp: 50,
            maxHp: 50,
            atk: 12,
            cr: 5,
            cd: 1.7
        },
        difficulty: 3,
        rewards: {
            items: ['mysterious_pill', 'healing_herb'],
            itemChance: 0.5
        },
        dialogue: {
            intro: '會卿守門人出現了！',
            attack: '守門人使用了強力攻擊！',
            defeat: '守門人敗退了！'
        }
    },

    mimic: {
        id: 'mimic',
        name: '寶箱怪',
        description: '偽裝成寶箱的狡猾怪物',
        icon: '📦',
        stats: {
            hp: 60,
            maxHp: 60,
            atk: 15,
            cr: 10,
            cd: 2.0
        },
        difficulty: 3,
        rewards: {
            items: ['mimic_shell'],
            itemChance: 1.0
        },
        dialogue: {
            intro: '寶箱突然張開了大嘴！',
            attack: '寶箱怪咬了過來！',
            defeat: '寶箱怪散架了...'
        }
    },

    boss_shanshan: {
        id: 'boss_shanshan',
        name: '姍姍老師',
        description: '傳說中的守門員，擁有強大的力量',
        icon: '👩‍🏫',
        stats: {
            hp: 120,
            maxHp: 120,
            atk: 18,
            cr: 25,
            cd: 2.0
        },
        difficulty: 4,
        isBoss: true,
        rewards: {
            items: ['telescope'],
            itemChance: 1.0
        },
        dialogue: {
            intro: '「年輕人快回去掃地！」',
            attack: '姍姍老師揮動了掃把！',
            defeat: '姍姍老師：「好吧...這次放過你...」'
        },
        specialAttack: {
            name: '掃地風暴',
            damage: 33,
            message: '姍姍老師使出了必殺技「掃地風暴」！',
            triggerOnce: true
        }
    },

    boss_rooftop: {
        id: 'boss_rooftop',
        name: '足夠強的Boss',
        description: '阻擋在十字架前的終極守護者',
        icon: '👹',
        stats: {
            hp: 150,
            maxHp: 150,
            atk: 20,
            cr: 15,
            cd: 2.5
        },
        difficulty: 5,
        isBoss: true,
        rewards: {
            items: ['mysterious_pill'],
            itemChance: 1.0
        },
        dialogue: {
            intro: '「你以為這就能登上十字架？」',
            attack: '足夠強的Boss發動了猛烈攻擊！',
            defeat: '「不可能...我明明足夠強...」'
        },
        specialAttack: {
            name: '滅世一擊',
            damage: 40,
            message: '足夠強的Boss使出了「滅世一擊」！',
            triggerOnce: true
        }
    },

    boss_octopus: {
        id: 'boss_octopus',
        name: '汙水章魚王',
        description: '潛伏在汙水之殿的巨大生物',
        icon: '🐙',
        stats: {
            hp: 200,
            maxHp: 200,
            atk: 8,
            cr: 5,
            cd: 1.5
        },
        difficulty: 5,
        isBoss: true,
        rewards: {
            items: [],
            itemChance: 0
        },
        dialogue: {
            intro: '巨大的觸手從汙水中升起！',
            attack: '深海章魚揮舞觸手攻擊！',
            defeat: '章魚巨大的身軀倒下了...'
        },
        specialAttack: {
            name: '汙水炸彈',
            damageMin: 5,
            damageMax: 10,
            message: '深海章魚噴出了「汙水炸彈」！',
            debuff: {
                stat: 'atk',
                amount: -2,
                duration: 2
            }
        }
    }
};

// Get enemy by ID
function getEnemy(enemyId) {
    const enemy = Enemies[enemyId];
    if (!enemy) return null;
    return Utils.clone(enemy);
}

// Get random enemy by difficulty
function getRandomEnemy(difficulty) {
    const eligible = Object.values(Enemies).filter(e => e.difficulty <= difficulty && !e.isBoss);
    if (eligible.length === 0) return getEnemy('enemy_1');
    return Utils.clone(eligible[Utils.randomInt(0, eligible.length - 1)]);
}
